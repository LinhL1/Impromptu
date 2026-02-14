/**
 * src/lib/ai/geminiClient.ts
 *
 * Thin wrapper around the Gemini REST API.
 * Uses gemini-2.0-flash for all requests.
 */

const BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

function getApiKey(): string {
  const key = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (!key) {
    throw new Error(
      "Missing VITE_GEMINI_API_KEY. Add it to your .env file and restart the dev server."
    );
  }
  return key;
}

export interface TextPart {
  text: string;
}

export interface InlineDataPart {
  inlineData: {
    mimeType: string;
    data: string; // base64
  };
}

export type Part = TextPart | InlineDataPart;

export interface GeminiRequest {
  contents: { parts: Part[] }[];
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
  };
}

export async function callGemini(request: GeminiRequest): Promise<string> {
  const res = await fetch(`${BASE_URL}?key=${getApiKey()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const text: string =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return text.trim();
}

/**
 * Convert a File or Blob to a base64 string (without the data: prefix).
 */
export async function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip "data:<mime>;base64," prefix
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}