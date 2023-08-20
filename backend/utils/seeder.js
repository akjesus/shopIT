const Product = require("../models/productModel");
const dotenv = require("dotenv");
const connectDB = require("../config/database");

const products = require("../data/product.json");

dotenv.config({
  path: "backend/config/config.env",
});

connectDB(process.env.DATABASE_LOCAL);

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    console.log("Products deleted successfully");

    await Product.insertMany(products);
    console.log("Products inserted successfully");
    process.exit();
  } catch (error) {
    console.log("Error in Seeding Products");
    console.log(error.message);
    process.exit();
  }
};

seedProducts();
