import { Router } from 'express';
import { CategoriesController } from '../controllers/categories.js';
import auth from '../middleware/auth.js';
import { authAdmin } from '../middleware/auth.js';

export const CategoriesRouter = Router();

CategoriesRouter.get('/', CategoriesController.getAll);
CategoriesRouter.get('/:id', auth, CategoriesController.getById);
CategoriesRouter.get('/search/:name', CategoriesController.findCategoryByName);

CategoriesRouter.post('/', auth, authAdmin, CategoriesController.createCategory);

CategoriesRouter.put('/:id', auth, authAdmin, CategoriesController.updateCategory)

CategoriesRouter.delete('/:id', auth, authAdmin, CategoriesController.deleteCategory)