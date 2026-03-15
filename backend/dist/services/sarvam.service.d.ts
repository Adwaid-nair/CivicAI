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
export declare class SarvamApiError extends Error {
    statusCode: number;
    details?: string;
    constructor(message: string, statusCode: number, details?: string);
}
export declare const transcribeSpeech: (file: Express.Multer.File, options?: {
    languageCode?: string;
    mode?: string;
    model?: string;
}) => Promise<SarvamTranscriptionResult>;
export declare const generateChatReply: (messages: SarvamChatMessage[]) => Promise<{
    reply: string;
    requestId: string | null;
}>;
export declare const synthesizeSpeech: (text: string, options?: {
    targetLanguageCode?: string;
    speaker?: string;
    model?: string;
}) => Promise<SarvamSpeechResult>;
//# sourceMappingURL=sarvam.service.d.ts.map