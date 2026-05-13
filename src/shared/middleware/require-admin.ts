import type { RequestHandler } from 'express';
import { HttpError } from '../errors/http-error.js';

export const requireAdmin: RequestHandler = (req, _res, next) => {
  if (!req.user) {
    return next(new HttpError(401, 'Please log in to continue.'));
  }

  if (req.user.role !== 'admin') {
    return next(new HttpError(403, 'Only admins can do that.'));
  }

  return next();
};
