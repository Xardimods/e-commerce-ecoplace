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

export { Order }

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
          methodPayment, 
        });
      }));

      cart.items = [];
      await cart.save();

      return orders; // Retorna las órdenes creadas
    } catch (error) {
      throw new Error('Error creating order from cart: ' + error.message);
    }
  }

  static async getOrdersByUser(userId) {
    try {
      let orders = await Order.find({ customer: userId })
        .populate('items.product', 'name price')
        .populate('customer', 'name lastname street city country zip');
  
      // Calcular el total para cada orden
      orders = orders.map(order => {
        const orderObject = order.toObject(); // Convertir a objeto si es necesario
  
        // Calcular el total sumando el precio de cada producto multiplicado por su cantidad
        const total = order.items.reduce((acc, item) => {
          return acc + (item.product.price * item.quantity);
        }, 0);
  
        orderObject.total = total; // Añadir el total calculado al objeto de la orden
        return orderObject;
      });
  
      return orders;
      } catch (error) {
        throw new Error('Error fetching orders: ' + error.message);
      }
  }

  static async getOrderById(orderId) {
    try {
    const order = await Order.findById(orderId)
      .populate('items.product', 'name price')
      .populate('customer', 'name lastname street city country zip');

    // Verifica si la orden existe antes de intentar acceder a sus propiedades
    if (!order) {
      throw new Error('Order not found');
    }

    // Ahora que has verificado que order no es null, puedes proceder de forma segura
    const total = order.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const orderObject = order.toObject(); // Convertir el documento Mongoose a un objeto JavaScript simple si es necesario
    orderObject.total = total; // Añadir el total calculado al objeto de la orden

    return orderObject;
    } catch (error) {
      throw new Error('Error fetching order: ' + error.message);
    }
  }

  static async getAllOrders() {  // Solo funcionara con los Admins
    try {
      const orders = await Order.find()
      .populate('items.product', 'name price')
      .populate('customer', 'name lastname');
      return orders;
    } catch (error) {
      throw new Error('Error fetching all orders: ' + error.message);
    }
  }

  static async updateOrder(orderId, updateData) {
    try {
      const order = await Order.findByIdAndUpdate(orderId, updateData, { new: true });
      if (!order) {
        throw new Error('Order not found');
      }
      return order;
    } catch (error) {
      throw new Error('Error updating order: ' + error.message);
    }
  }
}