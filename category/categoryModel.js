const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  color: String,
  icon: String,
  image: String,
});

const categoryModel = mongoose.model("category", categorySchema);
module.exports = categoryModel;
         