import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shop",
      required: true,
    },
    profile: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
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
vendorSchema.index({ phone: 1 }, { unique: true });
vendorSchema.index({ email: 1 });

const VendorModel = mongoose.model("vendor", vendorSchema);

export default VendorModel;
