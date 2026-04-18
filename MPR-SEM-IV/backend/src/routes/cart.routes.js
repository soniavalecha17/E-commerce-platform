import express from "express";
import { addToCart, getCart ,decreaseQuantity,removeFromCart} from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/jwt.middleware.js";

const router = express.Router();

router.post("/add",verifyJWT, addToCart);
router.get("/",verifyJWT, getCart);
router.post("/decrease",verifyJWT, decreaseQuantity); // ADD THIS
router.post("/remove",verifyJWT, removeFromCart);

export default router;