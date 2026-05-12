import type { RequestHandler } from 'express';
import { HttpError } from '../../../../shared/errors/http-error.js';
import { productService } from '../services/product.service.js';

export const listProducts: RequestHandler = (req, res) => {
  const query = typeof req.query.q === 'string' ? req.query.q : undefined;
  const category = typeof req.query.category === 'string' ? req.query.category : undefined;
  res.json({ success: true, data: productService.list(query, category) });
};

export const getProduct: RequestHandler = (req, res, next) => {
  const product = productService.findById(req.params.id);
  if (!product) return next(new HttpError(404, 'Product not found'));
  res.json({ success: true, data: product });
};
