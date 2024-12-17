import ShopModel from "../models/Shop.js";
import BranchSchema from "../models/Branch.js";

class ShopController {
  static create = async ({ body, config: { emailSender } }, res, next) => {
    try {
      const {
        name,
        description,
        branchId,
        panNumber,
        panImage,
        registrationNumber,
        registrationImage,
      } = body;

      if (
        !name ||
        !description ||
        !branchId ||
        !panNumber ||
        !panImage ||
        !registrationNumber ||
        !registrationImage
      ) {
        return res.status(412).json({ message: "All fields are required" });
      }

      console.log(branchId);
      const isBranchAvailable = await BranchSchema.findOne({
        _id: branchId,
        active: true,
      });
      console.log(isBranchAvailable);
      if (!isBranchAvailable) {
        return res.status(404).json({ message: "Branch not available" });
      }

      const doc = new ShopModel({
        ...body,
        status: "Approved",
      });
      const data = await doc.save();
      res.status(200).json(data);
    } catch (error) {
      next({ message: error.message, statusCode: error.statusCode || 400 });
    }
  };

  static list = async ({ query }, res, next) => {
    const defaultConfig = {
      limit: 50,
      sort: -1,
      sortBy: "createdAt",
      page: 1,
      branch: "",
      name: "",
    };
    try {
      const { page, sort, sortBy, limit, branch, name } = {
        ...defaultConfig,
        ...query,
      };

      let mongoQuery = {
        // branch: { $regex: branch, $options: "i" },
        name: { $regex: name, $options: "i" },
      };

      const [shops, total] = await Promise.all([
        ShopModel.find(mongoQuery)
          .populate({
            path: "branchId",
            select: "name ",
          })
          .sort({ [sortBy]: sort })
          .skip(
            (parseInt(page) <= 0 ? 1 : parseInt(page) - 1) * parseInt(limit)
          )
          .limit(parseInt(limit)),
        ShopModel.countDocuments(mongoQuery),
      ]);

      return res.json({
        shops,
        limit: parseInt(limit),
        currentPage: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
      });
    } catch (error) {
      next({ message: error.message, statusCode: error.statusCode || 400 });
    }
  };
}

export default ShopController;
