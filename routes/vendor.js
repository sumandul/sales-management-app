import express from "express";
import VendorController from "../controllers/vendorController.js";

const router = express.Router();

//Public Routes
router.post("/", VendorController.create);
router.post("/login", VendorController.login);

export { router as VendorRouter };
