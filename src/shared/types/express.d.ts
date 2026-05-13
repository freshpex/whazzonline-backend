import type { UserRole } from '../../v1/modules/auth/types/auth.types.js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
        email?: string;
        phone?: string;
      };
    }
  }
}

export {};
