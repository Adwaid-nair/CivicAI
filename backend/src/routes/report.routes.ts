import { Router } from 'express';
import { submitReport, getMyReports, getPublicReports } from '../controllers/report.controller';
import { authenticate, optionalAuth } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Public / Guest Routes
router.post('/submit', optionalAuth, upload.array('images', 10), submitReport);
router.get('/public', getPublicReports);

// Authenticated Routes
router.get('/my-reports', authenticate, getMyReports);

export default router;
