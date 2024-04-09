import { SaleModel } from '../models/database/sales.js';

export class SaleController {

  static async getAllSales(req, res) {
    try {
      const sales = await SaleModel.getAllSales();
      res.json(sales);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getSalesById(req, res) {
    try {
      const { id } = req.params;
      const sale = await SaleModel.getSalesById(id);
      res.json(sale)
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createSale(req, res) {
    try {
      const { order } = req.body;
      const sale = await SaleModel.createSaleFromOrder(order);
      res.status(201).json(sale);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getSalesBySeller(req, res) {
    try {
      const { sellerId } = req.params;
      const sales = await SaleModel.getSalesBySeller(sellerId);
      res.json(sales);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}