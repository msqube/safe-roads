export type UserRole = 'Super Admin' | 'Drone Operations Pilot' | 'NSV Highway Inspector' | 'Municipal Repair Officer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  badgeId: string;
  department: string;
  organization: string;
  avatarUrl?: string;
  lastLogin?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: string;
}

