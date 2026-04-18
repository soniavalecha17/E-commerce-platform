import { Router } from "express";
import { createProduct } from "../controllers/product.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { getProducts } from "../controllers/product.controller.js";
import { getOneProduct } from "../controllers/product.controller.js";
import { updateProduct } from "../controllers/product.controller.js";
import { deleteProduct } from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/jwt.middleware.js";
import { getArtisanProducts } from "../controllers/product.controller.js";

const router=Router();

router.route("/createproduct").post(upload.fields([{ name: "productImage", maxCount: 1 }]),verifyJWT,createProduct)
router.route("/getproducts").get(getProducts)
router.route("/getoneproduct/:id").get(getOneProduct)
router.route("/updateproduct/:id").patch(updateProduct)
router.route("/deleteproduct/:id").delete(deleteProduct)
router.route("/my-products").get(verifyJWT, getArtisanProducts);
export default router
