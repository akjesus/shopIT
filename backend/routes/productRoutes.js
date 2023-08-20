const express = require("express");
const productRouter = express.Router();
const {
  getProducts,
  getOneProduct,
} = require("../controllers/productController");

productRouter.get("/products", getProducts);
productRouter.get("/products/:id", getOneProduct);

module.exports = productRouter;
