"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeReport = void 0;
const client_1 = require("@prisma/client");
const citizen_advocate_agent_1 = require("../agents/citizen-advocate.agent");
const prisma = new client_1.PrismaClient();
// Categories that typically require heavy machinery and contractors
const BIDDING_CATEGORIES = [
    'Road & Streets',
    'Building Damage',
    'Bridges',
    'Major Infrastructure'
];
// Categories typically handled by internal government workers
const AGENT_CATEGORIES = [
    'Electricity',
    'Water & Drainage',
    'Waste & Sanitation',
    'Public Lighting',
    'Parks & Recreation'
];
const routeReport = async (reportId) => {
    try {
        const report = await prisma.report.findUnique({ where: { id: reportId } });
        if (!report)
            return;
        let path = 'AGENT'; // Default fallback
        if (report.category && BIDDING_CATEGORIES.includes(report.category)) {
            path = 'BIDDING';
        }
        else if (report.category && AGENT_CATEGORIES.includes(report.category)) {
            path = 'AGENT';
        }
        else {
            // Further AI prompt or basic logic could be added here to classify "Other"
            // Defaulting to AGENT generally means it goes to an internal queue first.
        }
        // Update the report to show it has been routed
        const updatedReport = await prisma.report.update({
            where: { id: reportId },
            data: {
                workflowPath: path,
                status: 'ROUTED'
            }
        });
        console.log(`Report ${report.trackingId} routed to ${path} path.`);
        // Trigger asynchronous agent flows based on path
        if (path === 'AGENT') {
            (0, citizen_advocate_agent_1.triggerCitizenAdvocate)(updatedReport.id).catch(err => {
                console.error("Failed to trigger Citizen Advocate Agent:", err);
            });
        }
        else {
            // Trigger bidding setup flow (future Phase 4)
            console.log(`Bidding flow triggered for report ${report.trackingId}. Waiting for contractors.`);
        }
    }
    catch (error) {
        console.error("Error in routing service:", error);
    }
};
exports.routeReport = routeReport;
//# sourceMappingURL=routing.service.js.map