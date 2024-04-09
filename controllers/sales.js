import { SaleModel } from "../models/database/sales.js";

export class SaleController {
  static async getAllSales(req, res) {
    try {
      const sales = await SaleModel.getAllSales();
      res.json(sales);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener las ventas", error });
    }
  }

  static async getSalesBySeller(req, res) {
    const { sellerId } = req.params;
    try {
      const sales = await SaleModel.getSalesBySeller(sellerId);
      res.json(sales);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Obtener venta por ID de la orden con status Paid
  static async getSalesByOrderId(req, res) {
    const { orderId } = req.params;
    try {
      const sale = await SaleModel.getSalesByOrderId(orderId);
      if (!sale) {
        return res.status(404).json({ message: "Sale not found" });
      }
      res.json(sale);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
