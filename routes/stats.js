import express from "express";
import RoleHandler from "../middleware/AdminHandler.js";
import { Role } from "../enum/role.js";

import AuthHandler from "../middleware/AuthHandler.js";

import StatsController from "../controllers/stats.js";
const router = express.Router();

router.get("/sales", AuthHandler, StatsController.getSales);

export { router as StatsRouter };
