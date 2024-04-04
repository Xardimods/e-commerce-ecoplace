import { Router } from 'express';
import { ProductsController } from '../controllers/products.js';
import auth from '../middleware/auth.js';
import { authRole }  from '../middleware/auth.js';
import { uploadImages } from '../middleware/multer.js';

export const ProductsRouter = Router();

ProductsRouter.get('/', ProductsController.getAll);
ProductsRouter.get('/search', ProductsController.getFilteredProducts);
ProductsRouter.get('/:id', ProductsController.getById);

ProductsRouter.post('/', auth, authRole(['Seller', 'Admin']), uploadImages,  ProductsController.createProduct);

ProductsRouter.patch('/:id', auth, authRole(['Seller', 'Admin']), uploadImages, ProductsController.updateProduct)

ProductsRouter.delete('/:id', auth, authRole(['Seller', 'Admin']), ProductsController.deleteProduct)

