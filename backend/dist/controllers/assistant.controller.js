"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.synthesizeAssistantMessage = exports.generateAssistantMessage = exports.transcribeAssistantAudio = void 0;
const sarvam_service_1 = require("../services/sarvam.service");
const isValidIncomingMessage = (value) => {
    if (!value || typeof value !== 'object')
        return false;
    const candidate = value;
    return typeof candidate.role === 'string' && typeof candidate.content === 'string';
};
const toSarvamRole = (role) => {
    if (role === 'assistant' || role === 'ai')
        return 'assistant';
    return 'user';
};
const normalizeHistoryForSarvam = (history, latestUserMessage) => {
    const cleaned = history
        .map((item) => ({
        role: toSarvamRole(item.role),
        content: item.content.trim(),
    }))
        .filter((item) => item.content.length > 0);
    while (cleaned.length > 0 && cleaned[0].role !== 'user') {
        cleaned.shift();
    }
    const alternating = [];
    for (const item of cleaned) {
        const previous = alternating[alternating.length - 1];
        if (!previous || previous.role !== item.role) {
            alternating.push(item);
        }
    }
    const latestTrimmed = latestUserMessage.trim();
    const last = alternating[alternating.length - 1];
    if (last?.role === 'user') {
        alternating.pop();
    }
    else if (last?.role === 'assistant' && last.content === latestTrimmed) {
        // Defensive guard for malformed clients that may mirror user text under assistant role.
        alternating.pop();
    }
    return alternating;
};
const getErrorPayload = (error) => {
    if (error instanceof sarvam_service_1.SarvamApiError) {
        return {
            status: error.statusCode,
            error: error.message,
            details: error.details,
        };
    }
    return {
        status: 500,
        error: 'Unexpected assistant service error.',
    };
};
const transcribeAssistantAudio = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            res.status(400).json({ error: 'Audio file is required in field "file".' });
            return;
        }
        const languageCode = typeof req.body.languageCode === 'string' ? req.body.languageCode : undefined;
        const model = typeof req.body.model === 'string' ? req.body.model : undefined;
        const mode = typeof req.body.mode === 'string' ? req.body.mode : undefined;
        const result = await (0, sarvam_service_1.transcribeSpeech)(file, { languageCode, model, mode });
        res.status(200).json(result);
    }
    catch (error) {
        const payload = getErrorPayload(error);
        res.status(payload.status).json(payload);
    }
};
exports.transcribeAssistantAudio = transcribeAssistantAudio;
const generateAssistantMessage = async (req, res) => {
    try {
        const { message, history } = req.body;
        if (typeof message !== 'string' || !message.trim()) {
            res.status(400).json({ error: 'message is required.' });
            return;
        }
        const safeHistory = Array.isArray(history)
            ? history.filter(isValidIncomingMessage).slice(-12)
            : [];
        const systemPrompt = {
            role: 'system',
            content: [
                'You are CivicAI voice assistant.',
                'Help users report civic issues in a concise, practical way.',
                'Support multilingual user input and keep responses short and clear for speech output.',
            ].join(' '),
        };
        const normalizedHistory = normalizeHistoryForSarvam(safeHistory, message);
        const messages = [
            systemPrompt,
            ...normalizedHistory,
            {
                role: 'user',
                content: message.trim(),
            },
        ];
        const result = await (0, sarvam_service_1.generateChatReply)(messages);
        res.status(200).json(result);
    }
    catch (error) {
        const payload = getErrorPayload(error);
        res.status(payload.status).json(payload);
    }
};
exports.generateAssistantMessage = generateAssistantMessage;
const synthesizeAssistantMessage = async (req, res) => {
    try {
        const { text, targetLanguageCode, speaker, model } = req.body;
        if (typeof text !== 'string' || !text.trim()) {
            res.status(400).json({ error: 'text is required.' });
            return;
        }
        const result = await (0, sarvam_service_1.synthesizeSpeech)(text.trim(), {
            targetLanguageCode: typeof targetLanguageCode === 'string' ? targetLanguageCode : undefined,
            speaker: typeof speaker === 'string' ? speaker : undefined,
            model: typeof model === 'string' ? model : undefined,
        });
        res.status(200).json({
            ...result,
            mimeType: 'audio/wav',
        });
    }
    catch (error) {
        const payload = getErrorPayload(error);
        res.status(payload.status).json(payload);
    }
};
exports.synthesizeAssistantMessage = synthesizeAssistantMessage;
//# sourceMappingURL=assistant.controller.js.map