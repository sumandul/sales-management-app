import express from "express";
import SalesController from "../controllers/sales.js";
import AuthHandler from "../middleware/AuthHandler.js";
const router = express.Router();

router.get("/", AuthHandler, SalesController.list);
router.post("/", AuthHandler, SalesController.create);
// router.put("/:id", ShopController.update);

export { router as SaleRouter };
