import express from "express";

import { Role } from "../enum/role.js";

import AuthHandler from "../middleware/AuthHandler.js";

import NotificationController from "../controllers/notificationController.js";
const router = express.Router();

router.post("/notify", AuthHandler, NotificationController.createNotification);

export { router as NotificationRouter };
