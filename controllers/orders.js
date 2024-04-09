import { OrderModel } from "../models/database/orders.js"
import stripe from  '../models/config/stripConfig.js'
import { CartModel } from '../models/database/carts.js'
import { sendMail } from "../services/mail/nodemailer.js";

export class OrderController {
  static async processOrder(req, res) {
    const userId = req.user._id;
    const sessionId = req.body.sessionId; // Asumiendo que el ID de la sesión de Stripe viene en el cuerpo de la solicitud

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      // Primero, verifica que el estado del pago sea 'paid'.
      if (session.payment_status !== 'paid') {
        return res.status(400).json({ message: 'El pago no fue completado exitosamente.' });
      }

      // Aquí construyes los paymentDetails basándote en la sesión de Stripe.
      // Asegúrate de ajustar estos valores según los datos reales que puedas obtener de Stripe y tu lógica de negocio.
      const paymentDetails = {
        paymentMethodId: session.payment_method_types[0], // Ejemplo: 'card'
        amountPaid: session.amount_total,
        cardLastFourDigits: '****', // Stripe no proporciona esto en la sesión; necesitarás manejarlo de otra manera si es necesario.
        cardExpirationDate: 'MM/AA', // Ejemplo ficticio
        cardHolderName: 'Nombre Apellido', // Ejemplo ficticio
      };

      const order = await OrderModel.createOrderFromCart(userId, paymentDetails);

      if (order) {
        await OrderModel.emptyCart(userId); // Solo se llama si la orden se crea exitosamente
      }     
      
      let htmlContent = `<h1>Orden Creada</h1>`;
        htmlContent += `<p>Detalle de tu orden:</p>`;
        htmlContent += `<ul>`;

        htmlContent += `<li>${session.payment_method_types[0]} - Precio: ${session.amount_total}</li>`;

        htmlContent += `</ul>`;
        htmlContent += `<p>Total Pagado: ${session.amount_total / 100}</p>`; // Asumiendo que amount_total está en centavos
        sendMail(req.user.email, "Detalles de tu pago EcoPlace", htmlContent);

      res.status(201).json(order);
    } catch (error) {
      console.error('Error processing the order:', error);
      res.status(500).json({ success: false, message: 'Error processing the order', error: error.message });
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