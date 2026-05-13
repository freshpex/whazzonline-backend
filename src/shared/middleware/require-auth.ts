import type { RequestHandler } from 'express';
import { HttpError } from '../errors/http-error.js';
import { verifyToken } from '../auth/jwt.js';

export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.header('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;

  if (!token) {
    return next(new HttpError(401, 'Please log in to continue.'));
  }

  try {
    const payload = verifyToken(token);
    req.user = {
      id: payload.sub,
      role: payload.role,
      email: payload.email ?? undefined,
      phone: payload.phone ?? undefined
    };
    return next();
  } catch {
    return next(new HttpError(401, 'Your session has expired. Please log in again.'));
  }
};
