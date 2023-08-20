const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");

exports.myProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorHandler("No User found, please Login!", 401));
  }
  return res.status(200).json({ success: true, message: "User found", user });
});

//UPDATE/CHANGE USER PASSWORD
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  if (!user) {
    return next(new ErrorHandler("No User found, please Login!", 401));
  }
  //CHECK IF CURRENT PASSWORD IS CORRECT OR NOT
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    return next(new ErrorHandler("Please fill all fields", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(
      new ErrorHandler("New Password and Confirm Password does not match!", 400)
    );
  }

  //   const correct = await user.correctPassword(oldPassword);
  const correct = await bcrypt.compare(oldPassword, user.password);
  if (!correct) {
    return next(new ErrorHandler("Old password is incorrect!", 400));
  }
  user.password = newPassword;
  await user.save();
  sendToken(user, 201, res);
});

//UPDATE USER PROFILE
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { name, email } = req.body;
  if (!name && !email) {
    return next(new ErrorHandler("Please enter some data to update", 400));
  }
  const newData = {
    name,
    email,
  };
  const user = await User.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  return res
    .status(200)
    .json({ success: true, message: "User data updated successfully", user });
});
