import type { RequestHandler } from 'express';
import { HttpError } from '../errors/http-error.js';

export const requireProductManager: RequestHandler = (req, _res, next) => {
  if (!req.user) {
    return next(new HttpError(401, 'Please log in to continue.'));
  }

  if (req.user.role !== 'admin' && req.user.role !== 'vendor') {
    return next(new HttpError(403, 'Only admins and vendors can add products.'));
  }

  return next();
};
