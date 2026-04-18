import { Router } from "express";
import { 
    getAdminStats, 
    getAllUsers, 
    getAllProductsAdmin, 
    getArtisanPerformance, 
    getCustomerStats, 
    toggleArtisanVerification, 
    toggleProductApproval 
} from "../controllers/admin.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/jwt.middleware.js";

const router = Router();

// --- 🔓 TEMPORARY BYPASS FOR DEVELOPMENT ---
// Comment these out if you want to access the dashboard via the "Direct Admin" button
// router.use(verifyJWT, isAdmin); 

// --- 📊 ADMIN DATA ROUTES ---
router.route("/stats").get(getAdminStats);
router.route("/users").get(getAllUsers);
router.route("/all").get(getAllProductsAdmin);
router.route("/artisan-performance").get(getArtisanPerformance);
router.route("/customer-stats").get(getCustomerStats);

// --- ⚡ ACTION ROUTES ---
// We keep protection here for safety, or remove them temporarily if you aren't logged in
router.route("/approve-product/:productId").patch(toggleProductApproval);
router.route("/verify-artisan/:userId").patch(toggleArtisanVerification);

export default router;