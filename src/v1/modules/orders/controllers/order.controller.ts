import type { RequestHandler } from 'express';
import { HttpError } from '../../../../shared/errors/http-error.js';
import { orderService } from '../services/order.service.js';
import { checkoutSchema } from '../validators/order.validator.js';

export const checkoutHandler: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return next(new HttpError(401, 'Please log in to continue.'));
    }

    const parsed = checkoutSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new HttpError(400, parsed.error.errors[0]?.message ?? 'Please check your checkout details and try again.'));
    }

    const result = await orderService.checkout(req.user.id, parsed.data);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
