import 'dotenv/config';
import { z } from 'zod';

const baseEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  CLIENT_ORIGIN: z.string().min(1).default('http://localhost:5173'),
  JWT_SECRET: z.string().min(24).optional(),
  JWT_EXPIRES_IN: z.string().min(1).default('7d'),
  DATABASE_URL: z.string().min(1).optional()
});

const parsed = baseEnvSchema.parse(process.env);
const testFallbacks =
  parsed.NODE_ENV === 'test'
    ? {
        JWT_SECRET: 'test-jwt-secret-value-minimum-24-characters',
        DATABASE_URL: 'postgres://postgres:postgres@localhost:5432/postgres'
      }
    : {};

const strictEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.number(),
  CLIENT_ORIGIN: z.string().min(1),
  JWT_SECRET: z.string().min(24),
  JWT_EXPIRES_IN: z.string().min(1),
  DATABASE_URL: z.string().min(1)
});

export const env = strictEnvSchema.parse({
  ...parsed,
  ...testFallbacks
});
