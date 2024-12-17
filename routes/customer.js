import express from "express";
import RoleHandler from "../middleware/AdminHandler.js";
import { Role } from "../enum/role.js";
import CustomerController from "../controllers/vendorController.js";
import AuthHandler from "../middleware/AuthHandler.js";
import OptionalAuthHandler from "../middleware/OptionalAuthHandler.js";
const router = express.Router();

// router.get(
//   "/",
//   AuthHandler,

//   CustomerController.getCustomer
// );
// router.get(
//   "/:id",
//   AuthHandler,

//   CustomerController.getOne
// );

// router.put("/:id", CustomerController.updateCustomer);

export { router as CustomerRouter };
