const express = require("express");
const productRouter = express.Router();
const {
  getProducts,
  getOneProduct,
  addProductReview,
} = require("../controllers/productController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

productRouter.get("/products", getProducts);
productRouter.get("/products/:id", getOneProduct);
productRouter.post("/review", isAuthenticated, addProductReview);

module.exports = productRouter;
