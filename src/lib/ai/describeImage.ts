/**
 * Generate an accessible description for a photo.
 * Uses mock data for now — ready for AI integration later.
 */
export async function describeImage(_photoBase64: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 500));
  
  return "A photo shared in response to today's creative prompt, showing a moment captured by the user.";
}
