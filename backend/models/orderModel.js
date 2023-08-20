const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      address: { type: String, required: true },
      phoneNo: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true },
        image: { type: String },
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    paymentInfo: {
      stripeId: { type: String },
      status: { type: String },
    },
    paymentDate: { type: Date },
    itemsAmount: { type: Number, required: true, default: 0.0 },
    taxAmount: { type: Number, required: true, default: 0.0 },
    shippingAmount: { type: Number, required: true, default: 0.0 },
    totalAmount: { type: Number, required: true, default: 0.0 },
    orderStatus: { type: String, required: true, default: "processing" },
    delveryDate: { type: Date, required: true, default: Date.now },
  },

  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
