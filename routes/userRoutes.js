import express from "express";
import UserController from "../controllers/userController.js";
import RoleHandler from "../middleware/AdminHandler.js";
import { Role } from "../enum/role.js";
import AuthHandler from "../middleware/AuthHandler.js";
const router = express.Router();

//Public Routes
// router.post(
//   "/",

//   UserController.userRegistrtion
// );
// router.get("/", AuthHandler, RoleHandler([Role.ADMIN]), UserController.getAll);
// router.get(
//   "/:id",
//   AuthHandler,
//   RoleHandler([Role.ADMIN]),
//   UserController.getOne
// );
// router.patch(
//   "/update-role/:id",
//   AuthHandler,
//   RoleHandler([Role.ADMIN]),
//   UserController.updateRole
// );
// router.patch(
//   "/update-password/:id",
//   AuthHandler,
//   RoleHandler([Role.ADMIN]),
//   UserController.updatePassword
// );
// router.put(
//   "/:id",
//   AuthHandler,
//   RoleHandler([Role.ADMIN]),
//   UserController.update
// );

//Private Routes

export { router as userRouter };

// ,RoleHandler([Role.USER])
