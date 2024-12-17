import express from "express";
import AuthHandler from "../middleware/AuthHandler.js";
import ItemController from "../controllers/items.js";

const router = express.Router();

router.post("/", AuthHandler, ItemController.create);
router.get("/", AuthHandler, ItemController.list);
router.put("/:id", AuthHandler, ItemController.update);
router.put("/:id", AuthHandler, ItemController.show);

export { router as ItemRouter };
