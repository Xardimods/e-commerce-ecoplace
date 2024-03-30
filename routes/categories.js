import { Router } from 'express';
import { CategoriesController } from '../controllers/categories.js';
import auth from '../middleware/auth.js';

export const CategoriesRouter = Router();

CategoriesRouter.get('/', auth, CategoriesController.getAll);
CategoriesRouter.get('/:id', auth, CategoriesController.getById);
CategoriesRouter.get('/search/:name', auth, CategoriesController.findCategoryByName);

CategoriesRouter.post('/', auth, CategoriesController.createCategory);

CategoriesRouter.put('/:id', auth, CategoriesController.updateCategory)

CategoriesRouter.delete('/:id', auth, CategoriesController.deleteCategory)