import mongoose from 'mongoose';
import { Order } from './orders.js';

const saleSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order", 
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  totalSalePrice: {
    type: Number, 
    required: true,
  },
  status: {
    type: String, 
    required: true,
    default: "Completada",
  },
  paymentDetails: {
    method: {
      type: String, 
      required: true,
      enum: ["CREDIT_CARD", "DEBIT_CARD", "PAYPAL", "BANK_TRANSFER", "CASH_ON_DELIVERY"],
    },
    transactionId: { type: String }, 
  },
  dateOfSale: {
    type: Date,
    default: Date.now, // Fecha de la transacción de venta
  },
});

const Sale = mongoose.model("Sale", saleSchema);

export class SaleModel {
  static async getAllSales() {
    try {
      return await Sale.find().populate('order')
      .populate('customer', 'name')
      .populate('seller', 'name');
    } catch (error) {
      throw new Error('Error al obtener todas las ventas: ' + error.message);
    }
  }

  static async createSaleFromOrder(orderId) {
    try {
      const order = await Order.findById(orderId)
        .populate({
          path: 'items.product',
          populate: {
            path: 'seller', // Asumiendo que el modelo de Product tiene un campo 'seller'
          }
        })
        .populate('customer', 'name lastname');

      if (!order) throw new Error('Pedido no encontrado.');

      // Opcional: Verifica el estado del pedido aquí

      const sale = new Sale({
        order: order._id,
        customer: order.customer._id,
        totalSalePrice: order.items.reduce((total, item) => total + item.product.price * item.quantity, 0),
        status: 'Paid',
        paymentDetails: {
          method: order.methodPayment,
          // Detalles adicionales según sea necesario
        },
        dateOfSale: new Date() // Ajustar según sea necesario
      });

      await sale.save();
      return sale;
    } catch (error) {
      throw new Error('Error al crear la venta: ' + error.message);
    }
  }


  static async getSalesBySeller(sellerId) {
    try {
      return await Sale.find({ seller: sellerId })
      .populate('order')
      .populate('customer', 'name');
    } catch (error) {
      throw new Error('Error al obtener ventas por vendedor: ' + error.message);
    }
  }
}