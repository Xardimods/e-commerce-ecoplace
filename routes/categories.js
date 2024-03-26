import { Router } from 'express';
import { CategoriesController } from '../controllers/categories.js';

export const CategoriesRouter = Router();

CategoriesRouter.get('/', CategoriesController.getAll);
CategoriesRouter.get('/:id', CategoriesController.getById);

CategoriesRouter.post('/', CategoriesController.createProduct);

CategoriesRouter.patch('/:id', CategoriesController.updateProduct)

CategoriesRouter.delete('/:id', CategoriesController.deleteProduct)