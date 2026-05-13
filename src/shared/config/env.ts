import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  CLIENT_ORIGIN: z.string().min(1).default('http://localhost:5173'),
  JWT_SECRET: z.string().min(24),
  JWT_EXPIRES_IN: z.string().min(1).default('7d'),
  DATABASE_URL: z.string().min(1)
});

export const env = envSchema.parse(process.env);
