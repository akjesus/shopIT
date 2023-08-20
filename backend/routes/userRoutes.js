const express = require("express");
const userRouter = express.Router();
const {
  myProfile,
  updatePassword,
  updateProfile,
} = require("../controllers/userController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

userRouter.get("/me", isAuthenticated, myProfile);
userRouter.patch("/me/update-profile", isAuthenticated, updateProfile);
userRouter.patch("/me/update-password", isAuthenticated, updatePassword);

module.exports = userRouter;
