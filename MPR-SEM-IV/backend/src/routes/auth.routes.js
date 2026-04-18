import { Router } from "express";
import { registerUser } from "../controllers/auth.controller.js";
import { loginUser } from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router=Router();

router.route("/registeruser").post(
    upload.fields([
        { name: "idProof", maxCount: 1 } // Accept the file from frontend
    ]),
    registerUser
);

router.route("/loginuser").post(loginUser)

export default router

