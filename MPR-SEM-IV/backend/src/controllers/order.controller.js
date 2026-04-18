import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.models.js"; 
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.models.js";
import mongoose from "mongoose";

// --- CREATE ORDER ---
const createOrder = asyncHandler(async (req, res) => {
    const { orderItems, address } = req.body;

    if (!req.user?._id) {
        throw new ApiError(401, "User session not found. Please log in again.");
    }
    const userId = req.user._id;

    if (!orderItems || orderItems.length === 0) {
        throw new ApiError(400, "Your cart is empty");
    }

    let totalPrice = 0;
    const validatedOrderItems = [];

    for (const item of orderItems) {
        const pId = item.productId?._id || item.productId;

        const product = await Product.findById(pId);
        if (!product) {
            throw new ApiError(404, `Product not found: ${pId}`);
        }

        if (product.stock < item.quantity) {
            throw new ApiError(400, `Not enough stock for ${product.name}`);
        }

        totalPrice += product.price * item.quantity;

        // Ensure product.owner exists to prevent 'reading _id of null'
        if (!product.owner) {
            throw new ApiError(400, `Product ${product.name} has no assigned artisan.`);
        }

        const artisanId = new mongoose.Types.ObjectId(product.owner); 

        validatedOrderItems.push({
            productId: product._id,
            quantity: item.quantity,
            price: product.price,
            artisanId: artisanId 
        });

        product.salesCount += item.quantity;
        product.stock -= item.quantity;
        await product.save();
    }

    const order = await Order.create({
        orderPrice: totalPrice,
        customer: userId,
        orderItems: validatedOrderItems,
        address: address || "Default Address",
        status: "PENDING"
    });

    return res.status(201).json(
        new ApiResponse(201, "Order placed successfully!", order)
    );
});

// --- GET ORDERS (Refined for Artisan Management) ---
const getOrders = asyncHandler(async (req, res) => {
    if (!req.user?._id) {
        throw new ApiError(401, "Please login to view orders");
    }

    const userId = new mongoose.Types.ObjectId(req.user._id);
    const userRole = req.user.role?.toUpperCase() || "CUSTOMER";

    let query = {};

    if (userRole === "ARTISAN") {
        query = { "orderItems.artisanId": userId };
    } else if (userRole === "ADMIN") {
        query = {}; 
    } else {
        query = { customer: userId }; 
    }

    const rawOrders = await Order.find(query)
        .populate("customer", "username email")
        .populate("orderItems.productId", "name price productImage")
        .sort("-createdAt");

    // DATA CLEANING: If artisan, only show them THEIR items in an order
    let finalOrders = rawOrders;
    
    if (userRole === "ARTISAN") {
        finalOrders = rawOrders.map(order => {
            const orderObj = order.toObject();
            orderObj.orderItems = orderObj.orderItems.filter(
                item => item.artisanId?.toString() === userId.toString()
            );
            return orderObj;
        });
    }

    return res.status(200).json(
        new ApiResponse(200, "Orders fetched successfully", finalOrders)
    );
});

// --- GET ONE ORDER ---
const getOneOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!req.user?._id) {
        throw new ApiError(401, "Please login to view this order");
    }

    const order = await Order.findById(id)
        .populate("customer", "username email")
        .populate("orderItems.productId", "name price");

    if (!order) throw new ApiError(404, "Order not found");

    const userIdStr = req.user._id.toString();
    const isOwner = order.customer?._id.toString() === userIdStr;
    const isAdmin = req.user.role?.toLowerCase() === "admin";
    const isRelatedArtisan = order.orderItems.some(item => item.artisanId?.toString() === userIdStr);

    if (!isOwner && !isAdmin && !isRelatedArtisan) {
        throw new ApiError(403, "Access denied");
    }

    return res.status(200).json(new ApiResponse(200, "Order fetched successfully", order));
});

// --- UPDATE STATUS ---
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!req.user?._id) {
        throw new ApiError(401, "Unauthorized access");
    }

    const validStatuses = ["PENDING", "CANCELLED", "DELIVERED", "SHIPPED"];
    if (!validStatuses.includes(status?.toUpperCase())) {
        throw new ApiError(400, "Invalid status");
    }

    const order = await Order.findByIdAndUpdate(
        id,
        { $set: { status: status.toUpperCase() } },
        { new: true }
    );

    return res.status(200).json(new ApiResponse(200, "Order status updated", order));
});

// --- DELETE ORDER ---
const deleteOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!req.user?._id) {
        throw new ApiError(401, "Unauthorized access");
    }

    const order = await Order.findById(id);
    if (!order) throw new ApiError(404, "Order not found");

    if (order.customer.toString() !== req.user._id.toString() && req.user.role?.toLowerCase() !== "admin") {
        throw new ApiError(403, "Action not allowed");
    }

    await Order.findByIdAndDelete(id);
    return res.status(200).json(new ApiResponse(200, "Order deleted", {}));
});

export {
    createOrder,
    getOrders,
    getOneOrder,
    updateOrderStatus,
    deleteOrder
};