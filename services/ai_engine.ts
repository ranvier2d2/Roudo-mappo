import { GoogleGenAI } from "@google/genai";

// Centralized AI Instance
export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Shared helper for generic text generation.
 * Used by individual skills to access the LLM.
 */
export async function gptRequest(prompt: string, model: string = 'gemini-3-flash-preview', config: any = {}): Promise<{text: string, grounding?: any[]}> {
  try {
    const response = await ai.models.generateContent({ model, contents: prompt, config });
    return { text: response.text || "", grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks };
  } catch (e) {
    console.error("AI Request Failed", e);
    throw new Error("Neural Engine computation failed.");
  }
}