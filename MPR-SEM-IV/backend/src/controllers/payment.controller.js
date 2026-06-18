import Razorpay from "razorpay";
import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Initialize Razorpay with credentials from your .env file
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. Create Order
export const createRazorpayOrder = asyncHandler(async (req, res) => {
    const { amount } = req.body; // Amount coming from frontend checkout calculation

    if (!amount) {
        throw new ApiError(400, "Amount is required");
    }

    const options = {
        amount: Number(amount * 100), // Razorpay expects amount in paisa (e.g., ₹500 = 50000 paisa)
        currency: "INR",
        receipt: `receipt_rcpt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    if (!order) {
        throw new ApiError(500, "Something went wrong while creating Razorpay order");
    }

    return res.status(200).json(
        new ApiResponse(200, order, "Razorpay order initialized successfully")
    );
});

// 2. Verify Payment Authenticity
export const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Create a hash using your key secret to match against Razorpay's signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest("hex");

    if (razorpay_signature === expectedSign) {
        // ---- 🛒 PAYMENT SUCCESSFUL ----
        // You can now write your database logic here:
        // Update Order status to "Paid", clear user cart, etc.

        return res.status(200).json(
            new ApiResponse(200, { verified: true }, "Payment verified successfully")
        );
    } else {
        throw new ApiError(400, "Invalid payment signature. Transaction tampered.");
    }
});