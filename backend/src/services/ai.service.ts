import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface AIAnalysisResult {
    isValid: boolean;
    rejectionReason?: string;
    category: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    estimatedCostMin: number;
    estimatedCostMax: number;
}

/**
 * Downloads an image from a URL, converts it to base64, and returns the generative part.
 */
async function urlToGenerativePart(imageUrl: string, mimeType: string) {
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    return {
        inlineData: {
            data: buffer.toString("base64"),
            mimeType
        },
    };
}

export const analyzeInfrastructureImage = async (imageUrls: string[], userDescription: string, userCategory: string): Promise<AIAnalysisResult> => {
    if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY is missing. Mocking AI response.");
        return {
            isValid: true,
            category: userCategory || "Other",
            severity: "MEDIUM",
            estimatedCostMin: 1000,
            estimatedCostMax: 5000
        };
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Use latest flash model available

        const prompt = `
        You are an AI civic infrastructure expert analyzing a report from a citizen.
        The user characterized this issue as category: "${userCategory}".
        User description: "${userDescription}".
        
        Analyze the provided image(s) to determine:
        1. Valid Issue? (Is there actually an infrastructure issue visible, like a pothole, leak, damage? Or is it a selfie, random object, or blank photo?)
        2. Issue Classification (e.g., "Road & Streets", "Water & Drainage", "Public Lighting", etc.)
        3. Severity (LOW, MEDIUM, HIGH, CRITICAL based on danger and scale)
        4. Estimated Cost Range in INR (Min and Max)

        You must return ONLY a JSON response in the following schema exactly (no markdown blocks, just the JSON):
        {
            "isValid": boolean,
            "rejectionReason": string | null (if isValid is false, explain why concisely),
            "category": string,
            "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
            "estimatedCostMin": number,
            "estimatedCostMax": number
        }
        `;

        const imageParts = await Promise.all(
            imageUrls.map(url => urlToGenerativePart(url, "image/jpeg")) 
        );

        const result = await model.generateContent([prompt, ...imageParts]);
        const response = await result.response;
        let text = response.text();
        
        // Clean up text if it contains markdown formatting
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const analysis = JSON.parse(text) as AIAnalysisResult;
        return analysis;

    } catch (error) {
        console.error("AI Analysis failed:", error);
        // Fallback or rethrow depending on strictness
        throw new Error("Failed to process image through AI.");
    }
};
