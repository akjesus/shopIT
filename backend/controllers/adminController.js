const User = require("../models/userModel");
const Order = require("../models/orderModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Product = require("../models/productModel");

//GET ALL USERS
exports.allUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  if (!users) {
    return next(new ErrorHandler("No user found", 404));
  }
  return res.status(200).json({
    success: true,
    message: `${users.length} Users found!`,
    data: users,
  });
});

//GET USER DETAILS
exports.userDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("No user found", 404));
  }
  return res.status(200).json({
    success: true,
    message: `user found!`,
    data: user,
  });
});

//UPDATE/CHANGE USER PROFILE
exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {
  const { name, email, role } = req.body;
  if (!name && !email && !role) {
    return next(new ErrorHandler("Please enter some data to update", 400));
  }
  const newData = {
    name,
    email,
    role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!user) {
    return next(new ErrorHandler("User not Found!", 404));
  }
  return res
    .status(200)
    .json({ success: true, message: "User data updated successfully", user });
});

//DELETE USER
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new ErrorHandler("No user found", 404));
  }
  return res.status(200).json({
    success: true,
    message: `User Deleted Successfully!`,
  });
});

//GET ALL ORDERS
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();
  if (!orders) {
    return new ErrorHandler("No order found", 404);
  }
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalAmount;
  });
  return res.status(200).json({
    success: true,
    message: `${orders.length} orders retrieved successfully`,
    ordersCount: orders.length,
    totalAmount,
    orders,
  });
});

//PROCESS ORDER / UPDATE STOCK
exports.processOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return new ErrorHandler("No order found", 404);
  }
  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }
  //   let totalAmount = 0;
  //   totalAmount += item.price * item.quantity;
  order.orderItems.forEach(async (item) => {
    await updateStock(item.product, item.quantity);
  });
  order.orderStatus = req.body.status;
  order.delveryDate = Date.now();
  order.save();
  return res.status(200).json({
    success: true,
    message: `Order processed successfully`,
    order,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock = product.stock - quantity;
  await product.save();
}
