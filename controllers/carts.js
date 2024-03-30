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
      res.status(500).send({ error: 'Error adding items to cart.' });
    }
  }

  static async getCart(req, res) {
    try {
      const userId = req.user._id;
      const cart = await CartModel.getCartByUserId(userId);
      if (!cart || cart.items.length === 0) {
        return res.status(404).send({ message: 'The cart is empty.' });
      }
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).send({ error: 'Error getting cart.' });
    }
  }
  
  static async updateCart(req, res) {
    try {
      const userId = req.user._id; // Asegúrate de que este es el ID correcto del usuario
      const itemsToUpdate = req.body.items; // Esto debería coincidir con la estructura que envías desde Postman
  
      const updatedCart = await CartModel.updateCartItems(userId, itemsToUpdate);
      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
  
  static async removeItem(req, res) {
    try {
      const userId = req.user._id; // Asume que el ID del usuario se obtiene del token de autenticación
      const { product } = req.body; // Extrae el productId del cuerpo de la solicitud
      
      const updatedCart = await CartModel.removeItemFromCart(userId, product);
      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
}