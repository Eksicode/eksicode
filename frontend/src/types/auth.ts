export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  permissions: string[];
  profilePicture?: string;
  verified?: boolean;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

export type UserRole = 'user';

export const ROLES = {
  USER: 'user'
} as const;

export const PERMISSIONS = {
  CREATE_POST: 'CREATE_POST',
  DELETE_POST: 'DELETE_POST',
  VIEW_USERS: 'VIEW_USERS',
  VIEW_USER: 'VIEW_USER',
  CREATE_USER: 'CREATE_USER',
  UPDATE_USER: 'UPDATE_USER',
  DELETE_USER: 'DELETE_USER'
} as const;