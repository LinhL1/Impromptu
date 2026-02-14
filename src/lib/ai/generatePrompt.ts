/**
 * src/lib/ai/generatePrompt.ts
 *
 * Uses Gemini to generate a fresh creative photo prompt each day.
 * Falls back to the mock list if the API call fails.
 */

import { callGemini } from "./GeminiClient";
import { mockPrompts } from "../mock-data";

// Cache so we only call the API once per day per session
let cachedPrompt: string | null = null;
let cachedDate: string | null = null;

function todayKey(): string {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function fallback(): string {
  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return mockPrompts[dayIndex % mockPrompts.length];
}

export async function generatePrompt(): Promise<string> {
  const today = todayKey();

  // Return cache if same day
  if (cachedPrompt && cachedDate === today) {
    return cachedPrompt;
  }

  try {
    const result = await callGemini({
      contents: [
        {
          parts: [
            {
              text: `You are a creative director for a daily photo scavenger hunt app.
Generate a single short, evocative photo prompt for today.

Rules:
- 1–4 words only (e.g. "Golden hour", "Something tiny", "Your hands")
- Should be achievable anywhere — indoors or outdoors
- Spark curiosity or a moment of noticing something beautiful
- Do NOT add punctuation, quotes, or explanation — just the prompt itself

Today's date: ${today}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 20,
      },
    });

    cachedPrompt = result || fallback();
    cachedDate = today;
    return cachedPrompt;
  } catch (err) {
    console.warn("generatePrompt: Gemini call failed, using fallback.", err);
    return fallback();
  }
}