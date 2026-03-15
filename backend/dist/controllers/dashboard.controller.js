"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackTicket = exports.getPublicIssues = exports.getFilterOptions = exports.getDashboardMetrics = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const normalizeImageUrl = (url) => {
    if (!url)
        return url;
    if (url.startsWith('http'))
        return url;
    // For absolute local paths, extract just the filename
    const filename = url.split(/[/\\]/).pop();
    // Assuming backend runs on localhost:5000 in dev
    return `http://localhost:5000/uploads/${filename}`;
};
// Get public dashboard metrics
const getDashboardMetrics = async (req, res) => {
    try {
        const { state, district, category, severity } = req.query;
        const whereClause = {};
        if (state)
            whereClause.state = state;
        if (district)
            whereClause.district = district;
        if (category)
            whereClause.category = category;
        if (severity)
            whereClause.severity = severity;
        const totalReports = await prisma.report.count({ where: whereClause });
        const pendingReports = await prisma.report.count({
            where: { ...whereClause, status: { in: ['SUBMITTED', 'ROUTED', 'IN_PROGRESS'] } }
        });
        const fixedReports = await prisma.report.count({
            where: { ...whereClause, status: { in: ['FIXED', 'CLOSED'] } }
        });
        // Get category breakdown
        const categoryGroups = await prisma.report.groupBy({
            by: ['category'],
            where: whereClause,
            _count: {
                _all: true
            }
        });
        const categoryBreakdown = categoryGroups.map(group => ({
            name: group.category || 'Unknown',
            value: group._count._all
        }));
        res.status(200).json({
            metrics: {
                totalReports,
                pendingReports,
                fixedReports,
                categoryBreakdown
            }
        });
    }
    catch (error) {
        console.error("Error fetching dashboard metrics:", error);
        res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
    }
};
exports.getDashboardMetrics = getDashboardMetrics;
// Get distinct filter options
const getFilterOptions = async (req, res) => {
    try {
        const states = await prisma.report.findMany({
            distinct: ['state'],
            select: { state: true },
            where: { state: { not: null } }
        });
        const { state } = req.query;
        const districtWhere = { district: { not: null } };
        if (state)
            districtWhere.state = state;
        const districts = await prisma.report.findMany({
            distinct: ['district'],
            select: { district: true },
            where: districtWhere
        });
        res.status(200).json({
            states: states.map(s => s.state),
            districts: districts.map(d => d.district)
        });
    }
    catch (error) {
        console.error("Error fetching filter options:", error);
        res.status(500).json({ error: 'Failed to fetch filter options' });
    }
};
exports.getFilterOptions = getFilterOptions;
// Get public issues (e.g. for heatmap or list), hiding user PII
const getPublicIssues = async (req, res) => {
    try {
        const { state, district, category, severity } = req.query;
        const whereClause = {};
        if (state)
            whereClause.state = state;
        if (district)
            whereClause.district = district;
        if (category)
            whereClause.category = category;
        if (severity)
            whereClause.severity = severity;
        const reports = await prisma.report.findMany({
            where: whereClause,
            select: {
                trackingId: true,
                category: true,
                severity: true,
                status: true,
                lat: true,
                lng: true,
                address: true,
                description: true,
                state: true,
                district: true,
                createdAt: true,
                images: {
                    select: {
                        imageUrl: true,
                        isPrimary: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 100 // Limit for performance
        });
        const normalizedReports = reports.map(report => ({
            ...report,
            images: report.images.map(img => ({
                ...img,
                imageUrl: normalizeImageUrl(img.imageUrl)
            }))
        }));
        res.status(200).json({ issues: normalizedReports });
    }
    catch (error) {
        console.error("Error fetching public issues:", error);
        res.status(500).json({ error: 'Failed to fetch public issues' });
    }
};
exports.getPublicIssues = getPublicIssues;
// Track a specific ticket
const trackTicket = async (req, res) => {
    try {
        const trackingId = req.params.trackingId;
        const report = await prisma.report.findUnique({
            where: { trackingId },
            include: {
                images: true,
                statusHistory: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
        if (!report) {
            res.status(404).json({ error: 'Ticket not found' });
            return;
        }
        // Return safe data (exclude user ID, precise loc if sensitive, etc.)
        res.status(200).json({
            trackingId: report.trackingId,
            status: report.status,
            category: report.category,
            severity: report.severity,
            description: report.description,
            address: report.address,
            state: report.state,
            district: report.district,
            pincode: report.pincode,
            roadType: report.roadType,
            jurisdiction: report.jurisdiction,
            lat: report.lat,
            lng: report.lng,
            aiAnalysis: report.aiAnalysis,
            aiConfidence: report.aiConfidence,
            estimatedCostMin: report.estimatedCostMin,
            estimatedCostMax: report.estimatedCostMax,
            createdAt: report.createdAt,
            resolvedAt: report.resolvedAt,
            images: report.images.map((img) => ({
                ...img,
                imageUrl: normalizeImageUrl(img.imageUrl)
            })),
            statusHistory: report.statusHistory
        });
    }
    catch (error) {
        console.error("Error tracking ticket:", error);
        res.status(500).json({ error: 'Failed to track ticket' });
    }
};
exports.trackTicket = trackTicket;
//# sourceMappingURL=dashboard.controller.js.map