import { Router } from 'express';
import { ProductsController } from '../controllers/products.js';
import auth from '../middleware/auth.js';
import { authAdmin, authSeller } from '../middleware/auth.js';

export const ProductsRouter = Router();

ProductsRouter.get('/', auth, ProductsController.getAll);
ProductsRouter.get('/search', auth, ProductsController.getFilteredProducts);
ProductsRouter.get('/:id', auth, ProductsController.getById);

ProductsRouter.post('/', auth, authAdmin, authSeller, ProductsController.createProduct);

ProductsRouter.patch('/:id', auth, authAdmin, authSeller, ProductsController.updateProduct)

ProductsRouter.delete('/:id', auth, authAdmin, authSeller, ProductsController.deleteProduct)

