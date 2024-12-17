import express from "express";
import BrandController from "../controllers/brands.js";
import AuthHandler from "../middleware/AuthHandler.js";

const router = express.Router();

router.post("/", AuthHandler, BrandController.create);
router.get("/", AuthHandler, BrandController.list);

export { router as BrandRouter };
