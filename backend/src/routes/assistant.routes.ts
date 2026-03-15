import { Router } from 'express';
import {
    generateAssistantMessage,
    synthesizeAssistantMessage,
    transcribeAssistantAudio,
} from '../controllers/assistant.controller';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.post('/stt', upload.single('file'), transcribeAssistantAudio);
router.post('/chat', generateAssistantMessage);
router.post('/tts', synthesizeAssistantMessage);

export default router;
