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

//CREATE PRODUCT REVIEW
exports.addProductReview = catchAsyncErrors(async (req, res, next) => {
  const { comment, rating, productId } = req.body;
  if (!comment || !rating) {
    return next(new ErrorHandler("Please provide a valid review", 400));
  }
  const review = {
    name: req.user.name,
    user: req.user._id,
    comment,
    rating: Number(rating),
  };

  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews += 1;
  }
  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;
  await product.save({ validateBeforeSave: false });
  return res
    .status(201)
    .json({ success: true, message: "Review added succeessfully", review });
});

//GET PRODUCT REVIEWS
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("No such product exists", 404));
  }
  return res.status(200).json({
    success: true,
    message: `${product.reviews.length} review(s) retrieved`,
    reviews: product.reviews,
  });
});

//DELETE PRODUCT REVIEWS
exports.deletProductReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("No such product exists", 404));
  }
  const available = product.reviews.find(
    (r) => r._id.toString() === req.query.id.toString()
  );
  if (!available) {
    return next(new ErrorHandler("No such review exists", 404));
  }
  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== req.query.id.toString()
  );
  const ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    reviews.length;
  const numOfReviews = reviews.length;
  await Product.findByIdAndUpdate(
    req.query.productId,
    { reviews, ratings, numOfReviews },
    { new: true, runValidators: true, useFindandModify: false }
  );
  return res.status(200).json({
    success: true,
    message: ` review(s) deleted`,
    reviews,
  });
});
