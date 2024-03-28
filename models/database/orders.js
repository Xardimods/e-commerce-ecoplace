import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  items: [
    {
      Product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tracking: String,
  methodPayment: {
    type: String,
    required: true,
    enum: [
      "CREDIT_CARD",
      "DEBIT_CARD",
      "PAYPAL",
      "BANK_TRANSFER",
      "CASH_ON_DELIVERY",
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

exports.Order = mongoose.model("Order", orderSchema);
