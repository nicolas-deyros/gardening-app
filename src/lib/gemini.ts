import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("Missing GEMINI_API_KEY in environment variables.");
}

const genAI = new GoogleGenerativeAI(API_KEY || "");

// The 'Green-Tech' persona uses Gemini 1.5 Flash for speed and multimodal capabilities
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function generateBotanistResponse(
  systemPrompt: string,
  userMessage: string,
  inlineImageData?: { mimeType: string; data: string }
) {
  try {
    // Combine system prompt with user message or use system instruction feature if checking strictness
    // Ideally we pass system instruction during model config, but for simple request we can prepend.
    // However, 1.5 Flash supports systemInstruction.
    const modelWithSystem = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        systemInstruction: systemPrompt 
    });

    const promptParts: any[] = [userMessage];
    
    if (inlineImageData) {
        promptParts.push({
            inlineData: {
                data: inlineImageData.data,
                mimeType: inlineImageData.mimeType
            }
        });
    }

    const result = await modelWithSystem.generateContent(promptParts);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(`Failed to get organic advice: ${error instanceof Error ? error.message : String(error)}`);
  }
}
