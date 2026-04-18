import React from "react";
import { Navigate } from "react-router-dom";

// This component checks if a user is logged in AND has the right role
const ProtectedRoute = ({ children, allowedRole }) => {
    // Get user from localStorage (ensure you save it there during login)
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        // Not logged in? Send them to the login page
        return <Navigate to="/login" replace />;
    }

    if (user.role !== allowedRole.toLowerCase()) {
        // Wrong role? Send them to their respective home
        return <Navigate to={user.role === "artisan" ? "/artisan-dashboard" : "/shop"} replace />;
    }

    return children;
};

export default ProtectedRoute;