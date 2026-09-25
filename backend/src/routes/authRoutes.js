import express from 'express';
import { register, login, logout, getMe } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validateRegister, validateLogin } from '../validators/index.js';

const router = express.Router();

router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);

export default router;
