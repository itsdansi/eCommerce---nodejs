const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("./userModel");

// getting all users
router.get(`/`, async (req, res) => {
  const user = await userModel.find().select("-__v ");

  if (!user) {
    res.status(500).json({ success: false });
  }
  res.status(500).json({ success: true, result: user });
});

// adding a user
router.post(`/`, async (req, res) => {
  const user = new userModel({
    name: req.body.name,
    email: req.body.email,
    passwordHas: bcrypt.hashSync(req.body.password, 10),
    street: req.body.street,
    apartment: req.body.apartment,
    city: req.body.city,
    zip: req.body.zip,
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
  });
  user
    .save()
    .then((userCreated) => {
      res.status(201).json({ success: true, result: userCreated });
    })
    .catch((err) => res.status(500).json({ success: false, error: err }));
});

//  deleting a user
router.delete("/:id", (req, res) => {
  userModel
    .findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .json({ message: "User is deleted successfully" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
    })
    .catch((err) => {
      return res.status(404).json({ success: false, error: err });
    });
});

// getting a user by id
router.get("/:id", async (req, res) => {
  const user = await userModel.findById(req.params.id);
  if (!user) {
    res.status(500).json({ success: false, message: "No user found !" });
    return;
  }
  res.status(200).send(user);
});

// counting total users
router.get("/get/count", async (req, res) => {
  const userCount = await userModel.countDocuments();
  if (!userCount) res.status(500).json({ success: false });
  else res.send({ userCount: userCount });
});

// user login
router.post("/login", async (req, res) => {
  const user = await userModel.findOne({ email: req.body.email });
  const secret = process.env.SECRET;
  if (!user) {
    res.status(500).json({ success: false, message: "No user found !" });
    return;
  }
  if (
    user &&
    bcrypt.compareSync(req.body.password.toString(), user.passwordHas)
  ) {
    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      secret,
      {
        expiresIn: "1d",
      }
    );
    res.status(200).send({ user: user.email, token: token });
    return;
  }
  //   res.status(200).send(user);
  res.status(500).send("invalid credentials");
});

module.exports = router;
