import { Router } from "express";
import { 
    createOrder, 
    getOrders, 
    getOneOrder, 
    updateOrderStatus, 
    deleteOrder 
} from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/jwt.middleware.js";

const router = Router();

// Secure all routes with verifyJWT
router.use(verifyJWT); 

router.route("/createorder").post(createOrder);
router.route("/getorders").get(getOrders); // Renamed for better REST practice
router.route("/:id").get(getOneOrder);     // Clean URL structure
router.route("/updateorderstatus/:orderId").patch(updateOrderStatus);
router.route("/delete/:id").delete(deleteOrder);

export default router;