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
  _id: false
});

const paymentDetailsSchema = new mongoose.Schema({
  paymentMethodId: String,
  amountPaid: Number,
  cardLastFourDigits: String,
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
    default: "Pending",
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
  timestamps: true
});

const Order = mongoose.model("Order", orderSchema);

export { Order }

export class OrderModel {
  static async createOrderFromCart(userId, paymentDetails) {
    const MAX_RETRIES = 5;
    let attempts = 0;

    while (attempts < MAX_RETRIES) {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const cart = await Cart.findOne({ User: userId }).populate({
          path: 'items.product',
          populate: {
            path: 'categories seller',
            select: 'categoryName name lastname images'
          }
        }).session(session);

        if (!cart || cart.items.length === 0) {
          throw new Error('No items in cart.');
        }

        const order = await Order.create([{
          items: cart.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
          })),
          customer: userId,
          paymentDetails: {
            paymentMethodId: paymentDetails.paymentMethodId,
            amountPaid: paymentDetails.amountPaid,
            cardLastFourDigits: paymentDetails.cardLastFourDigits,
            cardExpirationDate: paymentDetails.cardExpirationDate || "No Aplica",
            cardHolderName: paymentDetails.cardHolderName || "No Aplica",
          },
          status: 'Paid',
        }], { session });

        cart.items = [];
        await cart.save({ session });

        await session.commitTransaction();
        session.endSession();

        await order[0].populate({
          path: 'items.product',
          populate: {
            path: 'categories seller',
            select: 'categoryName name lastname images'
          }
        });

        return order[0];
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        
        if (error.message.includes('Write conflict')) {
          attempts += 1;
          console.log(`Retrying transaction... Attempt ${attempts}`);
          await new Promise(resolve => setTimeout(resolve, 100)); // Pequeño retraso antes de reintentar
        } else {
          throw new Error('Error creating order from cart: ' + error.message);
        }
      }
    }

    throw new Error('Max retries reached. Unable to create order from cart.');
  }

  static async emptyCart(userId) {
    try {
      const cart = await Cart.findOne({ User: userId });
      
      if (!cart) {
        throw new Error('Cart not found.');
      }

      cart.items = [];
      await cart.save();

      return { success: true, message: 'Cart emptied successfully.' };
    } catch (error) {
      throw new Error('Error emptying cart: ' + error.message);
    }
  }
  
  static async getOrdersByUser(userId) {
    try {
      let orders = await Order.find({ customer: userId })
          .sort({ createdAt: -1 })
          .populate({
          path: 'items.product', 
          select: 'name images price',
          populate: [
            { path: 'seller', select: 'name lastname -_id' }
          ]
          })
          .populate('customer', 'name lastname street city country zip paymentDetails');

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

  static async getAllOrdersByUser(userId) {
    try {
        return await Order.find({ customer: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'items.product',
                select: 'name description images brand price -_id',
                populate: [
                    { path: 'categories', select: 'categoryName' },
                    { path: 'seller', select: 'name lastname -_id' }
                ]
            })
            .populate('customer', 'name lastname street city country zip -_id');
    } catch (error) {
        console.error("Error fetching all orders by user:", error);
        throw error;
    }
}

  static async getOrderById(orderId) {
    try {
    const order = await Order.findById(orderId)
      .populate({
      path: 'items.product', 
      select: 'name images price quantity brand price description',
      populate: [
        { path: 'categories', select: 'categoryName' },
        { path: 'seller', select: 'name lastname -_id' }
      ]
      }).populate('customer', 'name lastname street city country zip paymentDetails');

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
      .populate('items.product', 'name price quantity')
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