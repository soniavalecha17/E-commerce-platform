import { Router } from "express";
import { toggleWishlist, getWishlist } from "../controllers/wishlist.controller.js";
import { verifyJWT } from "../middlewares/jwt.middleware.js";

const router = Router();

router.route("/").get(verifyJWT, getWishlist);
router.route("/toggle").post(verifyJWT, toggleWishlist);

export default router;