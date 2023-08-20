const express = require("express");
const app = express();
const errorMiddleware = require("./middlewares/errorMiddleware");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());

//IMPORT ROUTERS
const productRouter = require("./routes/productRoutes");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");

//ASSIGNING ROUTES
app.use("/api/v1", productRouter);
app.use("/api/v1", authRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", adminRouter);

//MIDDLEWARES
app.use(errorMiddleware);

app.use("*", (req, res) => {
  return res.status(404).json({
    success: false,
    status: 404,
    message: "Route Not Found",
  });
});
module.exports = app;
