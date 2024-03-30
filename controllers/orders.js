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