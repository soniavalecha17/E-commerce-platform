import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadFileonCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);

        console.log("Found User:", user ? "Yes" : "No");
        console.log("Access Secret:", process.env.ACCESS_TOKEN_SECRET ? "Exists" : "MISSING");
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("🔥 TOKEN ERROR:", error);
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

export const registerUser = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    if ([email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required!");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with this email or username already exists!");
    }

    // SECURITY: Prevent users from registering as "admin" via API tools like Postman
    const finalRole = role?.toLowerCase() === "admin" ? "customer" : (role?.toLowerCase() || "customer");

    let idProofLocalPath;
    if (role === "artisan") {
        if (!req.files || !req.files.idProof) {
            throw new ApiError(400, "Artisans must upload an ID Proof");
        }
        idProofLocalPath = req.files.idProof[0].path;
    }

    // 3. Upload to Cloudinary
    const idProof = idProofLocalPath ? await uploadFileonCloudinary(idProofLocalPath) : "";

    const user = await User.create({
        username: username.toLowerCase(),
        password,
        email: email.toLowerCase(),
        role: finalRole,
        idProof: idProof?.url || "",
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering!");
    }

    return res.status(201).json(
        new ApiResponse(201, "User registered successfully", createdUser)
    );
});
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({
        $or: [
            { email: email.toLowerCase() },
            { username: email.toLowerCase() }
        ]
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    // --- 🛡️ THE FIX: VERIFICATION GUARD ---
    // This will catch 'sita' because her status is 'Pending' in your dashboard
    if (user.role === "artisan" && user.isVerified !== true) {
        throw new ApiError(
            403, 
            "Your account is pending verification. Please wait for Admin approval."
        );
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);
    
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? 'None' : 'Lax' 
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, "User logged in successfully", { 
                user: loggedInUser, 
                accessToken, 
                refreshToken 
            })
        );
});