import { Router } from 'express'
import { OrderController } from '../controllers/orders.js'
import auth from '../middleware/auth.js'
import { authRole } from '../middleware/auth.js'

export const OrderRouter = Router()

OrderRouter.post('/', auth, OrderController.createOrderFromCart)
OrderRouter.post('/create-checkout-session', auth, OrderController.createCheckoutSession)
OrderRouter.get('/all', auth, authRole(['Admin']), OrderController.getAllOrders)
OrderRouter.get('/me', auth, OrderController.getUserOrders)
OrderRouter.get('/:orderId', auth, OrderController.getOrder)
OrderRouter.put('/:orderId', auth, authRole(['Admin']), OrderController.updateOrder)