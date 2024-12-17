import express from "express";
import UserController from "../controllers/userController.js";
import AuthHandler from "../middleware/AuthHandler.js";
import AuthController from "../controllers/authController.js";
const router = express.Router();

//Public Routes
router.get("/", AuthHandler, AuthController.getProfile);
// router.post("/login", UserController.userLogin);

export { router as AuthRoutes };
