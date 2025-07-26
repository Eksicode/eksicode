import { Request } from 'express';
import { User } from '@prisma/client';

export interface TokenPayload {
  id: number;
  email: string;
}

export interface RequestWithUser extends Request {
  user?: User;
  userId?: number;
  token?: string;
}

export interface LoginRequest {
  userInfo: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: number;
    email: string;
    username: string;
    firstName?: string | null;
    lastName?: string | null;
    verified: boolean;
    emailVerified: boolean;
    lastLoginAt: Date | null;
  };
}

export interface EmailVerificationResponse {
  success: boolean;
  message: string;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
} 