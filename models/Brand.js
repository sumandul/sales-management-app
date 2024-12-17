import mongoose from "mongoose";

const brandSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shop",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);
brandSchema.index({ name: 1 }, { unique: true });

const BrandModel = mongoose.model("brand", brandSchema);

export default BrandModel;
