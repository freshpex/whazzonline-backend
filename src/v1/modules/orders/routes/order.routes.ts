import { Router } from 'express';
import { requireAuth } from '../../../../shared/middleware/require-auth.js';
import { checkoutHandler } from '../controllers/order.controller.js';

export const orderRouter = Router();
orderRouter.post('/checkout', requireAuth, checkoutHandler);
