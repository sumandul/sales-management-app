import guard from "./middleware/guard.js";
import express from "express";
import cors from "cors";
import connectDatabase from "./config/database.js";
import { userRouter } from "./routes/userRoutes.js";
import ErrorHandler from "./middleware/ErrorHandler.js";
import ResponseHandler from "./middleware/Response.js";
import { AuthRoutes } from "./routes/auth.js";
import { ServiceTypeRoute } from "./routes/serviceTypeRoute.js";
import { CustomerRouter } from "./routes/customer.js";

import config from "./config.js";
import mongooseConnect from "./mongoose.js";
import { SaleRouter } from "./routes/sales.js";
import { NotificationRouter } from "./routes/notification.js";
import { StatsRouter } from "./routes/stats.js";
import { BranchRouter } from "./routes/branchs.js";
import { CategoryRouter } from "./routes/categories.js";
import { ShopRouter } from "./routes/shops.js";
import { VendorRouter } from "./routes/vendor.js";
import { BrandRouter } from "./routes/brands.js";
import { ItemRouter } from "./routes/items.js";

(async () => {
  try {
    const { token, port } = config;

    const app = express();

    //Cors policy
    app.use(cors());

    app.use((req, res, next) => {
      req.config = config;

      next();
    });

    app.use(guard(token));

    //Databae connection
    await connectDatabase();

    //JSON
    app.use(express.json());

    //Load Routes
    app.use("/api/v1/users", userRouter);
    app.use("/api/v1/auth", AuthRoutes);
    app.use("/api/v1/serviceTypes", ServiceTypeRoute);
    app.use("/api/v1/customers", CustomerRouter);
    // app.use("/api/v1/receipts", ReceiptRouter);
    app.use("/api/v1/notifications", NotificationRouter);
    app.use("/api/v1/stats", StatsRouter);
    app.use("/api/v1/branchs", BranchRouter);
    app.use("/api/v1/categories", CategoryRouter);
    app.use("/api/v1/shops", ShopRouter);
    app.use("/api/v1/vendors", VendorRouter);
    app.use("/api/v1/brands", BrandRouter);
    app.use("/api/v1/sales", SaleRouter);
    app.use("/api/v1/items", ItemRouter);

    //Error Middleware
    app.use(ErrorHandler);
    app.use(ResponseHandler);
    await mongooseConnect();
    app.listen(port, () => {
      console.log(`Starting server on port ${port}`);
    });
  } catch (error) {
    console.log(error);
    throw new Error("Server failed to start");
  }
})();
