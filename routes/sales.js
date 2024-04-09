import express from 'express';
import { SaleController } from '../controllers/sales.js';
import auth from '../middleware/auth.js'
import { authRole } from '../middleware/auth.js'

export const SalesRouter = express.Router();

// Admin
SalesRouter.get('/admin', auth, authRole(['Admin']), SaleController.getAllSalesForAdmin);
SalesRouter.get('/admin/by-seller/:sellerId', auth, authRole(['Admin']), SaleController.getSalesBySellerforAdmin);
SalesRouter.get('/admin/by-order/:orderId', auth, authRole(['Admin']), SaleController.getSalesByOrderIdforAdmin);

// Seller
SalesRouter.get('/seller', auth, authRole(['Seller']), SaleController.getAllSalesForSeller);
SalesRouter.get('/seller/by-order/:orderId', auth, authRole(['Seller']), SaleController.getSalesByOrderIdforSeller);