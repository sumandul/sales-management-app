import BrandModel from "../models/Brand.js";
import CategoryModel from "../models/Category.js";

class BrandController {
  //create service
  static create = async ({ body, user }, res, next) => {
    try {
      const { name, categoryId, active } = body;
      console.log(body);
      if (!name || !categoryId) {
        return res.status(400).json({
          message: "All field is required",
        });
      }
      const isBrandExist = await BrandModel.findOne({ name });
      const isCategoryExist = await CategoryModel.findOne({
        _id: categoryId,
        active: true,
      });

      if (isBrandExist) {
        return res.status(400).json({
          message: "Brand already exists",
        });
      }

      if (!isCategoryExist) {
        return res.status(400).json({
          message: "Category does not exist",
        });
      }

      const doc = new BrandModel({
        name,
        shopId: user.shopId,
        categoryId,
        active,
      });
      const data = await doc.save();
      // const notification = new NotificationModel({
      //   type: "Customer",
      //   message: `A new customer has registered: ${studentData.name}`,
      //   data: data,
      // });
      // await notification.save();
      // const message = {
      //   notification: {
      //     title: "New Student Registration",
      //     body: notification.message,
      //   },
      //   topic: "admin",
      // };

      // try {
      //   await firebaseAdmin.messaging().send(message);
      //   res.status(200).send("Form submitted and notification sent");
      // } catch (error) {
      //   res.status(500).send("Error sending notification");
      // }
      res.status(200).json(data);
    } catch (error) {
      next({ message: error.message, statusCode: error.statusCode || 400 });
    }
  };

  //getAllServicesType

  static list = async ({ query }, res, next) => {
    try {
      const defaultConfig = {
        limit: 50,
        sort: -1,
        sortBy: "createdAt",
        page: 1,
        name: "",
        active: "all",
      };
      const { page, sort, sortBy, limit, name, phone, email } = {
        ...defaultConfig,
        ...query,
      };
      const mongoQuery = {
        ...(name && { name: { $regex: name, $options: "i" } }),
      };

      const [brands, total] = await Promise.all([
        BrandModel.find(mongoQuery)
          .sort({ [sortBy]: sort })
          .skip(
            (parseInt(page) <= 0 ? 1 : parseInt(page) - 1) * parseInt(limit)
          )
          .limit(parseInt(limit)),
        BrandModel.countDocuments(mongoQuery),
      ]);

      return res.json({
        brands,
        limit: parseInt(limit),
        currentPage: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
      });
    } catch (error) {
      next({ message: error.message, statusCode: error.statusCode || 400 });
    }
  };

  static update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const brand = await BrandModel.findById(id);
      if (!brand) {
        throw Error("brand not exits");
      }
      const data = await BrandModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(data);
    } catch (error) {
      next({ message: error.message, statusCode: error.statusCode || 400 });
    }
  };
  updateStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const brand = await BrandModel.findById(id);
      if (!brand) {
        throw Error("brand not exits");
      }
      const data = await BrandModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(data);
    } catch (error) {
      next({ message: error.message, statusCode: error.statusCode || 400 });
    }
  };
}

export default BrandController;
