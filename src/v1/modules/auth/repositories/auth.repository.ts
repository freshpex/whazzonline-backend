import { pool } from '../../../../shared/db/pool.js';
import type { User, UserWithPassword, UserRole } from '../types/auth.types.js';

const baseSelect = `
  SELECT
    id,
    email,
    phone,
    role,
    password_hash AS "passwordHash",
    created_at AS "createdAt"
  FROM users
`;

export async function findUserByEmail(email: string): Promise<UserWithPassword | null> {
  const { rows } = await pool.query<UserWithPassword>(
    `${baseSelect} WHERE email = $1`,
    [email]
  );
  return rows[0] ?? null;
}

export async function findUserByPhone(phone: string): Promise<UserWithPassword | null> {
  const { rows } = await pool.query<UserWithPassword>(
    `${baseSelect} WHERE phone = $1`,
    [phone]
  );
  return rows[0] ?? null;
}

export async function createUser(params: {
  email?: string;
  phone?: string;
  passwordHash: string;
  role: UserRole;
}): Promise<User> {
  const { rows } = await pool.query<User>(
    `
      INSERT INTO users (email, phone, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING
        id,
        email,
        phone,
        role,
        created_at AS "createdAt"
    `,
    [params.email ?? null, params.phone ?? null, params.passwordHash, params.role]
  );

  const created = rows[0];
  if (!created) {
    throw new Error('Failed to create user');
  }

  return created;
}
