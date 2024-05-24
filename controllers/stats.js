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

  static async getTotalProductsSoldBySeller(req, res) {
    const sellerId = req.user._id; // Asumiendo que el ID del usuario está en el token de autenticación
    try {
      const orders = await Order.find({}).populate({
        path: 'items.product',
        select: 'seller'
      });

      let totalProductsSold = 0;
      orders.forEach(order => {
        order.items.forEach(item => {
          if (item.product && item.product.seller && item.product.seller.toString() === sellerId.toString()) {
            totalProductsSold += item.quantity;
          }
        });
      });

      res.json({ totalProductsSold });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching total products sold by seller', error: error.message });
    }
  }

  static async getTotalProductsCreatedBySeller(req, res) {
    const userId = req.user._id; // Asumiendo que el ID del usuario está en el token de autenticación
    try {
      const totalProductsCreated = await Product.countDocuments({ seller: userId });
      res.json({ totalProductsCreated });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching total products created by client', error: error.message });
    }
  };

  static async getProductSalesStats(req, res) {
    const sellerId = req.user._id;
    try {
        const orders = await Order.find({})
            .populate({
                path: 'items.product',
                populate: [
                    { path: 'categories', select: 'categoryName' },
                    { path: 'seller', select: 'name lastname' }
                ]
            });

        let productSales = {};

        orders.forEach(order => {
            order.items.forEach(item => {
                if (item.product && item.product.seller && item.product.seller._id && item.product.seller._id.toString() === sellerId.toString()) {
                    const productId = item.product._id.toString();
                    if (!productSales[productId]) {
                        productSales[productId] = {
                            name: item.product.name,
                            price: item.product.price,
                            sold: 0,
                            categories: item.product.categories.map(cat => cat.categoryName)
                        };
                    }
                    productSales[productId].sold += item.quantity;
                }
            });
        });

        const salesStats = Object.values(productSales);
        const mostSold = salesStats.sort((a, b) => b.sold - a.sold).slice(0, 5);
        const leastSold = salesStats.sort((a, b) => a.sold - b.sold).slice(0, 5);
        const highestPriceSold = salesStats.sort((a, b) => b.price - a.price).slice(0, 5);
        const lowestPriceSold = salesStats.sort((a, b) => a.price - b.price).slice(0, 5);

        res.json({ mostSold, leastSold, highestPriceSold, lowestPriceSold });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product sales stats', error: error.message });
    }
  };

  static async getSalesStats(req, res) {
    try {
        const orders = await Order.find({})
            .populate({
                path: 'items.product',
                populate: [
                    { path: 'categories', select: 'categoryName' },
                    { path: 'seller', select: 'name lastname' }
                ]
            })
            .populate('customer', 'name lastname');

        let productSales = {};
        let dailySales = {};

        orders.forEach(order => {
            const orderDate = order.createdAt.toISOString().split('T')[0];
            if (!dailySales[orderDate]) {
                dailySales[orderDate] = 0;
            }
            dailySales[orderDate] += 1;

            order.items.forEach(item => {
                if (item.product && item.product._id) { // Verificar que el producto no sea nulo
                    const productId = item.product._id.toString();
                    if (!productSales[productId]) {
                        productSales[productId] = {
                            name: item.product.name,
                            price: item.product.price,
                            sold: 0,
                            categories: item.product.categories.map(cat => cat.categoryName)
                        };
                    }
                    productSales[productId].sold += item.quantity;
                }
            });
        });

        const salesStats = Object.values(productSales);
        const mostSold = salesStats.sort((a, b) => b.sold - a.sold).slice(0, 5);
        const leastSold = salesStats.sort((a, b) => a.sold - b.sold).slice(0, 5);
        const highestPriceSold = salesStats.sort((a, b) => b.price - a.price).slice(0, 5);
        const lowestPriceSold = salesStats.sort((a, b) => a.price - b.price).slice(0, 5);

        const dailySalesStats = Object.entries(dailySales).map(([date, count]) => ({ date, count }));

        res.json({ mostSold, leastSold, highestPriceSold, lowestPriceSold, dailySalesStats });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sales stats', error: error.message });
    }
  };
}










