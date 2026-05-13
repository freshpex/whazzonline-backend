import { Router } from 'express';
import { requireAuth } from '../../../../shared/middleware/require-auth.js';
import { requireAdmin } from '../../../../shared/middleware/require-admin.js';
import { createUserHandler, loginHandler, meHandler, signupHandler } from '../controllers/auth.controller.js';

export const authRouter = Router();
authRouter.post('/signup', signupHandler);
authRouter.post('/login', loginHandler);
authRouter.get('/me', requireAuth, meHandler);
authRouter.post('/users', requireAuth, requireAdmin, createUserHandler);
