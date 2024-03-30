import { Router } from "express"
import { CartController } from "../controllers/carts.js"
import auth from '../middleware/auth.js'

export const CartRouter = Router()

CartRouter.post('/add', auth, CartController.addItem)

CartRouter.get('/test', (req, res) => res.send('Test route is working!'));