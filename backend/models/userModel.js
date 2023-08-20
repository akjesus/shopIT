const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const catchAsync = require("../middlewares/catchAsyncErrors");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please fill the Name field"],
    },
    email: {
      type: String,
      required: [true, "Please fill the email field"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "🙈 Please provide a valid email"],
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    role: {
      type: String,
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must not be less than 6 characters"],
      select: false,
    },

    passwordUpdatedAt: {
      type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // //run this if password was not modified
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.correctPassword = catchAsync(async function (
  candidatePassword
) {
  console.log(candidatePassword, this.password);
  return await bcrypt.compare(candidatePassword, this.password);
});
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

userSchema.methods.createPasswordResetToken = function () {
  //CREATE TOKEN
  const resetToken = crypto.randomBytes(32).toString("hex");

  //HASH THE TOKEN
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //TOKEN EXPIRES TIME = 10 MINUTES
  this.passwordResetExpires = Date.now() + 600000;
  return resetToken;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
