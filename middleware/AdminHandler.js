import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

const AuthHandler = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  try {
    if (!authorization) {
      throw Error("Unauthorized");
    }
    if (authorization && authorization.startsWith("Bearer")) {
      token = authorization.split(" ")[1];
      const jwtSecret = process.env.JWT_SECURE_KEY;
      const { userId, role } = jwt.verify(token, jwtSecret);
      const user = await UserModel.findOne({ _id: userId });
      req.user = user;
      req.role = role;
      next();
    }
  } catch (error) {
    res.status(401).json({
      statusCode: 401,
      message: "Unauthorized",
    });
  }
};

export default AuthHandler;
