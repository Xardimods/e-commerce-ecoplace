import { Router } from 'express'
import { OrderController } from '../controllers/orders.js'
import auth from '../middleware/auth.js'
import { authAdmin } from '../middleware/auth.js'

export const OrderRouter = Router()

OrderRouter.post('/', auth, OrderController.createOrderFromCart)
OrderRouter.get('/all', auth, authAdmin, OrderController.getAllOrders)
OrderRouter.get('/me', auth, OrderController.getUserOrders)
OrderRouter.get('/:orderId', auth, OrderController.getOrder)
OrderRouter.put('/:orderId', auth, authAdmin, OrderController.updateOrder)