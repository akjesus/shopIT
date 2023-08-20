const express = require("express");
const orderRouter = express.Router();

const { placeOrder } = require("../controllers/orderController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

orderRouter.post("/orders/new", isAuthenticated, placeOrder);

module.exports = orderRouter;
