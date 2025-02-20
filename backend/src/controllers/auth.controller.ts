import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user.service';
import jwt from 'jsonwebtoken';
import { HttpException } from '../exceptions/HttpException';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import config from '../config';

const prisma = new PrismaClient();

class AuthController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password, username } = req.body;
      const user = await this.userService.createUser(email, password, username);
      res.status(201).json({ user });
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userInfo, password } = req.body;

      if (!userInfo || !password) {
        throw new HttpException(400, 'Email or username and password must be provided');
      }

      console.log(`Login attempt with email: ${userInfo}`);

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

      console.log(`Stored hashed password: ${user.password}`);
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log(`Password valid: ${isPasswordValid}`);
      if (!isPasswordValid) {
        console.log('Invalid password');
        throw new HttpException(401, 'Invalid credentials');
      }

      const userRoles = await this.userService.getUserRoles(user.id);
      const token = jwt.sign(
        { 
          id: user.id,
          roles: userRoles.map(role => role.name)
        }, 
        config.jwtSecret, 
        { expiresIn: '1h' }
      );
      res.status(200).json({ token })
    } catch (error) {
      console.log(`Login error: ${error.message}`);
      next(new HttpException(400, error.message));
    }
  };

  public forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const token = crypto.randomBytes(32).toString('hex');
      const hashedToken = await bcrypt.hash(token, 10);

      await prisma.user.update({
        where: { email },
        data: { resetPasswordToken: hashedToken, resetPasswordExpires: new Date(Date.now() + 3600000) },
      });

      const transporter = nodemailer.createTransport({
        service: config.email.service,
        auth: {
          user: config.email.user,
          pass: config.email.password,
        },
      });

      const mailOptions = {
        to: email,
        from: email.user,
        subject: 'Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          http://${config.frontendHost}/reset/${token}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
      next(new HttpException(500, 'Internal server error'));
    }
  };

  public resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { token, newPassword } = req.body;

    try {
      const user = await prisma.user.findFirst({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: {
            gt: new Date(),
          },
        },
      });

      if (!user) {
        res.status(400).json({ message: 'Invalid or expired token' });
        return;
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
      next(new HttpException(500, 'Internal server error'));
    }
  };

  public confirmEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { token } = req.params;

    try {
      const user = await prisma.user.findFirst({
        where: {
          emailVerificationToken: token,
          emailVerified: false,
        },
      });

      if (!user) {
        res.status(400).json({ message: 'Invalid or expired token' });
        return;
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          emailVerificationToken: null,
        },
      });

      res.status(200).json({ message: 'Email confirmed successfully' });
    } catch (error) {
      next(new HttpException(500, 'Internal server error'));
    }
  };
}

export default AuthController;