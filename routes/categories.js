import { Router } from 'express';
import { CategoriesController } from '../controllers/categories.js';

export const CategoriesRouter = Router();

CategoriesRouter.get('/', CategoriesController.getAll);
CategoriesRouter.get('/:id', CategoriesController.getById);

CategoriesRouter.post('/', CategoriesController.createCategory);

CategoriesRouter.patch('/:id', CategoriesController.updateCategory)

CategoriesRouter.delete('/:id', CategoriesController.deleteCategory)