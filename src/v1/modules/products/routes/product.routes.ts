import { Router } from 'express';
import { requireAuth } from '../../../../shared/middleware/require-auth.js';
import { requireProductManager } from '../../../../shared/middleware/require-product-manager.js';
import { createProduct, getProduct, listProducts } from '../controllers/product.controller.js';

export const productRouter = Router();
productRouter.get('/', listProducts);
productRouter.get('/:id', getProduct);
productRouter.post('/', requireAuth, requireProductManager, createProduct);
