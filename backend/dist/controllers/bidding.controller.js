"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptBid = exports.submitBid = exports.getAvailableBids = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Get available reports open for bidding
const getAvailableBids = async (req, res) => {
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
    }
    catch (error) {
        console.error("Error fetching available bids:", error);
        res.status(500).json({ error: 'Failed to fetch available bids' });
    }
};
exports.getAvailableBids = getAvailableBids;
// Submit a bid (Contractor only)
const submitBid = async (req, res) => {
    try {
        const contractorId = req.user?.userId;
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
    }
    catch (error) {
        console.error("Error submitting bid:", error);
        res.status(500).json({ error: 'Failed to submit bid' });
    }
};
exports.submitBid = submitBid;
// Accept a bid (Authority/Admin only)
const acceptBid = async (req, res) => {
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
    }
    catch (error) {
        console.error("Error accepting bid:", error);
        res.status(500).json({ error: 'Failed to accept bid' });
    }
};
exports.acceptBid = acceptBid;
//# sourceMappingURL=bidding.controller.js.map