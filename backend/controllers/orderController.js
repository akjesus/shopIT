const Order = require("../models/orderModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");

exports.placeOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    paymentInfo,
    itemsAmount,
    taxAmount,
    shippingAmount,
    totalAmount,
  } = req.body;
  const order = await Order.create({
    orderItems,
    shippingInfo,
    paymentInfo,
    itemsAmount,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentDate: Date.now(),
    user: req.user._id,
  });
  if (!order) {
    return new ErrorHandler("No order placed", 400);
  }
  return res
    .status(200)
    .json({ success: true, message: "Order created successfully", order });
});
