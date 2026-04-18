import { Wishlist } from "../models/wishlist.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// controllers/wishlist.controller.js
export const toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id;

        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            // Case 1: No wishlist exists, create it with the first product
            wishlist = await Wishlist.create({
                user: userId,
                products: [productId]
            });
            return res.status(200).json({ data: wishlist, message: "Added to wishlist" });
        }

        // Case 2: Wishlist exists. 
        // We MUST use .toString() because Mongoose IDs are objects, not strings.
        const productIndex = wishlist.products.findIndex(id => id.toString() === productId);

        if (productIndex > -1) {
            // Product is already there, so REMOVE it
            wishlist.products.splice(productIndex, 1);
            await wishlist.save();
            return res.status(200).json({ data: wishlist.products, message: "Removed from wishlist" });
        } else {
            // Product is NOT there, so PUSH it
            wishlist.products.push(productId);
            await wishlist.save();
            return res.status(200).json({ data: wishlist.products, message: "Added to wishlist" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getWishlist = async (req, res) => {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");
    return res.status(200).json(new ApiResponse(200, wishlist?.products || [], "Wishlist fetched"));
};