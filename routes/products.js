import { Router } from 'express';
import { ProductsController } from '../controllers/products.js';
import auth from '../middleware/auth.js';
import authSeller  from '../middleware/auth.js';
import authAdmin from '../middleware/auth.js';

export const ProductsRouter = Router();

ProductsRouter.get('/', auth, ProductsController.getAll);
ProductsRouter.get('/search', auth, ProductsController.getFilteredProducts);
ProductsRouter.get('/:id', auth, ProductsController.getById);

ProductsRouter.post('/', auth, authSeller, authAdmin,  ProductsController.createProduct);

ProductsRouter.patch('/:id', auth, authSeller, authAdmin, ProductsController.updateProduct)

ProductsRouter.delete('/:id', auth, authSeller, authAdmin, ProductsController.deleteProduct)

