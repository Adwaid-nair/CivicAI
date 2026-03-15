export interface SarvamChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface SarvamTranscriptionResult {
    transcript: string;
    languageCode: string | null;
    requestId: string | null;
}

export interface SarvamSpeechResult {
    audioBase64: string;
    requestId: string | null;
}

export class SarvamApiError extends Error {
    statusCode: number;
    details?: string;

    constructor(message: string, statusCode: number, details?: string) {
        super(message);
        this.name = 'SarvamApiError';
        this.statusCode = statusCode;
        this.details = details;
    }
}

const SARVAM_BASE_URL = 'https://api.sarvam.ai';

const getRequiredSarvamApiKey = (): string => {
    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) {
        throw new SarvamApiError('SARVAM_API_KEY is not configured on backend.', 500);
    }
    return apiKey;
};

const parseSarvamError = async (response: Response): Promise<string> => {
    const raw = await response.text();
    if (!raw) return 'Unknown upstream error';

    try {
        const parsed = JSON.parse(raw) as { message?: string; error?: { message?: string } };
        return parsed.error?.message || parsed.message || raw;
    } catch {
        return raw;
    }
};

const sanitizeChatReply = (text: string): string => {
    const withoutThinkingBlocks = text.replace(/<think>[\s\S]*?<\/think>/gi, '');
    return withoutThinkingBlocks
        .replace(/<\/?think>/gi, '')
        .replace(/```[\s\S]*?```/g, (match) => match.replace(/```/g, ''))
        .trim();
};

export const transcribeSpeech = async (
    file: Express.Multer.File,
    options?: { languageCode?: string; mode?: string; model?: string }
): Promise<SarvamTranscriptionResult> => {
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

    const data = await response.json() as { transcript?: string; language_code?: string | null; request_id?: string | null };

    if (!data.transcript) {
        throw new SarvamApiError('Sarvam STT response did not contain transcript.', 502);
    }

    return {
        transcript: data.transcript,
        languageCode: data.language_code ?? null,
        requestId: data.request_id ?? null,
    };
};

export const generateChatReply = async (
    messages: SarvamChatMessage[]
): Promise<{ reply: string; requestId: string | null }> => {
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

    const data = await response.json() as {
        id?: string | null;
        request_id?: string | null;
        choices?: Array<{ message?: { content?: string } }>;
    };
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

export const synthesizeSpeech = async (
    text: string,
    options?: { targetLanguageCode?: string; speaker?: string; model?: string }
): Promise<SarvamSpeechResult> => {
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

    const data = await response.json() as { audios?: string[]; request_id?: string | null };
    const audioBase64 = data.audios?.[0];
    if (!audioBase64) {
        throw new SarvamApiError('Sarvam TTS response did not contain audio.', 502);
    }

    return {
        audioBase64,
        requestId: data.request_id ?? null,
    };
};
