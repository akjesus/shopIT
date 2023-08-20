const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter Product name!"],
      trim: true,
      maxLength: [100, "Product name cannot exceed 100 characters"],
    },
    price: {
      type: Number,
      default: 0.0,
      maxLength: [5, "price cannot exceed 5 characters"],
      min: [0, "Rating must not be less than 1"],
    },
    description: {
      type: String,
      required: [true, "A Product must have a description"],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: String,
      required: [true, "Please select a Category"],
      enum: {
        values: [
          "Electronics",
          "Clothes",
          "Books",
          "Food",
          "Fruits",
          "Shoes",
          "Beauty",
          "Sports",
          "Headphones",
          "Accessories",
          "Cameras",
          "Laptops",
        ],
        message: "Please select a valid Category for this product",
      },
    },
    seller: {
      type: String,
      required: [true, "Please enter a product seller"],
    },
    stock: {
      type: Number,
      required: [true, "Please enter product stock"],
      maxLength: [5, "Product stock cannot exceed 9999"],
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
