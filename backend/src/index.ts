import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import reportRoutes from './routes/report.routes';
import dashboardRoutes from './routes/dashboard.routes';
import biddingRoutes from './routes/bidding.routes';
import workerRoutes from './routes/worker.routes';
import assistantRoutes from './routes/assistant.routes';

dotenv.config();

const app = express();

import path from 'path';

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const PORT = process.env.PORT || 5000;

app.get('/health', (req, res) => {
    res.json({ status: 'ok', datetime: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/bids', biddingRoutes);
app.use('/api/worker', workerRoutes);
app.use('/api/assistant', assistantRoutes);

app.listen(PORT, () => {
    console.log(`CivicAI Backend listening on port ${PORT}`);
});

export default app;
