/**
 * src/lib/ai/describeImage.ts
 *
 * Generates an accessible alt text description for a photo using Gemini.
 * When screen reader is enabled, the result is passed to speakText().
 */

import { callGemini } from "./geminiClient";

const FALLBACK = "A photo shared in response to today's creative prompt.";

export async function describeImage(photoBase64: string): Promise<string> {
  if (!photoBase64) return FALLBACK;

  try {
    const result = await callGemini({
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: photoBase64,
              },
            },
            {
              text: `Describe this photo in 1–2 clear sentences for a screen reader.
Focus on what is visually present — subjects, colours, lighting, and mood.
Do not start with "This image shows" or "A photo of".
Keep it under 30 words and make it natural to listen to.`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 80,
      },
    });

    return result || FALLBACK;
  } catch (err) {
    console.warn("describeImage: Gemini call failed, using fallback.", err);
    return FALLBACK;
  }
}