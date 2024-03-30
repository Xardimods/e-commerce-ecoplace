import { CartModel } from "../models/database/carts.js"; 

export class CartController {
  static async addItem(req, res) {
    try {
      const userId = req.user._id; // Asumiendo que el middleware de autenticación añade el usuario al req
      const items = req.body.items; // Espera una matriz de ítems

      const cart = await CartModel.addItemToCart(userId, items);
      res.status(200).json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Error al añadir ítems al carrito' });
    }
  }
}