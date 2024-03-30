import { Router } from 'express'
import { OrderController } from '../controllers/orders.js'
import auth from '../middleware/auth.js'

export const OrderRouter = Router()

OrderRouter.post('/', auth, OrderController.createOrderFromCart)
