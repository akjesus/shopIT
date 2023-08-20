const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

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
