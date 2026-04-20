import { Router } from "express";
import { 
    createProduct, 
    getProducts, 
    getOneProduct, 
    updateProduct, 
    deleteProduct, 
    getArtisanProducts,
    createOnlineOrder 
} from "../controllers/product.controller.js"; // Grouped imports for professional clarity
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/jwt.middleware.js";

const router = Router();

// --- 1. STATIC & SENSITIVE ROUTES (Place these at the TOP) ---
// This prevents dynamic routes from "stealing" the request
router.route("/create-online-order").post(verifyJWT, createOnlineOrder); 
router.route("/getproducts").get(getProducts);
router.route("/my-products").get(verifyJWT, getArtisanProducts);

// --- 2. PROTECTED ACTION ROUTES ---
router.route("/createproduct").post(
    verifyJWT, 
    upload.fields([{ name: "productImage", maxCount: 1 }]), 
    createProduct
);

// --- 3. DYNAMIC ROUTES (Place these at the BOTTOM) ---
// Since these use ":id", they are catch-all routes
router.route("/getoneproduct/:id").get(getOneProduct);
router.route("/updateproduct/:id").patch(verifyJWT, updateProduct);
router.route("/deleteproduct/:id").delete(verifyJWT, deleteProduct);

export default router;