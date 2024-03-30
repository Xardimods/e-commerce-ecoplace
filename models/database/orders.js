import mongoose from 'mongoose';
import { Cart } from './carts.js';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
}, {
  timestamps: false,
  _id: false // Evita la creación de un _id para subdocumentos si no es necesario
});

const orderSchema = new mongoose.Schema({
  items: [orderItemSchema],
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["Pending", "Paid", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
  trackingNumber: {
    type: String,
    default: "",
  },
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
}, {
  timestamps: true // Aprovecha la creación automática de campos createdAt y updatedAt
});


const Order = mongoose.model("Order", orderSchema);

export class OrderModel {
  static async createOrderFromCart(userId, methodPayment) {
    try {
      const cart = await Cart.findOne({ User: userId })
        .populate({
          path: 'items.product',
          // Aqui poblamos 'product' directamente
        });

      if (!cart || cart.items.length === 0) {
        throw new Error('No items in cart.');
      }

      const orders = await Promise.all(cart.items.map(async (item) => {
        return await Order.create({
          items: [{
            product: item.product._id,
            quantity: item.quantity,
          }],
          customer: userId,
          methodPayment, // Utiliza el argumento methodPayment aquí
          // Asegúrate de incluir cualquier otro campo necesario según tu esquema de Order
        });
      }));

      cart.items = [];
      await cart.save();

      return orders; // Retorna las órdenes creadas
    } catch (error) {
      throw new Error('Error creating order from cart: ' + error.message);
    }
  }
}