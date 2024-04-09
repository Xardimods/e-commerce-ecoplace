import { CartModel } from "../models/database/carts.js"; 

export class CartController {
  static async addItem(req, res) {
    try {
      const userId = req.user._id;
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
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).send({ error: 'Error getting cart.' });
    }
  }
  
  static async updateCart(req, res) {
    try {
      const userId = req.user._id; //  ID del usuario
      const itemsToUpdate = req.body.items; 
  
      const updatedCart = await CartModel.updateCartItems(userId, itemsToUpdate);
      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
  
  static async removeItem(req, res) {
    try {
      const userId = req.user._id; 
      const { product } = req.body; 
      
      const updatedCart = await CartModel.removeItemFromCart(userId, product);
      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
}