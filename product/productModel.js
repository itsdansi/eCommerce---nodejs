const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    richDesc: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    images: [
      {
        types: String,
      },
    ],
    brand: {
      type: String,
      default: "",
    },
    price: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    countInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
    numReviews: {
      type: Number,
      default: "",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
// productSchema.virtual("id").get(function () {
//   return this._id.toHexString();
// });
// productSchema.set("toJSON", {
//   virtuals: true,
// });

const productModel = mongoose.model("product", productSchema);
module.exports = productModel;
