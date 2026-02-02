import type { APIRoute } from 'astro';
import { generateBotanistResponse } from '../../lib/gemini';
import { SYSTEM_PROMPT } from '../../lib/prompt';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { message, image } = body;

    if (!message && !image) {
      return new Response(JSON.stringify({ error: "Message or Image required" }), { status: 400 });
    }

    // "The Green-Tech AI Botanist" logic
    const reply = await generateBotanistResponse(
      SYSTEM_PROMPT,
      message || (image ? "Analyze this image according to your Visual Analysis protocol." : "Hello"),
      image // Expecting { mimeType: "image/jpeg", data: "base64..." }
    );

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("API Route Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
