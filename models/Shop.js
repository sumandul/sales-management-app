import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "branch",
      default: null,
    },
    panNumber: {
      type: String,
      required: true,
    },
    panImage: {
      type: String,
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
    },
    registrationImage: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    live: {
      type: Boolean,
      default: false,
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

shopSchema.index({ name: 1 });

const ShopModel = mongoose.model("shop", shopSchema);

export default ShopModel;
