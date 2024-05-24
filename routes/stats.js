import { Router } from "express";
import { StatsController } from '../controllers/stats.js';
import auth from '../middleware/auth.js';
import { authRole } from '../middleware/auth.js';

export const StatsRouter = Router();

// Admin
StatsRouter.get('/sales/count', auth, authRole(['Admin']), StatsController.getSalesCount);
StatsRouter.get('/orders/count', auth, authRole(['Admin']),StatsController.getOrdersCount);
StatsRouter.get('/products/count', auth, authRole(['Admin']), StatsController.getProductsCount);
StatsRouter.get('/users/count', auth, authRole(['Admin']), StatsController.getUsersCount);
StatsRouter.get('/categories/count', auth, authRole(['Admin']), StatsController.getCategoriesCount);
StatsRouter.get('/admin/product-sales-stats', auth, authRole(['Admin']), StatsController.getSalesStats);

//Seller
StatsRouter.get('/client/products-sold', auth, authRole(['Seller']), StatsController.getTotalProductsSoldBySeller);
StatsRouter.get('/client/products-created', auth, authRole(['Seller']), StatsController.getTotalProductsCreatedBySeller);
StatsRouter.get('/client/product-sales-stats', auth, authRole(['Seller']), StatsController.getProductSalesStats);