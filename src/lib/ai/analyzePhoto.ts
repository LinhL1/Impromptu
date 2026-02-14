import { mockEncouragements } from "../mock-data";

/**
 * Analyze a photo against the prompt and return encouraging feedback.
 * Uses mock data for now — ready for AI integration later.
 */
export async function analyzePhoto(
  _prompt: string,
  _photoBase64: string
): Promise<string> {
  await new Promise((r) => setTimeout(r, 800));
  
  const index = Math.floor(Math.random() * mockEncouragements.length);
  return mockEncouragements[index];
}
