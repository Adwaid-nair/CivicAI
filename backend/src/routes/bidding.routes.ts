import express from 'express';
import { getAvailableBids, submitBid, acceptBid } from '../controllers/bidding.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Fetch open bids (could be public or contractor only, keeping public for visibility)
router.get('/available', getAvailableBids);

// Contractor actions require auth
router.post('/submit', authenticate, submitBid);

// Authority actions require auth (ideally role check middleware here)
router.post('/accept', authenticate, acceptBid);

export default router;
