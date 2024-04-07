import { OrderModel } from "../models/database/orders.js"
import stripe from  '../models/config/stripConfig.js'
import { CartModel } from '../models/database/carts.js'

export class OrderController {
  static async createOrderFromCart(req, res) {
    const userId = req.user._id;
    const sessionId = req.body.sessionId; //ID de la sesión de checkout

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === 'paid') {
          const paymentMethodId = session.payment_method;
          const orders = await OrderModel.createOrderFromCart(userId, paymentMethodId);
          res.status(201).json(orders);
      } else {
        return res.status(400).json({ message: "El pago no pudo ser procesado." });
      }
    } catch (error) {
      console.error("Error al crear la orden desde el carrito:", error);
      res.status(500).json({ message: "Error al crear la orden desde el carrito", error: error.message });
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