import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import VendorModel from "../models/Vendor.js";
import ShopModel from "../models/Shop.js";

class VendorController {
  static create = async ({ body }, res, next) => {
    try {
      const { name, phone, email, password, shopId } = body;

      if (!name || !email || !password || !phone || !shopId) {
        return res.status(412).json({ message: "Some field is missing" });
      }

      const vendor = await VendorModel.findOne({ email: email });
      const shop = await ShopModel.findOne({ _id: shopId });

      if (!shop) {
        return res.status(400).json({ message: "Shop does not exist" });
      }

      if (vendor) {
        return res.status(400).json({ message: "Vendor already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const vendorData = new VendorModel({
        ...body,
        password: hashPassword,
      });

      const data = await vendorData.save();
      res.status(201).json(data);
    } catch (error) {
      next({ message: error.message, statusCode: error.statusCode || 400 });
    }
  };

  // Login and issue both access and refresh tokens
  static login = async (
    {
      body,
      config: {
        jwtSecretKey,
        refreshSecretKey,
        jwtExpiresIn,
        refreshTokenExpiresIn,
      },
    },
    res,
    next
  ) => {
    try {
      const { email, password } = body;

      if (!email || !password) {
        return res.status(412).json({ message: "All fields are required" });
      }

      const vendor = await VendorModel.findOne({ email })
        .select("+password")
        .exec();

      if (!vendor) {
        return res.status(400).json({ message: "Vendor does not exist" });
      }

      // Check if the provided password matches the stored password
      const isPasswordMatch = await bcrypt.compare(password, vendor.password);
      if (!isPasswordMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }

      // Generate the access token (JWT)
      const payload = {
        vendorId: vendor._id,
        shopId: vendor.shopId,
      };
      const accessToken = jwt.sign(payload, jwtSecretKey, {
        expiresIn: jwtExpiresIn,
      });

      // Generate the refresh token
      const refreshToken = jwt.sign(payload, refreshSecretKey, {
        expiresIn: refreshTokenExpiresIn,
      });

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use HTTPS in production
        maxAge: parseInt(refreshTokenExpiresIn) * 1000, // Convert to milliseconds
      });

      res.status(200).json({ accessToken });
    } catch (error) {
      next({ message: error.message, statusCode: error.statusCode || 400 });
    }
  };

  static refreshToken = async (
    {
      body,
      cookies,
      config: {
        jwtSecretKey,
        refreshSecretKey,
        jwtExpiresIn,
        refreshTokenExpiresIn,
      },
    },
    res,
    next
  ) => {
    try {
      const refreshToken = cookies.refresh_token || body.refreshToken;

      if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is missing" });
      }

      jwt.verify(refreshToken, refreshSecretKey, async (err, decoded) => {
        if (err) {
          return res
            .status(401)
            .json({ message: "Invalid or expired refresh token" });
        }

        const payload = { vendorId: decoded.vendorId, role: "vendor" };
        const newAccessToken = jwt.sign(payload, jwtSecretKey, {
          expiresIn: jwtExpiresIn,
        });

        res.status(200).json({ accessToken: newAccessToken });
      });
    } catch (error) {
      next({ message: error.message, statusCode: error.statusCode || 400 });
    }
  };

  static logout = async (req, res, next) => {
    try {
      res.clearCookie("refresh_token");
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      next({ message: error.message, statusCode: error.statusCode || 400 });
    }
  };
}

export default VendorController;
