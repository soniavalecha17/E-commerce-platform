import mongoose from 'mongoose';
import { Product } from '../models/product.models.js';
import { Order } from '../models/order.models.js';

export const getDashboardStats = async (req, res) => {
    try {
        if (!req.user?._id) return res.status(401).json({ message: "Unauthorized" });
        
        const artisanId = new mongoose.Types.ObjectId(req.user._id);

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
        const totalProducts = await Product.countDocuments({ owner: artisanId });

        res.status(200).json({
            success: true,
            data: {
                totalProducts,
                totalRevenue: stats.totalRevenue,
                totalOrders: stats.uniqueOrders.length
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};