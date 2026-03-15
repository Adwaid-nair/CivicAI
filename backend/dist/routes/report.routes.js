"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const report_controller_1 = require("../controllers/report.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware");
const router = (0, express_1.Router)();
// Public / Guest Routes
router.post('/submit', auth_middleware_1.optionalAuth, upload_middleware_1.upload.array('images', 10), report_controller_1.submitReport);
router.get('/public', report_controller_1.getPublicReports);
// Authenticated Routes
router.get('/my-reports', auth_middleware_1.authenticate, report_controller_1.getMyReports);
exports.default = router;
//# sourceMappingURL=report.routes.js.map