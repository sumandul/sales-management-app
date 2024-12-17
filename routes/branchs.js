import express from "express";
import BranchController from "../controllers/branchs.js";
const router = express.Router();

router.get("/", BranchController.list);
router.post("/", BranchController.create);
router.put("/:id", BranchController.update);

export { router as BranchRouter };
