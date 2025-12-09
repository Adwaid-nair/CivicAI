import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult, Severity, Ticket } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Agent 1: Detection Agent (Vision) ---
export const analyzeIssueImage = async (base64Image: string, userPrompt?: string): Promise<AIAnalysisResult> => {
  const modelId = "gemini-2.5-flash"; // Efficient for vision
  
  const systemInstruction = `
    You are an expert autonomous civic issue detector. 
    Analyze the image and user description to identify civic infrastructure problems (potholes, garbage, broken lights, water leaks, etc.).
    Determine the severity based on public safety impact.
    Identify the likely responsible authority type (e.g., Corporation for roads/garbage, Water Board for leaks, Electricity Board for poles).
    Provide a confidence score (0.0 to 1.0) and a brief reasoning for your assessment.
    Return strict JSON.
  `;

  const prompt = userPrompt ? `Additional user context: ${userPrompt}` : "Analyze this civic issue.";

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Short title of the issue (e.g., 'Severe Pothole on Main St')" },
            description: { type: Type.STRING, description: "Detailed technical description of the damage." },
            severity: { type: Type.STRING, enum: [Severity.LOW, Severity.MEDIUM, Severity.HIGH, Severity.EMERGENCY] },
            authorityType: { type: Type.STRING, enum: ["Corporation", "Water Board", "Electricity Board", "Traffic Police"] },
            detectedObjects: { type: Type.ARRAY, items: { type: Type.STRING } },
            confidence: { type: Type.NUMBER, description: "Confidence score between 0.0 and 1.0 indicating certainty of detection." },
            reasoning: { type: Type.STRING, description: "Brief explanation of why this issue was identified and why the severity level was chosen." }
          },
          required: ["title", "description", "severity", "authorityType", "detectedObjects", "confidence", "reasoning"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIAnalysisResult;
    }
    throw new Error("No response from AI");
  } catch (error) {
    console.error("AI Analysis Failed:", error);
    // Fallback stub for demo stability if API fails
    return {
      title: "Civic Issue Detected",
      description: "Unable to analyze details specifically. Please review manually.",
      severity: Severity.MEDIUM,
      authorityType: "Corporation",
      detectedObjects: ["unknown"],
      confidence: 0.5,
      reasoning: "Analysis failed, using fallback values."
    };
  }
};

// --- Agent 2: Drafting Agent (LLM) ---
export const draftComplaint = async (issue: AIAnalysisResult, address: string) => {
  const modelId = "gemini-2.5-flash";
  
  const prompt = `
    Draft a formal complaint for:
    Issue: ${issue.title}
    Details: ${issue.description}
    Location: ${address}
    Severity: ${issue.severity}
    
    Output JSON with:
    1. emailSubject (Formal, citing severity)
    2. emailBody (Polite, citing citizen rights, requesting immediate action)
    3. whatsappMessage (Short, urgent, includes location)
  `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          emailSubject: { type: Type.STRING },
          emailBody: { type: Type.STRING },
          whatsappMessage: { type: Type.STRING }
        }
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

// --- Agent 3: Virtual Commissioner (Persona) ---
export const getCommissionerResponse = async (ticket: Ticket) => {
  const modelId = "gemini-2.5-flash";

  const systemInstruction = `
    You are the "Virtual Commissioner", an AI representative of the city administration.
    Your goal is to reassure the citizen that their ticket (ID: ${ticket.id}) regarding "${ticket.title}" is being looked into.
    Be empathetic but professional. Mention the severity (${ticket.severity}) and estimated resolution time based on that severity (Low=7 days, High=24hrs).
    Keep it under 50 words.
  `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: "Generate a status update response.",
    config: {
      systemInstruction: systemInstruction,
      maxOutputTokens: 100,
    }
  });

  return response.text;
};