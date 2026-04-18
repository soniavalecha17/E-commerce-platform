import express from 'express';
import { getDashboardStats } from '../controllers/artisan.controller.js'
import { verifyJWT} from "../middlewares/jwt.middleware.js"

const router = express.Router();

/**
 * @route   GET /api/artisan/dashboard-stats
 * @desc    Get aggregated stats for the Artisan Dashboard
 * @access  Private (Artisan only)
 */
router.get(
    '/dashboard-stats', 
    verifyJWT,
    getDashboardStats
);

export default router;