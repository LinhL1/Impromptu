/**
 * src/lib/ai/analyzePhoto.ts
 *
 * ⚠️ GEMINI VALIDATION TEMPORARILY DISABLED FOR BACKEND TESTING
 * All photos auto-pass. Re-enable by restoring the Gemini call below.
 */

import { mockEncouragements } from "../mock-data";

export interface PhotoAnalysisResult {
  matches: boolean;
  feedback: string;
}

export async function analyzePhoto(
  _prompt: string,
  _unused: string,
  _imageFile?: File | Blob
): Promise<PhotoAnalysisResult> {
  // 🚧 BYPASS — remove this block to re-enable Gemini validation
  return {
    matches: true,
    feedback: mockEncouragements[Math.floor(Math.random() * mockEncouragements.length)],
  };
}