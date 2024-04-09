import express from 'express';
import { SaleController } from '../controllers/sales.js';
import auth from '../middleware/auth.js'
import {authRole}  from '../middleware/auth.js'

export const SalesRouter = express.Router();


SalesRouter.get('/', auth, authRole(['Admin']), SaleController.getAllSales);
SalesRouter.get('/by-seller/:sellerId', auth, authRole(['Admin', 'Seller']), SaleController.getSalesBySeller);
SalesRouter.get('/by-order/:orderId', auth, authRole(['Admin', 'Seller']), SaleController.getSalesByOrderId);
