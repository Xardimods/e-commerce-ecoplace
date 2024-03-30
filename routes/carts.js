import { Router } from "express"
import { CartController } from "../controllers/carts.js"
import auth from '../middleware/auth.js'

export const CartRouter = Router()

CartRouter.post('/add', auth, CartController.addItem)
CartRouter.get('/', auth, CartController.getCart);
CartRouter.put('/update-cart', auth, CartController.updateCart);
CartRouter.delete('/remove-item', auth, CartController.removeItem);