import express from 'express';
import { getDashboardStats, getArtisanOrders } from '../controllers/artisan.controller.js'; // Ensure you import both
import { verifyJWT } from "../middlewares/jwt.middleware.js";

const router = express.Router();

// Stats Route
router.route('/dashboard-stats').get(verifyJWT, getDashboardStats);

// Artisan Orders Route
// Matches your frontend API.get("/orders/artisan/all", ...)
router.route('/orders/all').get(verifyJWT, getArtisanOrders);

export default router;