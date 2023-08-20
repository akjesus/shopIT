const Order = require("../models/orderModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");

//PLACE NEW ORDER
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

//GET ORDERS FOR CURRENTLY LOGGED IN USER
exports.getOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });
  if (!orders) {
    return next(new ErrorHandler("You have not placed an order yet", 404));
  }

  return res.status(200).json({
    success: true,
    message: `(${orders.length}) order(s) found for [${req.user.name}] `,
    orders,
  });
});

//GET ORDER DETAILS
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new ErrorHandler("No order found for this ID", 404));
  }

  return res.status(200).json({
    success: true,
    message: `Order found for [${req.user.name}] `,
    order,
  });
});
