const mongoose = require("mongoose");
// const orderItemModel = require("../orderItem/orderItemModel");

const orderSchema = new mongoose.Schema({
  orderItem: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orderItem",
      required: true,
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shippingAdd1: {
    type: String,
    required: true,
  },
  shippingAddr2: String,
  city: String,
  zip: String,
  country: {
    type: String,
    reqired: true,
  },
  phone: Number,
  status: {
    type: String,
    default: "Pending",
  },
  totalPrice: Number,
  dateOrdered: {
    type: Date,
    default: Date.now,
  },
});

const orderModel = mongoose.model("order", orderSchema);
module.exports = orderModel;
