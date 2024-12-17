import jwt from "jsonwebtoken";
import VendorModel from "../models/Vendor.js";

const AuthHandler = async (req, res, next) => {
  const { authorization } = req.headers;
  const { jwtSecretKey } = req.config;

  let token;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      statusCode: 401,
      message: "Unauthorized: No token provided",
    });
  }

  token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwtSecretKey);

    const vendor = await VendorModel.findById(decoded.vendorId);

    if (!vendor) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }

    req.user = vendor;

    next();
  } catch (error) {
    console.log(error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        statusCode: 401,
        message: "Unauthorized: Invalid token",
      });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        statusCode: 401,
        message: "Unauthorized: Token has expired",
      });
    } else {
      return res.status(500).json({
        statusCode: 500,
        message: "Server error, please try again later",
      });
    }
  }
};

export default AuthHandler;
