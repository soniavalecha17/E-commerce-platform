import express from 'express';
import { 
  getProductReviews, 
  addReview, 
  sanityCheck,
  getArtisanReviewCount,
  getArtisanReviews // 1. Added import
} from '../controllers/review.controller.js';
import { verifyUser } from '../middlewares/auth.middleware.js'; // 2. Ensure your auth middleware is imported

const router = express.Router();

console.log("🚀 BOOTING UP REVIEWS ROUTER SUB-MODULE!");

// Route mappings
router.get('/sanity-check', sanityCheck);
router.get('/product/:productId', getProductReviews);
router.post('/add', addReview);
router.get('/artisan-count/:artisanId', getArtisanReviewCount);

// 3. New route for artisan to see all reviews
router.get('/artisan/all', verifyUser, getArtisanReviews);

export default router;