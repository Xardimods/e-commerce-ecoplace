import { Sale } from '../models/database/sales.js';
import { Order } from '../models/database/orders.js';
import { Product } from '../models/database/products.js';
import { User } from '../models/database/users.js';
import { Category } from '../models/database/categories.js';

export class StatsController{
  static async getSalesCount(req, res){
    try {
        const count = await Sale.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sales count', error: error.message });
    }
  };

  static async getOrdersCount(req, res){
    try {
        const count = await Order.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders count', error: error.message });
    }
  };

  static async getProductsCount(req, res){
    try {
        const count = await Product.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products count', error: error.message });
    }
  };

  static async getUsersCount(req, res){
    try {
        const count = await User.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users count', error: error.message });
    }
  };

  static async getCategoriesCount (req, res){
    try {
        const count = await Category.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories count', error: error.message });
    }
  };

  static async getTotalProductsSoldToClient(req, res) {
    const userId = req.user._id; // Asumiendo que el ID del usuario está en el token de autenticación
    try {
      const orders = await Order.find({ customer: userId }).populate('items.product');
      let totalProductsSold = 0;
      orders.forEach(order => {
        totalProductsSold += order.items.reduce((sum, item) => sum + item.quantity, 0);
      });
      res.json({ totalProductsSold });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching total products sold to client', error: error.message });
    }
  };

  static async getTotalProductsCreatedByClient(req, res) {
    const userId = req.user._id; // Asumiendo que el ID del usuario está en el token de autenticación
    try {
      const totalProductsCreated = await Product.countDocuments({ seller: userId });
      res.json({ totalProductsCreated });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching total products created by client', error: error.message });
    }
  };
}










