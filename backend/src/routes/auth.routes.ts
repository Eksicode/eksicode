import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import authLimiter from '../middleware/rateLimiter';

const router = Router();
const authController = new AuthController();

router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/forgot-password', authLimiter, authController.forgotPassword);
router.post('/reset-password', authLimiter, authController.resetPassword);
router.get('/confirm-email/:token', authLimiter, authController.confirmEmail);

export default router;
