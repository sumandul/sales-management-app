import validateEmail from "../common/email_validation.js";
import { Role } from "../enum/role.js";
import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserController {
  static userRegistrtion = async ({ body, config: { branch } }, res, next) => {
    try {
      const { name, email, password } = body;

      if (!name || !email || !password) {
        return res.staus(412).json({ message: "All field is required" });
      }

      //Check if user alredy exits
      const user = await UserModel.findOne({ email: email });

      if (user) {
        throw Error("Admin/User already exits");
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const doc = new UserModel({ ...body, password: hashPassword });
      const data = await doc.save();
      res.status(201).json(data);
    } catch (error) {
      next({ message: error.message, statusCode: error.statusCode || 400 });
    }
  };

  //userLogin
  static userLogin = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email && !password) {
        throw Error("All field is required");
      }
      const getUsers = await UserModel.find();

      const user = await UserModel.findOne({ email: email })
        .select("+password")
        .exec();

      if (!user) {
        throw Error("User is not exits");
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        throw Error("Please enter a correct password");
      }

      //JWt token
      const secretKey = process.env.JWT_SECURE_KEY;
      const payload = { userId: user._id, role: user.role };

      const token = jwt.sign(payload, secretKey, { expiresIn: "5d" });
      res.status(200).json({
        token,
      });
    } catch (error) {
      next({ message: error.message, statusCode: error.statusCode || 400 });
    }
  };

  static getAll = async ({ query, user }, res, next) => {
    try {
      const defaultConfig = {
        limit: 50,
        sort: -1,
        sortBy: "createdAt",
        page: 1,
        name: "",
        email: "",
        active: "all",
      };
      const { page, sort, sortBy, limit, name, email } = {
        ...defaultConfig,
        ...query,
      };
      const mongoQuery = {
        // branch: user.branch,
        ...(name && { name: { $regex: name, $options: "i" } }),
        ...(email && { email: { $regex: email, $options: "i" } }),
        // name: { $regex: name, $options: "i" },
        // phone: { $regex: phone, $options: "i" },
      };

      const [users, total] = await Promise.all([
        UserModel.find(mongoQuery)
          .sort({ [sortBy]: sort })
          .skip(
            (parseInt(page) <= 0 ? 1 : parseInt(page) - 1) * parseInt(limit)
          )
          .limit(parseInt(limit)),
        UserModel.countDocuments(mongoQuery),
      ]);

      return res.json({
        users,
        limit: parseInt(limit),
        currentPage: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
      });
    } catch (error) {
      next({ message: error.message, statusCode: error.statusCode || 400 });
    }
  };

  static updateRole = async ({ body, params }, res, next) => {
    try {
      const { id } = params;
      const user = await UserModel.findById(id);

      if (!user) {
        throw Error("User data not exits");
      }
      const { role } = body;

      const updated = await UserModel.findOneAndUpdate(
        { _id: id },
        { role },
        { new: true }
      );

      return res.json(updated);
    } catch (error) {
      next({ message: error.message, statusCode: error.statusCode || 400 });
    }
  };
  static getOne = async ({ params }, res, next) => {
    try {
      const { id } = params;
      const user = await UserModel.findById(id);

      if (!user) {
        throw Error("User data not exits");
      }
      return res.json(user);
    } catch (error) {
      next({ message: error.message, statusCode: error.statusCode || 400 });
    }
  };

  static updatePassword = async ({ body, params }, res, next) => {
    try {
      const { id } = params;
      const user = await UserModel.findById(id).select("+password").exec();

      if (!user) {
        throw Error("User data not exits");
      }
      const { password } = body;

      if (password.trim().length < 6) {
        throw Error("Password must be at least 6 characters");
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const updated = await UserModel.findOneAndUpdate(
        { _id: id },
        { password: hashPassword },
        { new: true }
      );

      return res.json(updated);
    } catch (error) {
      next({ message: error.message, statusCode: error.statusCode || 400 });
    }
  };

  static update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await UserModel.findById(id);
      if (!user) {
        throw Error("user not exits");
      }
      const data = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(data);
    } catch (error) {
      next({ message: error.message, statusCode: error.statusCode || 400 });
    }
  };
}

export default UserController;
