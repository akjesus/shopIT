const express = require("express");
const productRouter = express.Router();
const {
  getProducts,
  getOneProduct,
  addProductReview,
  getProductReviews,
} = require("../controllers/productController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

productRouter.get("/products", getProducts);
productRouter.get("/products/:id", getOneProduct);
productRouter.patch("/review", isAuthenticated, addProductReview);
productRouter.get("/reviews", getProductReviews);

module.exports = productRouter;
