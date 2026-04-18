import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    productImage: {
      type: String, //it will be accepted as a url from cloud services
    },
    price: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    salesCount: { type: Number, default: 0 },
    // Inside your productSchema
isApproved: {
    type: Boolean,
    default: false
},// Useful for "Top Selling Products"
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', ProductSchema);
