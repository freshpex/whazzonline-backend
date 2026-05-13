import { Pool } from 'pg';
import { env } from '../config/env.js';

const shouldUseSsl = env.DATABASE_URL.includes('sslmode=require') || env.NODE_ENV === 'production';

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: shouldUseSsl ? { rejectUnauthorized: false } : undefined
});
