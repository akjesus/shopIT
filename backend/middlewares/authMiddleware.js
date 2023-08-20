const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const jwt = require("jsonwebtoken");

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("UnAuthenticated User, Please login!", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) {
    return next(new ErrorHandler("Invalid token, Please login again!", 401));
  }
  req.user = await User.findById(decoded.id);
  if (!req.user) {
    return next(new ErrorHandler("Invalid User, Please login again!", 401));
  }
  next();
});

exports.authorisedRoles =
  (...roles) =>
  (req, res, next) => {
    //roles is an array of ['admin', 'lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not authorised to perform this action`,
          403
        )
      );
    }
    next();
  };
