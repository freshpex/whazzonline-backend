import type { RequestHandler } from 'express';
import { HttpError } from '../../../../shared/errors/http-error.js';
import { productService } from '../services/product.service.js';
import { createProductSchema } from '../validators/product.validator.js';

export const listProducts: RequestHandler = async (req, res, next) => {
  try {
    const query = typeof req.query.q === 'string' ? req.query.q : undefined;
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const products = await productService.list(query, category);
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

export const getProduct: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) return next(new HttpError(404, 'We could not find that product.'));

    const product = await productService.findById(id);
    if (!product) return next(new HttpError(404, 'We could not find that product.'));
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const createProduct: RequestHandler = async (req, res, next) => {
  try {
    const parsed = createProductSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new HttpError(400, parsed.error.errors[0]?.message ?? 'Please check the product details and try again.'));
    }

    const product = await productService.create(parsed.data);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};
