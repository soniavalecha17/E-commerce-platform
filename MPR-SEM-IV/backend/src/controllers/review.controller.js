import Review from '../models/reviews.models.js';
import { Product } from '../models/product.models.js';

// @desc    Get all reviews for a specific product
// @route   GET /api/v1/reviews/product/:productId
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId }).sort({ created_at: -1 });
    
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json({ 
      message: "Failed to fetch reviews", 
      error: error.message 
    });
  }
};

// @desc    Post a new review
// @route   POST /api/v1/reviews/add
export const addReview = async (req, res) => {
  try {
    const { productId, customer_name, rating, review_text } = req.body;

    if (!productId || !customer_name || !rating || !review_text) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const newReview = new Review({
      productId,
      customer_name,
      rating,
      review_text
    });

    const savedReview = await newReview.save();
    return res.status(201).json(savedReview);
  } catch (error) {
    return res.status(500).json({ 
      message: "Failed to save review", 
      error: error.message 
    });
  }
};

// @desc    Sanity check route to test mounting
// @route   GET /api/v1/reviews/sanity-check
export const sanityCheck = (req, res) => {
  return res.json({ message: "Review router and controller are successfully mounted!" });
};

// @desc    Get total reviews count for an artisan's products
// @route   GET /api/v1/reviews/artisan-count/:artisanId
export const getArtisanReviewCount = async (req, res) => {
  try {
    const { artisanId } = req.params;

    // 1. Find all products owned by this artisan to get their IDs
    // (Assuming your Product model has an 'owner' field)
    const Product = (await import('../models/product.models.js')).default; 
    const artisanProducts = await Product.find({ owner: artisanId }).select('_id');
    
    const productIds = artisanProducts.map(product => product._id);

    // 2. Count how many total reviews exist for those products
    const totalReviewsCount = await Review.countDocuments({ productId: { $in: productIds } });

    return res.status(200).json({ success: true, count: totalReviewsCount });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: "Failed to calculate review stats", 
      error: error.message 
    });
  }
};

export const getArtisanReviews = async (req, res) => {
  try {
    const artisanId = req.user._id;
    
    // 1. Get all product IDs owned by this artisan
    const artisanProductIds = await Product.find({ owner: artisanId }).distinct('_id');
    
    // 2. Fetch all reviews for those products
    const reviews = await Review.find({ productId: { $in: artisanProductIds } })
                                .populate('productId', 'name') // Optional: get product name
                                .sort({ created_at: -1 });

    return res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};