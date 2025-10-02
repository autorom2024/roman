
// services/geminiApi.ts
// FIX: Import GoogleGenAI from '@google/genai'
import { GoogleGenAI, Type } from "@google/genai";
import { sanitizeFilename } from '../utils/files';

// FIX: The apiKey is now sourced from process.env.API_KEY as per guidelines.
export const checkGeminiKey = async (): Promise<boolean> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: 'test' });
        return true;
    } catch (error) {
        console.error("Gemini key check failed:", error);
        return false;
    }
};

// FIX: The apiKey is now sourced from process.env.API_KEY as per guidelines.
export const generateTitlesWithGemini = async (style: string, kind: 'track' | 'album', count: number): Promise<string[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemInstruction = `You are a concise music title generator. Output *only* a JSON array of strings. Each string is a short, evocative ${kind} title, 2-5 words, no numbering, no emojis, no quotes.`;
    const userPrompt = `Style / mood: ${style}\nLanguage: English.\nNeed exactly ${count} unique ${kind} titles.`;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userPrompt,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            }
        }
    });

    const jsonText = response.text.trim();
    const generatedTitles = JSON.parse(jsonText);
    if (!Array.isArray(generatedTitles)) throw new Error('API did not return an array.');

    const uniqueTitles = Array.from(new Set(generatedTitles.map(t => sanitizeFilename(String(t)))));
    return uniqueTitles.slice(0, count);
};
