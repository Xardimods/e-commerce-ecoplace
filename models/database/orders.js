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

orderSchema.virtual("id").get(function () {
  // esto para quitarle la parte _id  el guion bajo para mas comodidad
  return this._id.toHexString();
});

orderSchema.set("toJSON", {
  virtuals: true,
});

exports.Order = mongoose.model("Order", orderSchema);
