import { Router } from 'express';
import { CategoriesController } from '../controllers/categories.js';

export const CategoriesRouter = Router();

CategoriesRouter.get('/', CategoriesController.getAll);
CategoriesRouter.get('/:id', CategoriesController.getById);
CategoriesRouter.get('/search/:name', CategoriesController.findCategoryByName);

CategoriesRouter.post('/', CategoriesController.createCategory);

CategoriesRouter.put('/:id', CategoriesController.updateCategory)

CategoriesRouter.delete('/:id', CategoriesController.deleteCategory)