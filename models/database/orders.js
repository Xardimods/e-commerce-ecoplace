import mongoose from 'mongoose';
import { Cart } from './carts.js';

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

const Order = mongoose.model("Order", orderSchema);

export class OrderModel {
  static async createOrderFromCart(userId) {
    try {
      const cart = await Cart.findOne({ User: userId }).populate('items.product');
      if (!cart || cart.items.length === 0) {
        throw new Error('No items in cart');
      }

      const order = await Order.create({
        items: cart.items.map(item => ({
          Product: item.product._id,
          quantity: item.quantity
        })),
        customer: userId,
        // Asumiendo que el modelo de Product incluye referencia a su Seller
        seller: cart.items[0].product.seller
      });

      // Vaciar el carrito
      cart.items = [];
      await cart.save();

      return order;
    } catch (error) {
      throw new Error('Error creating order from cart: ' + error.message);
    }
  }
}