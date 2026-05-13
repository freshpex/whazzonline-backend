import { Router } from 'express';
import { authRouter } from './modules/auth/routes/auth.routes.js';
import { docsRouter } from './modules/docs/routes/docs.routes.js';
import { healthRouter } from './modules/health/routes/health.routes.js';
import { orderRouter } from './modules/orders/routes/order.routes.js';
import { productRouter } from './modules/products/routes/product.routes.js';

export const v1Router = Router();
v1Router.use('/auth', authRouter);
v1Router.use('/docs', docsRouter);
v1Router.use('/health', healthRouter);
v1Router.use('/products', productRouter);
v1Router.use('/orders', orderRouter);
