import { GoogleGenAI } from "@google/genai";
import { Trade } from "../types";

const getClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("API Key not found in environment");
    return new GoogleGenAI({ apiKey });
};

export const analyzeTradeWithAI = async (trade: Trade): Promise<string> => {
    try {
        const client = getClient();
        
        const prompt = `
        Act as a professional trading psychologist and technical analyst. 
        Analyze this trade based on the provided data and chart (if available).
        
        Trade Details:
        - Instrument: ${trade.instrument}
        - Direction: ${trade.direction}
        - Outcome: ${trade.outcome}
        - PnL: ${trade.pnl}
        - Setup: ${trade.setup || 'N/A'}
        - Trader Notes: "${trade.notes}"
        
        Please provide:
        1. Technical Feedback: Was the entry valid based on standard price action? (If image provided)
        2. Psychological Feedback: Based on the notes and outcome.
        3. Improvement Area: One specific thing to focus on next time.
        
        Keep the response concise, encouraging, yet critical where necessary. Format with Markdown.
        `;

        const parts: any[] = [{ text: prompt }];

        if (trade.screenshotUrl) {
            // Remove data:image/png;base64, prefix if present for the API
            const base64Data = trade.screenshotUrl.split(',')[1];
            parts.push({
                inlineData: {
                    mimeType: 'image/png', // Assuming png/jpeg compatible
                    data: base64Data
                }
            });
        }

        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: parts }
        });

        return response.text || "Could not generate analysis.";
    } catch (error) {
        console.error("AI Analysis failed:", error);
        return "Failed to connect to AI. Please ensure your API key is valid and try again.";
    }
};