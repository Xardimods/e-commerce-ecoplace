import { Router } from "express";
import { StatsController } from '../controllers/stats.js';
import auth from '../middleware/auth.js';
import { authRole } from '../middleware/auth.js';

export const StatsRouter = Router();

StatsRouter.get('/sales/count', auth, authRole(['Admin']), StatsController.getSalesCount);
StatsRouter.get('/orders/count', auth, authRole(['Admin']),StatsController.getOrdersCount);
StatsRouter.get('/products/count', auth, authRole(['Admin']), StatsController.getProductsCount);
StatsRouter.get('/users/count', auth, authRole(['Admin']), StatsController.getUsersCount);
StatsRouter.get('/categories/count', auth, authRole(['Admin']), StatsController.getCategoriesCount);