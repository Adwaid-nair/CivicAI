"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicReports = exports.getMyReports = exports.submitReport = void 0;
const client_1 = require("@prisma/client");
const ai_service_1 = require("../services/ai.service");
const routing_service_1 = require("../services/routing.service");
const imagekit_1 = __importDefault(require("imagekit"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const imagekit = new imagekit_1.default({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || ''
});
// Helper to generate tracking ID (e.g., CIV-1234-ABC)
const generateTrackingId = () => {
    const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase(); // 3 characters
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4 numbers
    return `CIV-${randomNum}-${randomStr}`; // 12 chars max
};
const submitReport = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { category, description, contactInfo, lat, lng, } = req.body;
        if (lat === undefined || lng === undefined) {
            res.status(400).json({ error: 'Location (lat, lng) is required.' });
            return;
        }
        const files = req.files;
        if (!files || files.length === 0) {
            res.status(400).json({ error: 'At least one image is required.' });
            return;
        }
        // Upload buffers to ImageKit
        const uploadPromises = files.map(file => {
            return imagekit.upload({
                file: file.buffer, // upload directly from memory buffer
                fileName: file.originalname || 'evidence.jpg',
                folder: '/civicai_reports'
            });
        });
        const uploadResults = await Promise.all(uploadPromises);
        const imageUrls = uploadResults.map(result => result.url);
        // Run AI validation
        let aiResult;
        try {
            aiResult = await (0, ai_service_1.analyzeInfrastructureImage)(imageUrls, description, category);
        }
        catch (error) {
            console.error("AI pipeline failed:", error);
            res.status(500).json({ error: 'AI analysis failed. Please try again later.' });
            return;
        }
        if (!aiResult.isValid) {
            res.status(400).json({
                error: 'Image rejected by AI validation.',
                reason: aiResult.rejectionReason || 'The image does not appear to show a valid infrastructure issue.'
            });
            return;
        }
        const trackingId = generateTrackingId();
        const createdData = {
            trackingId,
            userId,
            category: aiResult.category || category,
            description: userId === undefined && contactInfo ? `${description}\n[Guest Contact: ${contactInfo}]` : description,
            inputMethod: 'camera',
            severity: aiResult.severity,
            estimatedCostMin: aiResult.estimatedCostMin,
            estimatedCostMax: aiResult.estimatedCostMax,
            status: 'SUBMITTED',
            lat: Number(lat),
            lng: Number(lng),
            aiAnalysis: JSON.parse(JSON.stringify(aiResult)), // Ensure it's valid JSON
            aiConfidence: 95.0, // Mock confidence for now
            images: {
                create: imageUrls.map((url, index) => ({
                    imageUrl: url,
                    isPrimary: index === 0,
                    aiValidated: true
                }))
            }
        };
        console.log("PAYLOAD TO PRISMA:", JSON.stringify(createdData, null, 2));
        const report = await prisma.report.create({
            data: createdData,
            include: {
                images: true
            }
        });
        // Trigger Smart Routing and Agent Path in the background (fire and forget)
        (0, routing_service_1.routeReport)(report.id).catch(err => console.error("Router error:", err));
        res.status(201).json({
            message: 'Report submitted successfully',
            trackingId: report.trackingId,
            reportId: report.id,
            aiAnalysis: aiResult
        });
    }
    catch (error) {
        console.error("Error submitting report:", error.message || error);
        res.status(500).json({ error: 'Failed to submit report', details: error.message || String(error) });
    }
};
exports.submitReport = submitReport;
const getMyReports = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        const reports = await prisma.report.findMany({
            where: { userId: req.user.userId },
            orderBy: { createdAt: 'desc' },
            include: { images: true }
        });
        res.json({ reports });
    }
    catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
};
exports.getMyReports = getMyReports;
const getPublicReports = async (req, res) => {
    try {
        // fetch top level recent reports for dashboard
        const reports = await prisma.report.findMany({
            take: 50,
            orderBy: { createdAt: 'desc' },
            include: { images: true }
        });
        res.json({ reports });
    }
    catch (error) {
        console.error("Error fetching public reports:", error);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
};
exports.getPublicReports = getPublicReports;
//# sourceMappingURL=report.controller.js.map