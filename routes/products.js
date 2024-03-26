import { Router } from 'express';
import { ProductsController } from '../controllers/products.js';

export const ProductsRouter = Router();

ProductsRouter.get('/', ProductsController.getAll);
ProductsRouter.get('/search', ProductsController.getFilteredProducts);
ProductsRouter.get('/:id', ProductsController.getById);

ProductsRouter.post('/', ProductsController.createProduct);

ProductsRouter.patch('/:id', ProductsController.updateProduct)

ProductsRouter.delete('/:id', ProductsController.deleteProduct)

