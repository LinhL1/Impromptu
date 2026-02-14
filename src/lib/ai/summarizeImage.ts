/**
 * src/lib/ai/summarizeImage.ts
 *
 * Generates a natural-language accessibility description (alt text)
 * for a user's photo using Gemini vision.
 *
 * Used in CameraPage before submitting so every post has meaningful altText
 * for screen readers, even if the user didn't write a caption.
 */

import { callGemini, fileToBase64 } from "./GeminiClient";

const FALLBACK_ALT = "User submitted photo for today's prompt.";

export async function summarizeImage(
  imageFile: File | Blob,
  prompt?: string
): Promise<string> {
  try {
    const base64 = await fileToBase64(imageFile);
    const mimeType = imageFile.type || "image/jpeg";

    const context = prompt
      ? `The photo was taken in response to the prompt: "${prompt}".`
      : "";

    const result = await callGemini({
      contents: [
        {
          parts: [
            {
              inlineData: { mimeType, data: base64 },
            },
            {
              text: `Describe this photo in 1–2 clear, concise sentences for a screen reader (alt text).
${context}
Focus on what is visually present — subjects, colours, lighting, mood.
Do not start with "This image shows" or "A photo of" — just describe it directly.
Keep it under 30 words.`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 60,
      },
    });

    return result || FALLBACK_ALT;
  } catch (err) {
    console.warn("summarizeImage: Gemini call failed, using fallback.", err);
    return FALLBACK_ALT;
  }
}