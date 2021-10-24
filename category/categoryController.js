const express = require("express");
const router = express.Router();
const categoryModel = require("./categoryModel");

router.get("/", async (req, res) => {
  const categoryList = await categoryModel.find();
  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.send(categoryList);
});

router.post("/", async (req, res) => {
  let category = new categoryModel({
    name: req.body.name,
    color: req.body.color,
    icon: req.body.icon,
    image: req.body.image,
  });
  category = await category.save();
  if (!category) res.status(500).send("Category can not be created!");
  res.send(category);
});

router.put("/:id ", async (req, res) => {
  let category = await categoryModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      color: req.body.color,
      icon: req.body.icon,
      image: req.body.image,
    },
    {
      new: true,
    }
  );
  if (!category) {
    res.status(404).json({ success: false, message: "Category not found" });
  }
  res.status(200).json({ success: true, result: category });
});

router.delete("/:id", async (req, res) => {
  categoryModel
    .findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        return res.status(200).json({
          success: true,
          message: "Category deleted successfully!",
        });
      } else
        return res
          .status(404)
          .json({ success: false, message: "No category found with that ID!" });
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

router.get("/get/count", async (req, res) => {
  const categoryCount = await categoryModel.countDocuments();
  if (!categoryCount) res.status(500).json({ success: false });
  else res.send({ categoryCount: categoryCount });
});

router.get("/:id", async (req, res) => {
  const category = await categoryModel.findById(req.params.id);
  if (!category) {
    res
      .status(500)
      .json({ success: false, message: "No category found with that ID!" });
    return;
  }
  res.status(200).send(category);
});

module.exports = router;
