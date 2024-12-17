import RoleHandler from "../middleware/AdminHandler.js";
import { Role } from "../enum/role.js";
import express from "express";
import AuthHandler from "../middleware/AuthHandler.js";
import ServiceTypeController from "../controllers/serviceTypeController.js";
const router = express.Router();

//Public Routes
// router.get('/', AuthHandler, ServiceTypeController.getProfile);
router.post(
  "/",
  AuthHandler,

  ServiceTypeController.createServiceType
);
router.get("/", ServiceTypeController.getServiceType);
router.get("/:id", ServiceTypeController.getOne);
router.delete(
  "/:id",
  AuthHandler,

  ServiceTypeController.deleteServiceType
);
router.put(
  "/:id",
  AuthHandler,

  ServiceTypeController.updateServiceType
);

router.patch(
  "/update-status/:id",
  AuthHandler,

  ServiceTypeController.updateStatus
);

export { router as ServiceTypeRoute };
