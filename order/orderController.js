// Required imports
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const orderModel = require("./orderModel");
const orderItemModel = require("./../orderItem/orderItemModel");

// getting all order
router.get(`/`, async (req, res) => {
  const orderList = await orderModel.find().populate("user", "name");
  // .populate("product");

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.status(500).json({ result: orderList });
});

// adding a order
router.post(`/`, async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItem.map(async (orderItem) => {
      let newOrderItem = new orderItemModel({
        product: orderItem.product,
        quantity: orderItem.quantity,
      });

      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );

  const orderItesIdsResolved = await orderItemsIds;
  //   console.log(orderItemsIds);

  const totalPrice = await Promise.all(
    orderItesIdsResolved.map(async (orderItemIds) => {
      const orderItem = await orderItemModel
        .findById(orderItemIds)
        .populate("product", "price");
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );

  // console.log(totalPrice);
  const finalPrice = totalPrice.reduce((a, b) => a + b, 0);

  const order = new orderModel({
    orderItem: orderItesIdsResolved,
    user: req.body.user,
    shippingAdd1: req.body.shippingAdd1,
    shippingAdd2: req.body.shippingAdd2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: finalPrice,
  });
  order
    .save()
    .then((createdorder) => {
      res.status(201).json({ success: true, result: createdorder });
    })
    .catch((err) => res.status(500).json({ success: false, error: err }));
});

// updating a order by id
router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(500).send("Invalid order id");
    return;
  }
  let order = await orderModel.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );
  if (!order) {
    res.status(400).json({
      success: false,
      message: `No order found with id : ${req.params.id}`,
    });
  }
  res.status(200).send(order);
});

// delete a order by id
router.delete("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(500).send("Invalid order id");
    return;
  } else {
    orderModel
      .findByIdAndRemove(req.params.id)
      .then(async (order) => {
        if (order) {
          await order.orderItem.map(async (orderItems) => {
            await orderItemModel.findByIdAndRemove(orderItems);
          });
          return res
            .status(200)
            .json({ success: true, message: "Order deleted successfully!" });
        } else {
          return res
            .status(404)
            .json({ success: false, message: "Order not found!" });
        }
      })
      .catch((err) => res.status(500).json({ success: false, error: err }));
  }
});

// getting a order by id
router.get("/:id", async (req, res) => {
  const order = await orderModel
    .findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "orderItem",
      populate: { path: "product", populate: "category" },
    });
  if (!order) {
    res.status(500).json({ success: false, message: "No order found!" });
    return;
  }
  res.status(200).send(order);
});

// counting total orders
router.get("/get/count", async (req, res) => {
  const orderCount = await orderModel.countDocuments();
  if (!orderCount) res.status(500).json({ success: false });
  else res.send({ orderCount: orderCount });
});

// getting all order by a specific user
router.get(`/get/user/:uid`, async (req, res) => {
  const orderList = await orderModel
    .find({ user: req.params.uid })
    .populate({
      path: "orderItem",
      populate: { path: "product", populate: "category" },
    })
    .sort({ dateOrdered: -1 });
  // .populate("product");

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.status(500).json({ result: orderList });
});

// getting total sales for statistics purpose
router.get("/get/totalSales", async (req, res) => {
  const totalSales = orderModel.aggregate([
    {
      $group: { _id: null, totalSales: { $sum: "$finalPrice" } },
    },
  ]);
  if (!totalSales) {
    res
      .status(500)
      .json({ success: false, message: "Total sales can not be generated!" });
  }
  res.status(200).send({ totalSales: totalSales });
});

module.exports = router;
