import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
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
categorySchema.index({ name: 1 }, { unique: true });

const CategoryModel = mongoose.model("category", categorySchema);

export default CategoryModel;
