import { OrderModel } from "../models/database/orders.js"
import stripe from  '../models/config/stripConfig.js'
import { CartModel } from '../models/database/carts.js'
export class OrderController {
  static async createOrderFromCart(req, res) {
    const userId = req.user._id;
    const { paymentMethodId } = req.body;

    try {
      // Suponemos que ya tienes una manera de calcular el total del carrito aquí
      const { total, cartItems } = await CartModel.calculateCartTotal(userId);

      // Crear el PaymentIntent con Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total * 100, // Asume que total ya está en dólares, convierte a centavos
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: true,
      });

      if (paymentIntent.status === 'succeeded') {
        // Suponemos que el método createOrderFromCart realiza la creación de la orden y actualiza el estado del carrito internamente
        const orders = await OrderModel.createOrderFromCart(userId, cartItems, {
          methodPayment: "CREDIT_CARD",
          cardLastFourDigits: paymentIntent.charges.data[0].payment_method_details.card.last4,
          // Aquí incluirías el resto de los detalles de pago obtenidos
        });

        res.status(201).json(orders);
      } else {
        res.status(400).json({ message: "El pago no pudo ser procesado." });
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
        success_url: `http://localhost:3001//success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:3001//cancel`,
      });

      res.json({ sessionId: session.id });
    } catch (error) {
      console.error('Error creating checkout session', error);
      res.status(500).send('Error creating checkout session');
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