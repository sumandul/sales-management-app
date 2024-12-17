import ItemModel from "../models/item.js";

class ItemController {
  // Create a new item
  static create = async ({ body, user }, res, next) => {
    try {
      const { name, categoryId, brandId, bulk, unit, active } = body;

      if (!name || !categoryId || !brandId) {
        return res.status(412).json({
          message: "Name, categoryId, brandId, and shopId are required",
        });
      }

      const isNameTaken = await ItemModel.findOne({
        name,
        shopId: user.shopId,
      });
      if (isNameTaken) {
        return res
          .status(409)
          .json({ message: "Item name already exists in this shop" });
      }

      const doc = new ItemModel({
        name,
        categoryId,
        brandId,
        shopId: user.shopId,
        bulk,
        unit,
        active: active !== undefined ? active : true,
      });

      const data = await doc.save();
      res.status(200).json(data);
    } catch (error) {
      next({ message: error.message, statusCode: error.statusCode || 400 });
    }
  };

  // List all items with pagination
  static list = async ({ query }, res, next) => {
    const defaultConfig = {
      limit: 50,
      sort: -1,
      sortBy: "createdAt",
      page: 1,
      shopId: "",
      name: "",
    };

    try {
      const { page, sort, sortBy, limit, shopId, name } = {
        ...defaultConfig,
        ...query,
      };

      let mongoQuery = {
        ...(shopId && { shopId }),
        name: { $regex: name, $options: "i" },
      };

      const [items, total] = await Promise.all([
        ItemModel.find(mongoQuery)
          .populate([
            { path: "categoryId", select: "name" },
            { path: "brandId", select: "name" },
            { path: "shopId", select: "name" },
          ])
          .sort({ [sortBy]: sort })
          .skip(
            (parseInt(page) <= 0 ? 1 : parseInt(page) - 1) * parseInt(limit)
          )
          .limit(parseInt(limit)),
        ItemModel.countDocuments(mongoQuery),
      ]);

      return res.json({
        items,
        limit: parseInt(limit),
        currentPage: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
      });
    } catch (error) {
      next({ message: error.message, statusCode: error.statusCode || 400 });
    }
  };

  // Get a single item by ID
  static show = async ({ params: { id } }, res, next) => {
    try {
      const item = await ItemModel.findById(id).populate([
        { path: "categoryId", select: "name" },
        { path: "brandId", select: "name" },
        { path: "shopId", select: "name" },
      ]);

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.status(200).json(item);
    } catch (error) {
      next({ message: error.message, statusCode: error.statusCode || 400 });
    }
  };

  // Update an existing item
  static update = async ({ params: { id }, body }, res, next) => {
    try {
      const { name, categoryId, brandId, bulk, unit, active } = body;

      if (!name || !categoryId || !brandId) {
        return res.status(412).json({
          message: "Name, categoryId, and brandId are required",
        });
      }

      const item = await ItemModel.findByIdAndUpdate(
        id,
        {
          name,
          categoryId,
          brandId,
          bulk,
          unit,
          active,
        },
        { new: true } // Return the updated document
      ).populate([
        { path: "categoryId", select: "name" },
        { path: "brandId", select: "name" },
        { path: "shopId", select: "name" },
      ]);

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.status(200).json(item);
    } catch (error) {
      next({ message: error.message, statusCode: error.statusCode || 400 });
    }
  };
}

export default ItemController;
