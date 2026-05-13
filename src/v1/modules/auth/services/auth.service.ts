import bcrypt from 'bcryptjs';
import { HttpError } from '../../../../shared/errors/http-error.js';
import { signToken } from '../../../../shared/auth/jwt.js';
import { createUser, findUserByEmail, findUserByPhone } from '../repositories/auth.repository.js';
import type { AuthResponse, UserRole } from '../types/auth.types.js';
import type { CreateUserPayload, LoginPayload, SignupPayload } from '../validators/auth.validator.js';

function normalizeEmail(email?: string) {
  return email?.trim().toLowerCase();
}

function normalizePhone(phone?: string) {
  return phone?.trim();
}

async function createAccount(payload: {
  email?: string;
  phone?: string;
  password: string;
  role: UserRole;
}) {
  const email = normalizeEmail(payload.email);
  const phone = normalizePhone(payload.phone);

  if (!email && !phone) {
    throw new HttpError(400, 'Please enter an email address or phone number.');
  }

  if (email) {
    const existing = await findUserByEmail(email);
    if (existing) throw new HttpError(409, 'That email is already connected to an account.');
  }

  if (phone) {
    const existing = await findUserByPhone(phone);
    if (existing) throw new HttpError(409, 'That phone number is already connected to an account.');
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);

  return createUser({ email, phone, passwordHash, role: payload.role });
}

export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  const user = await createAccount({
    email: payload.email,
    phone: payload.phone,
    password: payload.password,
    role: payload.role ?? 'customer'
  });
  const token = signToken({
    sub: user.id,
    role: user.role,
    email: user.email,
    phone: user.phone
  });

  return { user, token };
}

export async function createUserForAdmin(payload: CreateUserPayload) {
  return createAccount({
    email: payload.email,
    phone: payload.phone,
    password: payload.password,
    role: payload.role
  });
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const email = normalizeEmail(payload.email);
  const phone = normalizePhone(payload.phone);

  let user = null;
  if (email) user = await findUserByEmail(email);
  if (!user && phone) user = await findUserByPhone(phone);

  if (!user) {
    throw new HttpError(401, 'We could not find an account with those details.');
  }

  const isValid = await bcrypt.compare(payload.password, user.passwordHash);
  if (!isValid) {
    throw new HttpError(401, 'The password you entered is incorrect.');
  }

  const token = signToken({
    sub: user.id,
    role: user.role,
    email: user.email,
    phone: user.phone
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt
    },
    token
  };
}
