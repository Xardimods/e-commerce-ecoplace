import { CartModel } from "../models/database/carts.js"; 

export class CartController {
  static async addItem(req, res) {
    try {
      const userId = req.user._id; 
      const { productId, quantity } = req.body;
      const cart = await CartModel.addItemToCart(userId, { productId, quantity });
      res.status(200).json(cart);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }
}