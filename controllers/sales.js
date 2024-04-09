import { SaleModel } from "../models/database/sales.js";

export class SaleController {
  static async getAllSalesForAdmin(req, res) {
    try {
      const sales = await SaleModel.getAllSalesForAdmin();
      res.json(sales);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener las ventas", error });
    }
  }

  static async getSalesBySellerforAdmin(req, res) {
    const { sellerId } = req.params;
    try {
      const sales = await SaleModel.getSalesBySellerForAdmin(sellerId);
      res.json(sales);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Obtener venta por ID de la orden con status Paid
  static async getSalesByOrderIdforAdmin(req, res) {
    const { orderId } = req.params;
    try {
      const sale = await SaleModel.getSalesByOrderIdforAdmin(orderId);
      if (!sale) {
        return res.status(404).json({ message: "Sale not found" });
      }
      res.json(sale);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Methods for Sellers
  static async getAllSalesForSeller(req, res) {
    try {
      const sellerId = req.user._id;
      const sellerSales = await SaleModel.getAllSalesForSeller(sellerId);
      res.json(sellerSales);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSalesByOrderIdforSeller(req, res) {
    try {
      const { orderId } = req.params;
      const sellerId = req.user._id;
      const order = await SaleModel.getSalesByOrderIdforSeller(sellerId, orderId);
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
