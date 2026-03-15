"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markTaskFixed = exports.getAssignedTasks = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Get tasks for the worker
const getAssignedTasks = async (req, res) => {
    try {
        // For phase 4 simplicity, we show AGENT path reports that are ROUTED or IN_PROGRESS
        const tasks = await prisma.report.findMany({
            where: {
                workflowPath: 'AGENT',
                status: { in: ['ROUTED', 'IN_PROGRESS'] }
            },
            include: {
                images: {
                    select: { imageUrl: true, isPrimary: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ tasks });
    }
    catch (error) {
        console.error("Error fetching worker tasks:", error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};
exports.getAssignedTasks = getAssignedTasks;
// Update task to FIXED
const markTaskFixed = async (req, res) => {
    try {
        const { reportId, resolutionNotes } = req.body;
        // Assume req.files contains the completion photo from multer
        const files = req.files;
        const completionImageUrl = files && files.length > 0 ? files[0].path : null;
        const updateData = {
            status: 'FIXED'
            // We omit resolutionNotes as the schema doesn't have a 'resolution' field
        };
        if (completionImageUrl) {
            updateData.images = {
                create: {
                    imageUrl: completionImageUrl,
                    isPrimary: false,
                    aiValidated: true
                }
            };
        }
        const updatedReport = await prisma.report.update({
            where: { id: reportId },
            data: updateData,
            include: { images: true }
        });
        res.status(200).json({ message: 'Task marked as fixed', report: updatedReport });
    }
    catch (error) {
        console.error("Error marking task as fixed:", error);
        res.status(500).json({ error: 'Failed to update task' });
    }
};
exports.markTaskFixed = markTaskFixed;
//# sourceMappingURL=worker.controller.js.map