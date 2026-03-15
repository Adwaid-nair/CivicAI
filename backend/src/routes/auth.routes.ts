import { Router } from 'express';
import { register, login, getMe, googleAuth } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);

// Protected routes
router.get('/me', authenticate, getMe);

export default router;
