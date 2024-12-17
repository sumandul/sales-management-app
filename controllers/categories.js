import CategoryModel from "../models/Category.js";

class CategoryController {
  //create service
  static create = async ({ body, user }, res, next) => {
    try {
      const { name, active } = body;
      const isCategoryExist = await CategoryModel.findOne({ name });

      if (isCategoryExist) {
        return res.status(400).json({
          message: "Category already exists",
        });
      }

      const doc = new CategoryModel({
        name,
        shopId: user.shopId,
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

      const [categories, total] = await Promise.all([
        CategoryModel.find(mongoQuery)
          .sort({ [sortBy]: sort })
          .skip(
            (parseInt(page) <= 0 ? 1 : parseInt(page) - 1) * parseInt(limit)
          )
          .limit(parseInt(limit)),
        CategoryModel.countDocuments(mongoQuery),
      ]);

      return res.json({
        categories,
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
      const category = await CategoryModel.findById(id);
      if (!category) {
        throw Error("category not exits");
      }
      const data = await CategoryModel.findByIdAndUpdate(id, req.body, {
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
      const category = await CategoryModel.findById(id);
      if (!category) {
        throw Error("category not exits");
      }
      const data = await CategoryModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(data);
    } catch (error) {
      next({ message: error.message, statusCode: error.statusCode || 400 });
    }
  };
}

export default CategoryController;
