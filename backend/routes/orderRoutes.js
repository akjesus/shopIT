const express = require("express");
const orderRouter = express.Router();

const {
  placeOrder,
  getOrders,
  getSingleOrder,
} = require("../controllers/orderController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

orderRouter.get("/orders", isAuthenticated, getOrders);
orderRouter.get("/orders/:id", isAuthenticated, getSingleOrder);
orderRouter.post("/orders/new", isAuthenticated, placeOrder);

module.exports = orderRouter;
