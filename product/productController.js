// Required imports
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const productModel = require("./productModel");
const categoryModel = require("./../category/categoryModel");
const upload = require("../helper/imageUploader");

// getting all products by category
router.get(`/`, async (req, res) => {
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }
  // console.log(filter);
  const products = await productModel.find(filter).populate("category");

  if (!products) {
    res.status(500).json({ success: false });
  }
  res.status(500).json({ success: true, result: products });
});

// // adding a product
router.post(`/`, upload.single("image"), async (req, res, next) => {
  // console.log(req.file);
  if (!req.file) return res.status(400).send("No image selected!");
  if (req.fileError) {
    return next({
      msg: req.fileError,
      status: 400,
    });
  }
  if (req.file) {
    imageFile = req.file.filename;
  }

  const category = await categoryModel.findById(req.body.category);
  if (!category) {
    res.status(400).send("Invalid category");
    return;
  }

  const product = new productModel({
    name: req.body.name,
    desc: req.body.desc,
    richDesc: req.body.richDesc,
    image: imageFile,
    images: req.body.images,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    isFeatured: req.body.isFeatured,
    numReviews: req.body.numReviews,
    countInStock: req.body.countInStock,
  });
  product
    .save()
    .then((createdProduct) => {
      res.status(201).json({ success: true, result: createdProduct });
    })
    .catch((err) => res.status(500).json({ success: false, error: err }));
});

// updating a product by id
router.put("/:id", upload.single("image"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(500).send("Invalid product id");
  }

  const category = await categoryModel.findById(req.body.category);
  if (!category) {
    return res.status(400).send("Invalid category");
  }

  const product = await productModel.findById(req.params.id);
  if (!product) return res.status(400).send("Invalid product");

  const file = req.file;
  console.log(file);
  let imageFile;
  if (file) {
    imageFile = req.file.filename;
  } else {
    imageFile = product.image;
  }

  let updatedProduct = await productModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      desc: req.body.desc,
      richDesc: req.body.richDesc,
      image: imageFile,
      images: req.body.images,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      isFeatured: req.body.isFeatured,
      numReviews: req.body.numReviews,
      countInStock: req.body.countInStock,
    },
    {
      new: true,
    }
  );
  if (!updatedProduct) {
    res.status(400).json({
      success: false,
      message: `No product found with id : ${req.params.id}`,
    });
  }
  res.status(200).send(updatedProduct);
});

// router.get("/", async (req, res) => {
//   let product = await productModel
//     .save()
//     .then((result) => res.status(200).json({ success: true, result: product }))
//     .catch((err) => res.status(500).json({ success: false, error: err }));
// });

// delete a product by id
router.delete("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(500).send("Invalid product id");
    return;
  } else {
    productModel
      .findByIdAndDelete(req.params.id)
      .then((product) => {
        if (product)
          return res
            .status(200)
            .json({ success: true, message: "Prodct deleted successfully!" });
      })
      .catch((err) => res.status(500).json({ success: false, error: err }));
  }
});

// counting total products
router.get("/get/count", async (req, res) => {
  const productCount = await productModel.countDocuments();
  if (!productCount) res.status(500).json({ success: false });
  else res.send({ productCount: productCount });
});

// getting all featred products
router.get("/get/featured/:count", async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const productFeatured = await productModel
    .find({ isFeatured: true })
    .limit(+count);
  if (!productFeatured) res.status(500).json({ success: false });
  else res.send(productFeatured);
});

// getting a product by id
router.get("/:id", async (req, res) => {
  const product = await productModel.findById(req.params.id);
  if (!product) {
    res
      .status(500)
      .json({ success: false, message: "No product found with that ID!" });
    return;
  }
  res.status(200).send(product);
});

// updating a product for addind multiple images
router.put(
  "/image-gallery/:id",
  upload.array("images", 5),
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(500).send("Invalid product id");
    }

    const files = req.files;
    console.log(files);
    let imageFiles = [];
    if (files) {
      files.map((file) => {
        imageFiles.push(file.filename);
      });
    }
    // if (file) {
    //   imageFiles = req.files.filename;
    // } else {
    //   imageFiles = product.image;
    // }

    let product = await productModel.findByIdAndUpdate(
      req.params.id,
      {
        images: imageFiles,
      },
      {
        new: true,
      }
    );
    if (!product) {
      res.status(400).json({
        success: false,
        message: `No product found with id : ${req.params.id}`,
      });
    }
    res.status(200).send(product);
  }
);
module.exports = router;
