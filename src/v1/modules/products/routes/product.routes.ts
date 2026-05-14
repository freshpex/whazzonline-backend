import { Router } from 'express';
import { requireAuth } from '../../../../shared/middleware/require-auth.js';
import { requireProductManager } from '../../../../shared/middleware/require-product-manager.js';
import {
  createProduct,
  createProductReview,
  getProduct,
  listProductCategories,
  listProductReviews,
  listProducts
} from '../controllers/product.controller.js';

export const productRouter = Router();
productRouter.get('/', listProducts);
productRouter.get('/categories', listProductCategories);
productRouter.get('/:id', getProduct);
productRouter.post('/', requireAuth, requireProductManager, createProduct);
productRouter.get('/:id/reviews', listProductReviews);
productRouter.post('/:id/reviews', requireAuth, createProductReview);
