"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const worker_controller_1 = require("../controllers/worker.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware");
const router = express_1.default.Router();
router.get('/tasks', auth_middleware_1.authenticate, worker_controller_1.getAssignedTasks);
router.post('/fix', auth_middleware_1.authenticate, upload_middleware_1.upload.array('images', 1), worker_controller_1.markTaskFixed);
exports.default = router;
//# sourceMappingURL=worker.routes.js.map