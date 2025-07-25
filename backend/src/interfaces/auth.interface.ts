import { Request } from 'express';
import { User } from '@prisma/client';

export interface TokenPayload {
  id: number;
}

export interface RequestWithUser extends Request {
  user?: User;
  userId?: number;
  token?: string;
} 