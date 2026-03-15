import { Request, Response } from 'express';
import {
    generateChatReply,
    SarvamApiError,
    SarvamChatMessage,
    synthesizeSpeech,
    transcribeSpeech,
} from '../services/sarvam.service';

interface IncomingChatMessage {
    role: string;
    content: string;
}

const isValidIncomingMessage = (value: unknown): value is IncomingChatMessage => {
    if (!value || typeof value !== 'object') return false;
    const candidate = value as { role?: unknown; content?: unknown };
    return typeof candidate.role === 'string' && typeof candidate.content === 'string';
};

const toSarvamRole = (role: string): 'user' | 'assistant' => {
    if (role === 'assistant' || role === 'ai') return 'assistant';
    return 'user';
};

const normalizeHistoryForSarvam = (
    history: IncomingChatMessage[],
    latestUserMessage: string
): SarvamChatMessage[] => {
    const cleaned = history
        .map((item) => ({
            role: toSarvamRole(item.role),
            content: item.content.trim(),
        }))
        .filter((item) => item.content.length > 0);

    while (cleaned.length > 0 && cleaned[0].role !== 'user') {
        cleaned.shift();
    }

    const alternating: SarvamChatMessage[] = [];
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
    } else if (last?.role === 'assistant' && last.content === latestTrimmed) {
        // Defensive guard for malformed clients that may mirror user text under assistant role.
        alternating.pop();
    }

    return alternating;
};

const getErrorPayload = (error: unknown): { status: number; error: string; details?: string } => {
    if (error instanceof SarvamApiError) {
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

export const transcribeAssistantAudio = async (req: Request, res: Response): Promise<void> => {
    try {
        const file = req.file as Express.Multer.File | undefined;
        if (!file) {
            res.status(400).json({ error: 'Audio file is required in field "file".' });
            return;
        }

        const languageCode = typeof req.body.languageCode === 'string' ? req.body.languageCode : undefined;
        const model = typeof req.body.model === 'string' ? req.body.model : undefined;
        const mode = typeof req.body.mode === 'string' ? req.body.mode : undefined;

        const result = await transcribeSpeech(file, { languageCode, model, mode });
        res.status(200).json(result);
    } catch (error) {
        const payload = getErrorPayload(error);
        res.status(payload.status).json(payload);
    }
};

export const generateAssistantMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { message, history } = req.body as { message?: unknown; history?: unknown };
        if (typeof message !== 'string' || !message.trim()) {
            res.status(400).json({ error: 'message is required.' });
            return;
        }

        const safeHistory = Array.isArray(history)
            ? history.filter(isValidIncomingMessage).slice(-12)
            : [];

        const systemPrompt: SarvamChatMessage = {
            role: 'system',
            content: [
                'You are CivicAI voice assistant.',
                'Help users report civic issues in a concise, practical way.',
                'Support multilingual user input and keep responses short and clear for speech output.',
            ].join(' '),
        };

        const normalizedHistory = normalizeHistoryForSarvam(safeHistory, message);

        const messages: SarvamChatMessage[] = [
            systemPrompt,
            ...normalizedHistory,
            {
                role: 'user',
                content: message.trim(),
            },
        ];

        const result = await generateChatReply(messages);
        res.status(200).json(result);
    } catch (error) {
        const payload = getErrorPayload(error);
        res.status(payload.status).json(payload);
    }
};

export const synthesizeAssistantMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { text, targetLanguageCode, speaker, model } = req.body as {
            text?: unknown;
            targetLanguageCode?: unknown;
            speaker?: unknown;
            model?: unknown;
        };

        if (typeof text !== 'string' || !text.trim()) {
            res.status(400).json({ error: 'text is required.' });
            return;
        }

        const result = await synthesizeSpeech(text.trim(), {
            targetLanguageCode: typeof targetLanguageCode === 'string' ? targetLanguageCode : undefined,
            speaker: typeof speaker === 'string' ? speaker : undefined,
            model: typeof model === 'string' ? model : undefined,
        });

        res.status(200).json({
            ...result,
            mimeType: 'audio/wav',
        });
    } catch (error) {
        const payload = getErrorPayload(error);
        res.status(payload.status).json(payload);
    }
};
