import { OrderModel } from "../models/database/orders.js"

export class OrderController {
  static async createOrderFromCart(req, res) {
    const userId = req.user._id; // Asume que el middleware de autenticación añade el usuario a req.
    const { methodPayment } = req.body; // Obtener methodPayment desde el cuerpo de la solicitud.
    try {
      const orders = await OrderModel.createOrderFromCart(userId, methodPayment);
      res.status(201).json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error creating order from cart", error: error.message });
    }
  }
}