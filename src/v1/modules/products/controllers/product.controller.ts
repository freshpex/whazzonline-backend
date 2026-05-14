import type { RequestHandler } from 'express';
import { HttpError } from '../../../../shared/errors/http-error.js';
import { productService } from '../services/product.service.js';
import { createProductSchema, createReviewSchema, listProductsQuerySchema } from '../validators/product.validator.js';

export const listProducts: RequestHandler = async (req, res, next) => {
  try {
    const parsed = listProductsQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return next(new HttpError(400, parsed.error.errors[0]?.message ?? 'Please check your product filters and try again.'));
    }

    const products = await productService.list(parsed.data);
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

export const listProductCategories: RequestHandler = async (_req, res, next) => {
  try {
    const categories = await productService.listCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

export const listProductReviews: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) return next(new HttpError(404, 'We could not find that product.'));

    const reviews = await productService.getReviews(id);
    res.json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

export const createProductReview: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return next(new HttpError(401, 'Please log in to continue.'));
    }

    const id = req.params.id;
    if (!id) return next(new HttpError(404, 'We could not find that product.'));

    const parsed = createReviewSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new HttpError(400, parsed.error.errors[0]?.message ?? 'Please check your review and try again.'));
    }

    const review = await productService.createReview(id, req.user.id, parsed.data);
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};
