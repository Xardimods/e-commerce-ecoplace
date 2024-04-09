import express from 'express';
import { SaleController } from '../controllers/sales.js';
import auth from '../middleware/auth.js'
import { authRole } from '../middleware/auth.js'

export const SalesRouter = express.Router();


SalesRouter.get('/', auth, authRole(['Admin', 'Seller']), SaleController.getAllSales);
SalesRouter.get('/:id', auth, authRole(['Admin', 'Seller']), SaleController.getSalesById);
SalesRouter.get('/seller/:sellerId', auth, authRole(['Admin', 'Seller']), SaleController.getSalesBySeller);

SalesRouter.post('/', auth, SaleController.createSale);