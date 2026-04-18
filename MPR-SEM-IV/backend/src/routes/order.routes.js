import { Router } from "express";
import { createOrder } from "../controllers/order.controller.js";
import { getOrders } from "../controllers/order.controller.js";
import { getOneOrder } from "../controllers/order.controller.js";
import { updateOrderStatus } from "../controllers/order.controller.js";
import { deleteOrder } from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/jwt.middleware.js";

const router=Router();

router.route("/createorder").post(verifyJWT,createOrder);
router.route("/getorders").get(verifyJWT,getOrders);
router.route("/getoneorder/:id").get(getOneOrder);
router.route("/updateorderstatus/:id").patch(updateOrderStatus);
router.route("/deleteorder/:id").delete(deleteOrder);

export default router