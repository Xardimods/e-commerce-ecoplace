import { Router } from 'express'
import { OrderController } from '../controllers/orders.js'
import auth from '../middleware/auth.js'
import { authRole } from '../middleware/auth.js'

export const OrderRouter = Router()

OrderRouter.post('/create-checkout-session', auth, authRole(['Customer']), OrderController.createCheckoutSession)
OrderRouter.get('/checkout-session/:sessionId', auth, authRole(['Customer']), OrderController.verifyCheckoutSession)
OrderRouter.post('/', auth, authRole(['Customer']), OrderController.processOrder)
OrderRouter.get('/all', auth, authRole(['Admin']), OrderController.getAllOrders)
OrderRouter.get('/me', auth, authRole(['Customer']), OrderController.getUserOrders)
OrderRouter.get('/user/all', auth, authRole(['Customer']), OrderController.getAllUserOrders)
OrderRouter.get('/:orderId', auth, authRole(['Customer' ,'Seller', 'Admin']), OrderController.getOrder)
OrderRouter.put('/:orderId', auth, authRole(['Admin']), OrderController.updateOrder)