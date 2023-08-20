const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");

//REGISTER NEW USER
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (!userExists) {
    const newUser = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: "Avatars/canva-avatar1",
        url: "https://res.cloudinary.com/dylz588hc/image/upload/v1692218127/Avatars/canva-avatar1.jpg",
      },
    });
    sendToken(newUser, 201, res);
  }
  return next(new ErrorHandler("User exists already!", 409));
});

//LOGIN A USER
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new ErrorHandler("Please provide an email and a password", 422)
    );
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password!", 401));
  }
  //CHECK PASSWORD MATCHES OR NOT
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(new ErrorHandler("Invalid email or password!", 401));
  }
  sendToken(user, 200, res);
});

//LOGOUT A USER AND DELETE COOKIES
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  return res.status(200).json({
    success: true,
    message: "User Logged out successfully!",
  });
});

//FORGOT PASSWORD
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ErrorHandler("Please enter a valid email", 400));
  }
  //FIND USER
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User with this email not found!", 404));
  }
  //CREATE RESET TOKEN
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //SEND TOKEN TO USER'S EMAIL
  const url = `${req.protocol}://${req.get("host")}/api/v1/reset/${resetToken}`;
  const message = `Below is your password reset link, click it to reset your password. \n\n ${url} \n\n 
    If you did not request a password reset, then ignore this email`;
  const html = `<p> Below is your password reset link, click it to reset your password</p> <br>
  <div> <b><a href= '${url}' target='_blank'>Click here!</a></b>
  </div>
  <p> If you did not request a password reset, then ignore this email</p>`;
  try {
    await sendEmail({
      email,
      subject: "ShopIT Password Reset",
      message,
      html,
    });

    res.status(200).json({
      success: true,
      message: `Password Reset Email sent to [${email}] successfully!`,
      resetToken,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError(err.message, 500));
  }
});

//CREATE NEW PASSWORD
exports.getNewPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;
  console.log(password, confirmPassword);
  if (!password || !confirmPassword) {
    return next(new ErrorHandler("All fields are required", 400));
  }
  if (password !== confirmPassword) {
    return next(new ErrorHandler(`Both passwords should be same.`, 400));
  }
  const resetToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: resetToken,
    passwordResetExpires: { $gte: Date.now() },
  });
  if (!user) {
    return next(new ErrorHandler("Invalid or expired Token", 400));
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler(`Both passwords should be same.`, 400));
  }
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  sendToken(user, 200, res);
});
