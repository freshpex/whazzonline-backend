export type UserRole = 'customer' | 'vendor' | 'admin';

export type User = {
  id: string;
  email: string | null;
  phone: string | null;
  role: UserRole;
  createdAt: string;
};

export type UserWithPassword = User & {
  passwordHash: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};
