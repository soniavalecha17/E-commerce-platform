import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js"; 
import { ApiError } from "../utils/ApiError.js";

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decoded?._id).select("-password -refreshToken");

        if (!user) {
            return res.status(401).json({ message: "Invalid Access Token" });
        }

        req.user = user; 
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized",
            error: error.message,
        });
    }
};

/**
 * isAdmin Middleware
 * Ensures the user has an 'admin' role. 
 * This must be placed AFTER verifyJWT in your routes.
 */
export const isAdmin = (req, res, next) => {
    // Check if the user exists (from verifyJWT) and if their role is admin
    if (req.user && req.user.role === "admin") {
        next(); // User is admin, proceed to the controller
    } else {
        // If not admin, return a 403 Forbidden error
        return res.status(403).json({
            success: false,
            message: "Access Denied: Administrative privileges required."
        });
    }
};