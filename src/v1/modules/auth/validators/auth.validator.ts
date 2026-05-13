import { z } from 'zod';

const optionalEmail = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.string().email().optional()
);

const optionalPhone = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.string().min(7, 'Phone number is too short.').optional()
);

export const signupSchema = z
  .object({
    email: optionalEmail,
    phone: optionalPhone,
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    role: z.enum(['customer', 'vendor']).optional()
  })
  .refine((data) => data.email || data.phone, {
    message: 'Email or phone number is required.',
    path: ['email']
  });

export const loginSchema = z
  .object({
    email: optionalEmail,
    phone: optionalPhone,
    password: z.string().min(1, 'Password is required.')
  })
  .refine((data) => data.email || data.phone, {
    message: 'Email or phone number is required.',
    path: ['email']
  });

export const createUserSchema = z
  .object({
    email: optionalEmail,
    phone: optionalPhone,
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    role: z.enum(['customer', 'vendor', 'admin']).default('vendor')
  })
  .refine((data) => data.email || data.phone, {
    message: 'Email or phone number is required.',
    path: ['email']
  });

export type SignupPayload = z.infer<typeof signupSchema>;
export type LoginPayload = z.infer<typeof loginSchema>;
export type CreateUserPayload = z.infer<typeof createUserSchema>;
