import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get tasks for the worker
export const getAssignedTasks = async (req: Request, res: Response): Promise<void> => {
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
    } catch (error) {
        console.error("Error fetching worker tasks:", error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};

// Update task to FIXED
export const markTaskFixed = async (req: Request, res: Response): Promise<void> => {
    try {
        const { reportId, resolutionNotes } = req.body;
        
        // Assume req.files contains the completion photo from multer
        const files = req.files as Express.Multer.File[];
        const completionImageUrl = files && files.length > 0 ? files[0].path : null;

        const updateData: any = {
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
    } catch (error) {
        console.error("Error marking task as fixed:", error);
        res.status(500).json({ error: 'Failed to update task' });
    }
};
