"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.synthesizeSpeech = exports.generateChatReply = exports.transcribeSpeech = exports.SarvamApiError = void 0;
class SarvamApiError extends Error {
    statusCode;
    details;
    constructor(message, statusCode, details) {
        super(message);
        this.name = 'SarvamApiError';
        this.statusCode = statusCode;
        this.details = details;
    }
}
exports.SarvamApiError = SarvamApiError;
const SARVAM_BASE_URL = 'https://api.sarvam.ai';
const getRequiredSarvamApiKey = () => {
    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) {
        throw new SarvamApiError('SARVAM_API_KEY is not configured on backend.', 500);
    }
    return apiKey;
};
const parseSarvamError = async (response) => {
    const raw = await response.text();
    if (!raw)
        return 'Unknown upstream error';
    try {
        const parsed = JSON.parse(raw);
        return parsed.error?.message || parsed.message || raw;
    }
    catch {
        return raw;
    }
};
const sanitizeChatReply = (text) => {
    const withoutThinkingBlocks = text.replace(/<think>[\s\S]*?<\/think>/gi, '');
    return withoutThinkingBlocks
        .replace(/<\/?think>/gi, '')
        .replace(/```[\s\S]*?```/g, (match) => match.replace(/```/g, ''))
        .trim();
};
const transcribeSpeech = async (file, options) => {
    const apiKey = getRequiredSarvamApiKey();
    const model = options?.model || process.env.SARVAM_STT_MODEL || 'saaras:v3';
    const mode = options?.mode || process.env.SARVAM_STT_MODE || 'transcribe';
    const languageCode = options?.languageCode || 'unknown';
    const formData = new FormData();
    const normalizedAudioBytes = Uint8Array.from(file.buffer);
    const audioBlob = new Blob([normalizedAudioBytes], { type: file.mimetype || 'audio/webm' });
    formData.append('file', audioBlob, file.originalname || 'voice-input.webm');
    formData.append('model', model);
    formData.append('mode', mode);
    formData.append('language_code', languageCode);
    const response = await fetch(`${SARVAM_BASE_URL}/speech-to-text`, {
        method: 'POST',
        headers: {
            'api-subscription-key': apiKey,
        },
        body: formData,
    });
    if (!response.ok) {
        const details = await parseSarvamError(response);
        throw new SarvamApiError('Sarvam STT request failed.', response.status, details);
    }
    const data = await response.json();
    if (!data.transcript) {
        throw new SarvamApiError('Sarvam STT response did not contain transcript.', 502);
    }
    return {
        transcript: data.transcript,
        languageCode: data.language_code ?? null,
        requestId: data.request_id ?? null,
    };
};
exports.transcribeSpeech = transcribeSpeech;
const generateChatReply = async (messages) => {
    const apiKey = getRequiredSarvamApiKey();
    const model = process.env.SARVAM_CHAT_MODEL || 'sarvam-m';
    const response = await fetch(`${SARVAM_BASE_URL}/v1/chat/completions`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model,
            messages,
            stream: false,
        }),
    });
    if (!response.ok) {
        const details = await parseSarvamError(response);
        throw new SarvamApiError('Sarvam chat request failed.', response.status, details);
    }
    const data = await response.json();
    const rawReply = data.choices?.[0]?.message?.content?.trim();
    const reply = rawReply ? sanitizeChatReply(rawReply) : '';
    if (!reply) {
        throw new SarvamApiError('Sarvam chat response did not contain a reply.', 502);
    }
    return {
        reply,
        requestId: data.request_id ?? data.id ?? null,
    };
};
exports.generateChatReply = generateChatReply;
const synthesizeSpeech = async (text, options) => {
    const apiKey = getRequiredSarvamApiKey();
    const targetLanguageCode = options?.targetLanguageCode || process.env.SARVAM_TTS_LANGUAGE_CODE || 'en-IN';
    const speaker = options?.speaker || process.env.SARVAM_TTS_SPEAKER || 'shubh';
    const model = options?.model || process.env.SARVAM_TTS_MODEL || 'bulbul:v3';
    const response = await fetch(`${SARVAM_BASE_URL}/text-to-speech`, {
        method: 'POST',
        headers: {
            'api-subscription-key': apiKey,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            text,
            target_language_code: targetLanguageCode,
            speaker,
            model,
            speech_sample_rate: 24000,
        }),
    });
    if (!response.ok) {
        const details = await parseSarvamError(response);
        throw new SarvamApiError('Sarvam TTS request failed.', response.status, details);
    }
    const data = await response.json();
    const audioBase64 = data.audios?.[0];
    if (!audioBase64) {
        throw new SarvamApiError('Sarvam TTS response did not contain audio.', 502);
    }
    return {
        audioBase64,
        requestId: data.request_id ?? null,
    };
};
exports.synthesizeSpeech = synthesizeSpeech;
//# sourceMappingURL=sarvam.service.js.map