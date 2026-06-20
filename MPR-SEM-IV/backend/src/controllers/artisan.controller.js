import mongoose from 'mongoose';
import { Product } from '../models/product.models.js';
import { Order } from '../models/order.models.js';
import Review from '../models/reviews.models.js'; // Ensure this path matches your file structure
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getDashboardStats = async (req, res) => {
    try {
        if (!req.user?._id) return res.status(401).json({ message: "Unauthorized" });
        
        const artisanId = new mongoose.Types.ObjectId(req.user._id);

        // 1. Existing order stats aggregation
        console.log("Artisan ID:", artisanId);
        const orderStats = await Order.aggregate([
            { $unwind: "$orderItems" },
            { $match: { "orderItems.artisanId": artisanId } },
            { 
                $group: {
                    _id: null,
                    totalRevenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } },
                    uniqueOrders: { $addToSet: "$_id" }
                }
            }
        ]);

        const stats = orderStats[0] || { totalRevenue: 0, uniqueOrders: [] };

        // 2. Fetch total products
        const totalProducts = await Product.countDocuments({ owner: artisanId });

        // 3. New: Fetch total reviews for all products owned by this artisan
        // First, get all product IDs for this artisan
        const artisanProductIds = await Product.find({ owner: artisanId }).distinct('_id');
        
        // Count all reviews where the productId is in that list
        const totalReviews = await Review.countDocuments({ productId: { $in: artisanProductIds } });

        res.status(200).json({
            success: true,
            data: {
                totalProducts,
                totalRevenue: stats.totalRevenue,
                totalOrders: stats.uniqueOrders.length,
                pendingOrders: 0, // Placeholder: implement your logic here
                totalReviews      // Added this field
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add this to your artisan.controller.js
export const getArtisanOrders = asyncHandler(async (req, res) => {
    // 1. Debug: Check if the ID matches what is in your DB
    console.log("Searching for orders with artisanId:", req.user._id);

    const orders = await Order.find({ "orderItems.artisanId": req.user._id })
        .populate("customer", "username email")
        .populate("orderItems.productId", "name price");

    // 2. Debug: See what is actually found
    console.log("Orders found:", orders.length);

    return res.status(200).json(new ApiResponse(200, orders, "Orders fetched"));
});