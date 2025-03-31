import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user.service';
import EmailService from '../services/email.service';
import jwt from 'jsonwebtoken';
import { HttpException } from '../exceptions/HttpException';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import config from '../config';
import { JwtPayload } from 'jsonwebtoken';

const prisma = new PrismaClient();

// Define interfaces for better type safety
interface TokenPayload extends JwtPayload {
  id: number;
  roles?: string[];
}

class AuthController {
  private userService: UserService;
  private emailService: EmailService;

  constructor() {
    this.userService = new UserService();
    this.emailService = new EmailService();
  }

  /**
   * Verify a user's token and return their information
   */
  public verify = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.header('Authorization')?.split('Bearer ')[1];
      
      if (!token) {
        throw new HttpException(401, 'No token provided');
      }

      const decoded = jwt.verify(token, config.jwtSecret) as TokenPayload;
      const user = await this.userService.findUserById(decoded.id);

      if (!user) {
        throw new HttpException(401, 'User not found');
      }

      if (!user.verified || !user.emailVerified) {
        throw new HttpException(401, 'User account is not verified');
      }

      const userRoles = await this.userService.getUserRoles(user.id);
      
      res.status(200).json({
        userId: user.id,
        roles: userRoles,
        verified: true
      });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        next(new HttpException(401, 'Invalid token'));
      } else if (error instanceof HttpException) {
        next(error);
      } else {
        next(new HttpException(500, error.message));
      }
    }
  };

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password, username } = req.body;
      const user = await this.userService.createUser(email, password, username);
      res.status(201).json({ user });
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };

  /**
   * Login a user and return a JWT token
   */
  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userInfo, password } = req.body;

      if (!userInfo || !password) {
        throw new HttpException(400, 'Email or username and password must be provided');
      }

      console.log(`Login attempt with userInfo: ${userInfo}`);

      const user = await this.userService.findUserByEmailUsername(userInfo);
      if (!user) {
        console.log('User not found');
        throw new HttpException(401, 'Invalid credentials');
      }

      if (!user.emailVerified) {
        throw new HttpException(401, 'Please verify your email before logging in');
      }

      if (!user.verified) {
        throw new HttpException(401, 'Your account is pending verification');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log('Invalid password');
        throw new HttpException(401, 'Invalid credentials');
      }

      const userRoles = await this.userService.getUserRoles(user.id);
      const { rememberMe } = req.body;
      const expiresIn = rememberMe ? '365d' : '1d';
      
      const token = jwt.sign(
        { 
          id: user.id,
          roles: userRoles
        }, 
        config.jwtSecret, 
        { expiresIn }
      );

      // Set cookie
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: config.cookieExpiresIn,
        sameSite: 'strict'
      });

      res.status(200).json({ 
        success: true,
        token, // Still send token for clients that prefer token-based auth
        user: {
          id: user.id,
        }
      });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
      } else {
        console.log(`Login error: ${error.message}`);
        next(new HttpException(400, error.message));
      }
    }
  };

  /**
   * Send a password reset email
   */
  public forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email } = req.body;

    try {
      if (!email) {
        throw new HttpException(400, 'Email is required');
      }

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        // For security reasons, don't reveal if the user exists or not
        res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent' });
        return;
      }

      const token = crypto.randomBytes(32).toString('hex');
      const hashedToken = await bcrypt.hash(token, 10);

      await prisma.user.update({
        where: { email },
        data: { 
          resetPasswordToken: hashedToken, 
          resetPasswordExpires: new Date(Date.now() + 3600000) // 1 hour
        },
      });

      const emailSent = await this.emailService.sendPasswordResetEmail(email, token);

      if (!emailSent) {
        console.warn(`Failed to send password reset email to ${email}`);
      }

      res.status(200).json({ 
        message: 'If a user with that email exists, a password reset link has been sent' 
      });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
      } else {
        console.error('Password reset error:', error);
        next(new HttpException(500, 'Internal server error'));
      }
    }
  };

  /**
   * Reset a user's password using a token
   */
  public resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { token, newPassword } = req.body;

    try {
      if (!token || !newPassword) {
        throw new HttpException(400, 'Token and new password are required');
      }

      // Validate password strength
      if (newPassword.length < 8) {
        throw new HttpException(400, 'Password must be at least 8 characters long');
      }

      const user = await prisma.user.findFirst({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: {
            gt: new Date(),
          },
        },
      });

      if (!user) {
        throw new HttpException(400, 'Invalid or expired token');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpires: null,
        },
      });

      res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
      } else {
        console.error('Password reset error:', error);
        next(new HttpException(500, 'Internal server error'));
      }
    }
  };

  /**
   * Confirm a user's email address using a token
   */
  public confirmEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { token } = req.params;

    try {
      if (!token) {
        throw new HttpException(400, 'Verification token is required');
      }

      const user = await prisma.user.findFirst({
        where: {
          emailVerificationToken: token,
          emailVerified: false,
        },
      });

      if (!user) {
        throw new HttpException(400, 'Invalid or expired token');
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          emailVerificationToken: null,
          verified: true, // Also mark the user as verified
        },
      });

      res.status(200).json({ message: 'Email confirmed successfully' });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
      } else {
        console.error('Email confirmation error:', error);
        next(new HttpException(500, 'Internal server error'));
      }
    }
  };

  /**
   * Resend verification email to a user
   */
  public resendVerificationEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email } = req.body;

    try {
      if (!email) {
        throw new HttpException(400, 'Email is required');
      }

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        // For security reasons, don't reveal if the user exists or not
        res.status(200).json({ message: 'If a user with that email exists, a verification email has been sent' });
        return;
      }

      if (user.emailVerified) {
        throw new HttpException(400, 'Email is already verified');
      }

      const emailToken = crypto.randomBytes(32).toString('hex');
      const hashedEmailToken = await bcrypt.hash(emailToken, 10);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerificationToken: hashedEmailToken,
        },
      });

      const emailSent = await this.emailService.sendVerificationEmail(email, emailToken);

      if (!emailSent) {
        console.warn(`Failed to send verification email to ${email}`);
      }

      res.status(200).json({ 
        message: 'If a user with that email exists, a verification email has been sent' 
      });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
      } else {
        console.error('Resend verification email error:', error);
        next(new HttpException(500, 'Internal server error'));
      }
    }
  };
}

export default AuthController;