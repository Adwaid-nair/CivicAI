import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get available reports open for bidding
export const getAvailableBids = async (req: Request, res: Response): Promise<void> => {
    try {
        const reports = await prisma.report.findMany({
            where: {
                workflowPath: 'BIDDING',
                status: 'ROUTED'
            },
            include: {
                images: {
                    select: { imageUrl: true, isPrimary: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({ reports });
    } catch (error) {
        console.error("Error fetching available bids:", error);
        res.status(500).json({ error: 'Failed to fetch available bids' });
    }
};

// Submit a bid (Contractor only)
export const submitBid = async (req: Request, res: Response): Promise<void> => {
    try {
        const contractorId = (req as any).user?.userId;
        const { reportId, amount, timelineDays, proposal } = req.body;

        if (!contractorId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const bid = await prisma.bid.create({
            data: {
                reportId,
                contractorId,
                amount,
                timelineDays,
                proposal
            }
        });

        res.status(201).json({ message: 'Bid submitted successfully', bid });
    } catch (error) {
        console.error("Error submitting bid:", error);
        res.status(500).json({ error: 'Failed to submit bid' });
    }
};

// Accept a bid (Authority/Admin only)
export const acceptBid = async (req: Request, res: Response): Promise<void> => {
    try {
        const { bidId } = req.body;

        const bid = await prisma.bid.findUnique({ where: { id: bidId } });
        if (!bid) {
            res.status(404).json({ error: 'Bid not found' });
            return;
        }

        // Accept this bid, reject others
        await prisma.$transaction([
            prisma.bid.update({
                where: { id: bidId },
                data: { status: 'ACCEPTED' }
            }),
            prisma.bid.updateMany({
                where: { reportId: bid.reportId, id: { not: bidId } },
                data: { status: 'REJECTED' }
            }),
            prisma.report.update({
                where: { id: bid.reportId },
                data: { status: 'IN_PROGRESS' } // Move report to in progress
            })
        ]);

        res.status(200).json({ message: 'Bid accepted successfully' });
    } catch (error) {
        console.error("Error accepting bid:", error);
        res.status(500).json({ error: 'Failed to accept bid' });
    }
};
