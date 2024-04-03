import { Router } from 'express';
import { ProductsController } from '../controllers/products.js';
import auth from '../middleware/auth.js';
import { authSeller }  from '../middleware/auth.js';
import { authAdmin } from '../middleware/auth.js';

export const ProductsRouter = Router();

ProductsRouter.get('/', ProductsController.getAll);
ProductsRouter.get('/search', ProductsController.getFilteredProducts);
ProductsRouter.get('/:id', ProductsController.getById);

ProductsRouter.post('/', auth, authSeller, authAdmin,  ProductsController.createProduct);

ProductsRouter.patch('/:id', auth, authSeller, authAdmin, ProductsController.updateProduct)

ProductsRouter.delete('/:id', auth, authSeller, authAdmin, ProductsController.deleteProduct)

