import express from "express";
import CategoryController from "../controllers/categories.js";
import AuthHandler from "../middleware/AuthHandler.js";

const router = express.Router();

router.post("/", AuthHandler, CategoryController.create);
router.get("/", AuthHandler, CategoryController.list);
router.put("/:id", AuthHandler, CategoryController.update);

export { router as CategoryRouter };
