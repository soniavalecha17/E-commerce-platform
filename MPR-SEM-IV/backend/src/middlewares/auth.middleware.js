import jwt from "jsonwebtoken";

export const verifyUser = async (req, res, next) => {
    try {
        // 1. Get token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "Unauthorized access: No token provided." });
        }

        // 2. Verify the token using your secret key
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // 3. Attach the user data to the request object
        // Ensure your model/login logic adds the _id to the token payload
        req.user = decoded; 

        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};