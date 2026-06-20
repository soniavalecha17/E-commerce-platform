import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  // CRITICAL: This allows the dashboard to filter orders by Artisan
  artisanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderPrice: { type: Number, required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [orderItemSchema],
    address: { type: String, required: true },
    status: {
      type: String,
      // Added PROCESSING to the workflow
      enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
      default: 'PENDING',
    },
    // New fields for tracking
    trackingNumber: { 
      type: String, 
      default: null 
    },
    lastUpdated: { 
      type: Date, 
      default: Date.now 
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);