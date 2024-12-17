import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shop",
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^INV-\d{4}-\d{2}-\d{2}-\d+$/.test(v);
        },
        message: "Invalid invoice number format",
      },
    },
    products: {
      type: [
        {
          itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "item",
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            min: [1, "Quantity must be at least 1"],
          },
          buyingPrice: {
            type: Number,
            required: true,
            min: [0, "Buying price cannot be negative"],
          },
          sellingPrice: {
            type: Number,
            required: true,
            min: [0, "Selling price cannot be negative"],
          },
        },
      ],
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "At least one product must be included in the sale",
      },
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        ret.products.forEach((product) => {
          delete product._id;
        });
      },
    },
    timestamps: true,
  }
);

saleSchema.index({ invoiceNumber: 1 }, { unique: true });
saleSchema.index({ shopId: 1 });

saleSchema.pre("save", function (next) {
  this.totalAmount = 0;
  for (let product of this.products) {
    this.totalAmount += product.quantity * product.sellingPrice;
  }
  next();
});

const SalesModel = mongoose.model("sale", saleSchema);

export default SalesModel;
