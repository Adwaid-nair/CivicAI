"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assistant_controller_1 = require("../controllers/assistant.controller");
const upload_middleware_1 = require("../middleware/upload.middleware");
const router = (0, express_1.Router)();
router.post('/stt', upload_middleware_1.upload.single('file'), assistant_controller_1.transcribeAssistantAudio);
router.post('/chat', assistant_controller_1.generateAssistantMessage);
router.post('/tts', assistant_controller_1.synthesizeAssistantMessage);
exports.default = router;
//# sourceMappingURL=assistant.routes.js.map