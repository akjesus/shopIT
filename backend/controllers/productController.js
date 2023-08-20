const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");

//CREATE PRODUCTS
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  return res.status(201).json({
    success: true,
    message: "Products created successfully",
    product,
  });
});

//GET ALL PRODUCTS
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  const productCount = await Product.countDocuments();
  const apifeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .paginate(process.env.RES_PER_PAGE);

  const products = await apifeatures.query;
  if (!products.length) {
    return next(new ErrorHandler("No Product found!", 404));
  }
  return res.status(200).json({
    success: true,
    productCount,
    message: `(${products.length}) Product(s) retrieved successfully`,
    products,
  });
});

//GET ONE PRODUCT
exports.getOneProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("No Product found!", 404));
  }
  return res.status(200).json({
    success: true,
    message: `(1) Product retrieved successfully`,
    product,
  });
});

//UPDATE PRODUCT
exports.updateOneProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("No Product found!", 404));
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
      useFindandModify: false,
    }
  );
  return res.status(200).json({
    success: true,
    message: `Product updated successfully`,
    product: updatedProduct,
  });
});

//DELETE PRODUCT
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("No Product with this ID found!", 404));
  }

  await Product.findByIdAndDelete(req.params.id);
  return res.status(200).json({
    success: true,
    message: `Product deleted successfully`,
  });
});
