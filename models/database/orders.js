import mongoose from 'mongoose';
import { Cart } from './carts.js';
import stripe from '../config/stripConfig.js'

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

const paymentDetailsSchema = new mongoose.Schema({
  methodPayment: {
    type: String,
    required: true,
    enum: ["CREDIT_CARD", "DEBIT_CARD"],
  },
  cardLastFourDigits: String, // Guardar solo los últimos cuatro dígitos
  cardExpirationDate: String,
  cardHolderName: String,
}, {
  _id: false
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
    enum: ["Pending", "Paid", "Shipped", "Cancelled"],
    default: null,
  },
  trackingNumber: {
    type: String,
    default: "",
  },
  paymentDetails: paymentDetailsSchema,
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
  static async createOrderFromCart(userId, paymentMethodId) {
    try {
      const cart = await Cart.findOne({ User: userId }).populate('items.product');// Aqui poblamos 'product' directamente

      if (!cart || cart.items.length === 0) {
        throw new Error('No items in cart.');
      }

      const totalAmount = cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0) * 100;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount, // Calcula el total del carrito
        currency: 'usd',
        payment_method: paymentMethodId,
        confirmation_method: 'automatic',
        confirm: true,
      });
      

      if (paymentIntent.status === 'succeeded') {
        // Extrae los últimos cuatro dígitos de la tarjeta desde el PaymentIntent
        const cardLastFourDigits = paymentIntent.charges.data[0].payment_method_details.card.last4;
      
        // Procede a crear la orden con los detalles de pago obtenidos de Stripe
        const paymentDetails = {
          methodPayment: "CREDIT_CARD",
          cardLastFourDigits: cardLastFourDigits,
          // No se incluye el CVV por razones de seguridad
          // Stripe no provee ni la fecha de expiración ni el nombre del titular en el PaymentIntent
          cardExpirationDate: "No Aplica",
          cardHolderName: "No Aplica"
        };
      
        const orders = await Promise.all(cart.items.map(async (item) => {
          return Order.create({
            items: [{
              product: item.product._id,
              quantity: item.quantity,
            }],
            customer: userId,
            paymentDetails,
            status: 'Paid', // Estado inicial de la orden
          });
        }));
      
        // Vacía el carrito después de crear la orden
        cart.items = [];
        await cart.save();
      
        return orders; // Retorna las órdenes creadas
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      throw new Error('Error creating order from cart: ' + error.message);
    }
  }

  static async getOrdersByUser(userId) {
    try {
      let orders = await Order.find({ customer: userId })
          .populate('items.product', 'name price')
          .populate('customer', 'name lastname street city country zip');

      // Asegurarse de manejar ítems cuyo producto ha sido eliminado
      orders = orders.map(order => {
          const orderObject = order.toObject();

          let total = 0;
          orderObject.items = orderObject.items.map(item => {
              // Verifica si el producto existe antes de acceder a sus propiedades
              const itemTotal = item.product ? item.quantity * item.product.price : 0;
              total += itemTotal;
              return {
                  ...item,
                  subtotal: itemTotal,
                  product: item.product ? item.product : { name: "Product deleted", price: 0 }
              };
          });

          orderObject.total = total;
          return orderObject;
      });

      return orders;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
  }

  static async getOrderById(orderId) {
    try {
    const order = await Order.findById(orderId)
      .populate('items.product', 'name price')
      .populate('customer', 'name lastname street city country zip paymentDetails');

    // Verifica si la orden existe antes de intentar acceder a sus propiedades
    if (!order) {
      throw new Error('Order not found');
    }

    const total = order.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const orderObject = order.toObject(); 
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