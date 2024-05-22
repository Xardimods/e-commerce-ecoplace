import { OrderModel } from "../models/database/orders.js"
import stripe from  '../models/config/stripConfig.js'
import { CartModel } from '../models/database/carts.js'
import { sendMail } from "../services/mail/nodemailer.js";

const orderProcessing = new Map(); // Mapa para seguir el estado de las órdenes

export class OrderController {
  static async processOrder(req, res) {
    const userId = req.user._id;
    const sessionId = req.body.sessionId;

    // Verificar si ya hay una orden en proceso para este usuario
    if (orderProcessing.get(userId)) {
      return res.status(429).json({ message: 'Ya hay una orden en proceso para este usuario.' });
    }

    // Marcar que una orden está en proceso
    orderProcessing.set(userId, true);

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== 'paid') {
        orderProcessing.delete(userId);
        return res.status(400).json({ message: 'El pago no fue completado exitosamente.' });
      }

      const paymentDetails = {
        paymentMethodId: session.payment_method_types[0],
        amountPaid: session.amount_total / 100,
        cardLastFourDigits: '****',
        cardExpirationDate: 'MM/AA',
        cardHolderName: 'Nombre Apellido',
      };

      const order = await OrderModel.createOrderFromCart(userId, paymentDetails);
      if (!order) {
        orderProcessing.delete(userId);
        return res.status(400).json({ message: 'No se pudo crear la orden.' });
      }

      // No vaciamos el carrito aquí porque ya lo hacemos en createOrderFromCart

      const emailContext = {
        userName: `${req.user.name} ${req.user.lastname}`,
        items: order.items.map(item => ({
          productName: item.product.name,
          quantity: item.quantity,
          productPrice: item.product.price,
          productCategory: item.product.categories.length > 0 ? item.product.categories[0].categoryName : "N/A",
          productImage: item.product.images.length > 0 ? item.product.images[0] : '',
          sellerName: item.product.seller ? `${item.product.seller.name} ${item.product.seller.lastname}` : "N/A",
        })),
        totalAmount: order.paymentDetails.amountPaid,
        paymentMethod: order.paymentDetails.paymentMethodId,
        year: new Date().getFullYear(),
      };

      await sendMail(req.user.email, "Detalles de tu pago EcoPlace", "order_created", emailContext);
      res.status(201).json(order);
    } catch (error) {
      console.error('Error processing the order:', error);
      res.status(500).json({ success: false, message: 'Error processing the order', error: error.message });
    } finally {
      // Eliminar el estado de la orden en proceso
      orderProcessing.delete(userId);
    }
  }

  static async createCheckoutSession(req, res) {
    try {
      const userId = req.user._id; // Asume autenticación
      const cart = await CartModel.getCartByUserId(userId); // Asume método existente que devuelve el carrito del usuario

      const lineItems = cart.items.map(item => {
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.product.name,
            },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity,
        };
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cancel`,
      });

      res.json({ sessionId: session.id });
    } catch (error) {
      console.error('Error creating checkout session', error);
      res.status(500).send('Error creating checkout session');
    }
  }

  static async verifyCheckoutSession(req, res) {
    const sessionId = req.params.sessionId;
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getUserOrders(req, res) {
    const userId = req.user._id;
    try {
      const orders = await OrderModel.getOrdersByUser(userId);
      res.json(orders);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getAllUserOrders(req, res) {
    const userId = req.user._id;
    try {
        const orders = await OrderModel.getAllOrdersByUser(userId);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving all user orders", error });
    }
}
  
  static async getOrder(req, res) {
    const { orderId } = req.params;
    try {
      const order = await OrderModel.getOrderById(orderId);
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getAllOrders(req, res) {
    try {
      const orders = await OrderModel.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching all orders", error: error.message });
    }
  }
  
  static async updateOrder(req, res) {
    const { orderId } = req.params;
    const updateData = req.body;
    try {
      const updatedOrder = await OrderModel.updateOrder(orderId, updateData);
      res.json(updatedOrder);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}