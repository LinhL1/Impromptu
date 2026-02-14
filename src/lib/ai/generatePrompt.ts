import { mockPrompts } from "../mock-data";

/**
 * Generate a daily creative photo prompt.
 * Uses mock data for now — ready for AI integration later.
 */
export async function generatePrompt(): Promise<string> {
  // Deterministic daily prompt based on date
  const today = new Date();
  const dayIndex = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
  const index = dayIndex % mockPrompts.length;
  
  // Simulate network delay for realistic feel
  await new Promise((r) => setTimeout(r, 300));
  
  return mockPrompts[index];
}
