/**
 * src/lib/ai/analyzePhoto.ts
 */

import { callGemini, fileToBase64 } from "./GeminiClient";

export interface PhotoAnalysisResult {
  matches: boolean;
  feedback: string;
}

export async function analyzePhoto(
  prompt: string,
  _unused: string,
  imageFile?: File | Blob
): Promise<PhotoAnalysisResult> {
  if (!imageFile) {
    return { matches: false, feedback: "ERROR: No image file received." };
  }

  try {
    const base64 = await fileToBase64(imageFile);
    const mimeType = imageFile.type || "image/jpeg";

    const raw = await callGemini({
      contents: [
        {
          parts: [
            { inlineData: { mimeType, data: base64 } },
            {
              text: `You are a strict judge for a photo scavenger hunt. The prompt is: "${prompt}". Does this photo show "${prompt}"? Reply ONLY with JSON: {"matches": true, "feedback": "reason"} or {"matches": false, "feedback": "reason"}`,
            },
          ],
        },
      ],
      generationConfig: { temperature: 0.1, maxOutputTokens: 150 },
    });

    if (!raw || raw.trim() === "") {
      return { matches: false, feedback: "ERROR: Gemini returned an empty response. Check your API key and billing at aistudio.google.com." };
    }

    const stripped = raw.replace(/```json|```/gi, "").trim();
    const start = stripped.indexOf("{");
    const end = stripped.lastIndexOf("}");

    if (start === -1 || end === -1) {
      return { matches: false, feedback: `ERROR: Could not find JSON in response. Raw: "${raw}"` };
    }

    const parsed = JSON.parse(stripped.slice(start, end + 1));
    return { matches: parsed.matches ?? false, feedback: parsed.feedback ?? raw };

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { matches: false, feedback: `ERROR: ${message}` };
  }
}