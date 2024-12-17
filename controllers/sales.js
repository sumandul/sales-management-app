import BrandModel from "../models/Brand.js";
import CategoryModel from "../models/Category.js";
import ItemModel from "../models/item.js";
import SalesModel from "../models/sales.js";

class SalesController {
  static create = async ({ body, user }, res) => {
    const { products } = body;

    if (!products || products.length === 0) {
      return res.status(412).json({
        message: "At least one product is required in the sale.",
      });
    }
    const validProducts = [];
    for (let product of products) {
      const item = await ItemModel.findById(product.itemId);
      if (!item) {
        return res
          .status(400)
          .json({ message: `Item with ID ${product.itemId} not found` });
      }

      if (item.shopId.toString() !== user.shopId.toString()) {
        return res
          .status(400)
          .json({ message: `Item ${item.name} does not belong to your shop` });
      }
      if (product.type === "unit") {
        product.buyingPrice = item.unit.buyingPrice;
        product.sellingPrice = product.sellingPrice || item.unit.sellingPrice;
      } else if (product.type === "bulk") {
        product.buyingPrice = item.bulk.buyingPrice;
        product.sellingPrice = product.sellingPrice || item.bulk.sellingPrice;
      } else {
        return res.status(400).json({
          message: "Invalid product type, must be 'unit' or 'bulk'",
        });
      }

      validProducts.push(product);
    }

    const existSales = await SalesModel.find();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${
      new Date().getMonth() + 1
    }-${new Date().getDate()}-${existSales.length + 1}`;

    const doc = new SalesModel({
      shopId: user.shopId,
      invoiceNumber,
      products: validProducts,
    });

    const data = await doc.save();
    res.status(200).json(data);
  };

  static list = async ({ query, user }, res, next) => {
    const defaultConfig = {
      limit: 50,
      page: 1,
      sort: -1,
      sortBy: "createdAt",
      shopId: user.shopId,
    };

    try {
      const { page, limit, sort, sortBy, shopId } = {
        ...defaultConfig,
        ...query,
      };

      const mongoQuery = { shopId };

      const [sales, total] = await Promise.all([
        SalesModel.find(mongoQuery)
          .populate([{ path: "products.itemId", select: "name" }])
          .sort({ [sortBy]: sort })
          .skip((parseInt(page) - 1) * parseInt(limit))
          .limit(parseInt(limit)),
        SalesModel.countDocuments(mongoQuery),
      ]);

      return res.json({
        sales,
        total,
        limit: parseInt(limit),
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
      });
    } catch (error) {
      next({ message: error.message, statusCode: error.statusCode || 400 });
    }
  };
}

export default SalesController;
