// imports
const express = require("express");
const app = express();
require("dotenv/config");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const productRouter = require("./product/productController");
const categoryRouter = require("./category/categoryController");
const userRouter = require("./user/userController");
const orderRouter = require("./order/orderController");
const authJwt = require("./helper/jwt");
const errorHandler = require("./helper/errorHandeler");

const api = process.env.API_URL;

// middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(authJwt());
app.use(errorHandler);

// app.use(cors());
// app.option("*", cors());

// schema defining

// routes
app.get("/", (req, res) => {
  res.send("Hello API developers");
});

app.use(`${api}/product`, productRouter);
app.use(`${api}/category`, categoryRouter);
app.use(`${api}/user`, userRouter);
app.use(`${api}/order`, orderRouter);

// database connection
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "eshop-database",
  })
  .then(() => {
    console.log("Database connected!");
  })
  .catch((err) => {
    console.log("Error connectiong to the database. ", err);
  });

// server connection
app.listen(3000, () => {
  console.log("Server is listening to port : 3000");
});
