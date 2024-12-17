import mongoose from "mongoose";

const itemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "brand",
      required: true,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shop",
      required: true,
    },
    bulk: {
      type: {
        buyingPrice: { type: Number, min: 0 },
        sellingPrice: { type: Number, min: 0 },
      },
    },
    unit: {
      type: {
        sellingPrice: { type: Number, min: 0 },
        buyingPrice: { type: Number, min: 0 },
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

itemSchema.index({ name: 1, shopId: 1 }, { unique: true });

const ItemModel = mongoose.model("item", itemSchema);

export default ItemModel;
