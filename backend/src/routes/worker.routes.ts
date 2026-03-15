import express from 'express';
import { getAssignedTasks, markTaskFixed } from '../controllers/worker.controller';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = express.Router();

router.get('/tasks', authenticate, getAssignedTasks);
router.post('/fix', authenticate, upload.array('images', 1), markTaskFixed);

export default router;
