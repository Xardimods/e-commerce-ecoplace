import { OrderModel } from "../models/database/orders.js"

export class OrderController {
  static async createOrder(req, res) {
    try {
      const userId = req.user._id
      const order = await OrderModel.createOrderFromCart(userId)
      res.status(200).json(order)
    } catch (error) {
      res.status(400).send({ message: error.message })
    }
  }
}