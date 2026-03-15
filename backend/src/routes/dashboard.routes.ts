import express from 'express';
import { getDashboardMetrics, getPublicIssues, trackTicket, getFilterOptions } from '../controllers/dashboard.controller';

const router = express.Router();

// All dashboard routes are public
router.get('/metrics', getDashboardMetrics);
router.get('/filter-options', getFilterOptions);
router.get('/issues', getPublicIssues);
router.get('/track/:trackingId', trackTicket);

export default router;
