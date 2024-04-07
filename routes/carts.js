import { Router } from "express"
import { CartController } from "../controllers/carts.js"
import auth from '../middleware/auth.js'
import { authRole } from '../middleware/auth.js';

export const CartRouter = Router()

CartRouter.post('/add', auth, authRole(['Customer']), CartController.addItem)
CartRouter.get('/', auth, authRole(['Customer']), CartController.getCart);
CartRouter.put('/update-cart', auth, authRole(['Customer']), CartController.updateCart);
CartRouter.delete('/remove-item', auth, authRole(['Customer']), CartController.removeItem);