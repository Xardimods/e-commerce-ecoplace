import { Router } from 'express';
import { CategoriesController } from '../controllers/categories.js';
import auth from '../middleware/auth.js';
import { authRole } from '../middleware/auth.js';

export const CategoriesRouter = Router();

CategoriesRouter.get('/', CategoriesController.getAll);
CategoriesRouter.get('/:id', auth, CategoriesController.getById);
CategoriesRouter.get('/search/:name', CategoriesController.findCategoryByName);

CategoriesRouter.post('/', auth, authRole(['Admin']), CategoriesController.createCategory);

CategoriesRouter.put('/:id', auth, authRole(['Admin']), CategoriesController.updateCategory)

CategoriesRouter.delete('/:id', auth, authRole(['Admin']), CategoriesController.deleteCategory)