const express = require("express");
const authRouter = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  getNewPassword,
} = require("../controllers/authController");

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);
authRouter.post("/password/forgot", forgotPassword);
authRouter.get("/password/reset/:token", getNewPassword);
module.exports = authRouter;
