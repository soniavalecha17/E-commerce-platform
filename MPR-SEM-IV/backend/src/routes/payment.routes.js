import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createRazorpayOrder, verifyPayment } from "../controllers/payment.controller.js";

const router = Router();

router.route("/create-order").post(verifyJWT, createRazorpayOrder);
router.route("/verify-payment").post(verifyJWT, verifyPayment);

export default router;