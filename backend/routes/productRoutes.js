const express = require("express");
const productRouter = express.Router();
const {
  getProducts,
  getOneProduct,
  addProductReview,
  getProductReviews,
  deletProductReview,
} = require("../controllers/productController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

productRouter.get("/products", getProducts);
productRouter.get("/products/:id", getOneProduct);
productRouter.patch("/review", isAuthenticated, addProductReview);
productRouter.delete("/review", isAuthenticated, deletProductReview);
productRouter.get("/reviews", getProductReviews);

module.exports = productRouter;
