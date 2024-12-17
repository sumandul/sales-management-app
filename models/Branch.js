import mongoose from "mongoose";

const branchSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
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
branchSchema.index({ name: 1 }, { unique: true });

const BranchModel = mongoose.model("branch", branchSchema);

export default BranchModel;
