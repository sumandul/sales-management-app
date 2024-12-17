import express from "express";
import ShopController from "../controllers/shops.js";
const router = express.Router();

router.get("/", ShopController.list);
router.post("/", ShopController.create);
// router.put("/:id", ShopController.update);

export { router as ShopRouter };
