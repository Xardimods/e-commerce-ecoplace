import mongoose from 'mongoose';
import { Order } from '../database/orders.js';

const saleSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateOfSale: {
    type: Date,
    default: Date.now
  },
  }, {
    timestamps: true // Aprovecha la creación automática de campos createdAt y updatedAt
  });

const Sale = mongoose.model("Sale", saleSchema);

export { Sale }

export class SaleModel {
  static async getAllSalesForAdmin(filter = {}) {
    // Buscar todas las órdenes con estado "Paid"
    const orders = await Order.find({ ...filter, status: 'Paid' }).populate({
      path: 'items.product',
      select: 'name description images brand price quantity',
      populate: [
        { path: 'seller', select: 'name lastname' }, // Para incluir el seller
        { path: 'categories', select: 'categoryName -_id' } // Asumiendo que el modelo de categoría tiene un campo 'categoryName'
      ]
    })
      .populate('customer', 'name lastname -_id');

    // Convertir órdenes en "ventas" según tu lógica de negocio
    return orders.map(order => ({
      // Estructura los datos de la orden de la manera que consideres una "venta"
      ...order.toObject(),
      // Aquí puedes añadir o modificar la información según necesites
    }));
  }

  static async getSalesBySellerforAdmin(sellerId) {
    const orders = await Order.find({ status: 'Paid' }).populate({
      path: 'items.product',
      match: { 'seller': sellerId }, // Filtrar los productos por el ID del vendedor
      select: 'name description images brand price quantity',
      populate: [
        { path: 'seller', select: 'name lastname' },
        { path: 'categories', select: 'categoryName -_id' }
      ]
    })
      .populate('customer', 'name lastname -_id');

    // Filtrar órdenes que contengan al menos un producto del vendedor
    const filteredOrders = orders.filter(order => order.items.some(item => item.product && item.product.seller._id.toString() === sellerId));

    return filteredOrders.map(order => ({
      ...order.toObject(),
    }));
  }

  static async getSalesByOrderIdforAdmin(orderId) {
    const order = await Order.findOne({ _id: orderId, status: 'Paid' }).populate({
      path: 'items.product',
      select: 'name description images brand price quantity',
      populate: [
        { path: 'seller', select: 'name lastname' },
        { path: 'categories', select: 'categoryName -_id' }
      ]
    })
      .populate('customer', 'name lastname -_id');

    if (!order) {
      return null; // O manejar como prefieras si la orden no existe o no está pagada
    }

    return order.toObject();
  }

  // Methods for Sellers
  static async getAllSalesForSeller(id) {
    try {
      const salesForSeller = await Order.find({}).populate({
        path: 'items.product',
        match: { 'seller': id }, // Filtrar los productos por el ID del vendedor
        select: 'name description images brand price quantity',
        populate: [
          { path: 'seller', select: 'name lastname -_id' },
          { path: 'categories', select: 'categoryName -_id' }
        ]
      })
        .populate('customer', 'name lastname -_id');
      return salesForSeller;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getSalesByOrderIdforSeller(sellerId, orderId) {
    try {
      const order = await Order.findById({ _id: orderId }).populate({
        path: 'items.product',
        match: { 'seller': sellerId },
        select: 'name description images brand price quantity',
        populate: [
          { path: 'seller', select: 'name lastname' },
          { path: 'categories', select: 'categoryName -_id' }
        ]
      })
        .populate('customer', 'name lastname -_id');

      if (!order) {
        throw new Error("Order not found");
      }

      return order;
    } catch (error) {
      throw new Error(error);
    }
  }
}