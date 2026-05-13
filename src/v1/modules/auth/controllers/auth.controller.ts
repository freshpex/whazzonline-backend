import type { RequestHandler } from 'express';
import { HttpError } from '../../../../shared/errors/http-error.js';
import { createUserSchema, loginSchema, signupSchema } from '../validators/auth.validator.js';
import { createUserForAdmin, login, signup } from '../services/auth.service.js';

export const signupHandler: RequestHandler = async (req, res, next) => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new HttpError(400, parsed.error.errors[0]?.message ?? 'Please check your signup details and try again.'));
    }

    const result = await signup(parsed.data);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const loginHandler: RequestHandler = async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new HttpError(400, parsed.error.errors[0]?.message ?? 'Please check your login details and try again.'));
    }

    const result = await login(parsed.data);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const meHandler: RequestHandler = (req, res) => {
  res.json({
    success: true,
    data: req.user ?? null
  });
};

export const createUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const parsed = createUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new HttpError(400, parsed.error.errors[0]?.message ?? 'Please check the user details and try again.'));
    }

    const user = await createUserForAdmin(parsed.data);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
