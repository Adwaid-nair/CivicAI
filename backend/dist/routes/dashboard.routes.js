"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const router = express_1.default.Router();
// All dashboard routes are public
router.get('/metrics', dashboard_controller_1.getDashboardMetrics);
router.get('/filter-options', dashboard_controller_1.getFilterOptions);
router.get('/issues', dashboard_controller_1.getPublicIssues);
router.get('/track/:trackingId', dashboard_controller_1.trackTicket);
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map