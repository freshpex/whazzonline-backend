import jwt from 'jsonwebtoken';
import type { Secret, SignOptions } from 'jsonwebtoken';

import { env } from '../config/env.js';
import type { UserRole } from '../../v1/modules/auth/types/auth.types.js';

const { sign, verify } = jwt;

export type AuthTokenPayload = {
  sub: string;
  role: UserRole;
  email?: string | null;
  phone?: string | null;
};

export function signToken(payload: AuthTokenPayload) {
  const secret: Secret = env.JWT_SECRET;
  const expiresIn = env.JWT_EXPIRES_IN as SignOptions['expiresIn'];

  return sign(payload, secret, { expiresIn });
}

export function verifyToken(token: string) {
  return verify(token, env.JWT_SECRET) as AuthTokenPayload;
}