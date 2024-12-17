import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      select: false,
    },
  },

  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.password;
      },
    },
    timestamps: true,
  }
);

//Model
const UserModel = mongoose.model("user", userSchema);

export default UserModel;
