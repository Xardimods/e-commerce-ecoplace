import express from 'express';
import { SaleController } from '../controllers/sales.js';
import auth from '../middleware/auth.js'
import authAdmin  from '../middleware/auth.js'
import authSeller from '../middleware/auth.js'

export const SalesRouter = express.Router();


SalesRouter.get('/', auth, authAdmin, authSeller, SaleController.getAllSales);

SalesRouter.post('/', auth, SaleController.createSale);

SalesRouter.get('/seller/:sellerId', auth, authAdmin, authSeller, SaleController.getSalesBySeller);
