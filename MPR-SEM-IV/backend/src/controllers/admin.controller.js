import { User } from "../models/user.models.js";
import { Product } from "../models/product.models.js";
import { Order } from "../models/order.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// 📊 GET ALL DASHBOARD STATS
export const getAdminStats = asyncHandler(async (req, res) => {
    const [totalUsers, totalProducts, totalOrders, allOrders] = await Promise.all([
        User.countDocuments(),
        Product.countDocuments(),
        Order.countDocuments(),
        Order.find()
    ]);

    // Calculate total revenue from all orders
    const totalRevenue = allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    return res.status(200).json(
        new ApiResponse(200, "Admin stats fetched successfully", {
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue
        })
    );
});

// 👥 GET ALL USERS (To manage Customers & Artisans)
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password -refreshToken").sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, "Users fetched", users));
});

// 📦 GET ALL PRODUCTS (To Approve/Reject)
export const getAllProductsAdmin = asyncHandler(async (req, res) => {
    const products = await Product.find().populate("owner", "username email").sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, "Products fetched", products));
});

export const getArtisanPerformance = asyncHandler(async (req, res) => {
    // 1. Fetch artisans including the idProof field
    const artisans = await User.find({ role: "artisan" }).select("username email isVerified idProof");
    
    const performanceData = await Promise.all(artisans.map(async (artisan) => {
        const productCount = await Product.countDocuments({ owner: artisan._id });
        const artisanOrders = await Order.find({ "items.artisan": artisan._id });
        const totalRevenue = artisanOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        return {
            _id: artisan._id,
            username: artisan.username,
            email: artisan.email,
            isVerified: artisan.isVerified,
            idProof: artisan.idProof, // 👈 YOU WERE MISSING THIS LINE!
            productCount,
            revenue: totalRevenue
        };
    }));

    return res.status(200).json(new ApiResponse(200, "Artisan data fetched", performanceData));
});
export const getCustomerStats = asyncHandler(async (req, res) => {
    // Fetch all users with role 'customer'
    const customers = await User.find({ role: "customer" }).select("username email createdAt");

    const customerData = await Promise.all(customers.map(async (customer) => {
        const orderCount = await Order.countDocuments({ customer: customer._id });
        
        // Calculate total spent by this customer
        const customerOrders = await Order.find({ customer: customer._id });
        const totalSpent = customerOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        return {
            _id: customer._id,
            username: customer.username,
            email: customer.email,
            orderCount,
            totalSpent,
            joinedDate: customer.createdAt
        };
    }));

    return res.status(200).json(new ApiResponse(200, "Customer stats fetched", customerData));
});

// 1. Approve a product
export const toggleProductApproval = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    
    if (!product) throw new ApiError(404, "Product not found");

    product.isApproved = !product.isApproved; // Toggles between true/false
    await product.save();

    return res.status(200).json(new ApiResponse(200, "Product status updated", product));
});

// 2. Verify an Artisan
export const toggleArtisanVerification = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) throw new ApiError(404, "User not found");

    // 🛑 NEW CHECK: Prevent verification if no ID is uploaded
    if (!user.idProof || user.idProof.trim() === "") {
        throw new ApiError(400, "Cannot verify artisan: No ID proof has been uploaded.");
    }

    user.isVerified = !user.isVerified;
    await user.save({ validateBeforeSave: false }); 

    return res.status(200).json(
        new ApiResponse(200, "Verification status updated", user)
    );
});