export type UserRole = 'admin' | 'member' | 'viewer';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  name: string;
  role?: UserRole;
  tenantId: string;
}

export interface UpdateUserInput {
  name?: string;
  avatarUrl?: string;
  role?: UserRole;
}
