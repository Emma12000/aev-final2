import { Role } from '../enums/role.enum';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  passwordChangedAt: string | null;
}

export interface CreateUserPayload {
  email: string;
  fullName: string;
  role: Role;
}

export interface UpdateUserPayload {
  fullName?: string;
  role?: Role;
  isActive?: boolean;
}
