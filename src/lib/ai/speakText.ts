/**
 * src/lib/ai/speakText.ts
 *
 * Uses ElevenLabs TTS to read text aloud.
 * Only fires when the screen reader setting is enabled.
 *
 * Falls back to the browser's built-in Web Speech API if:
 *  - No ElevenLabs API key is set
 *  - The API call fails
 */

const ELEVENLABS_VOICE_ID = "EXAVITQu4vr4xnSDxMaL"; // "Sarah" — natural, clear voice
const ELEVENLABS_MODEL = "eleven_turbo_v2";           // Fastest + cheapest model

let currentAudio: HTMLAudioElement | null = null;

/** Stop any currently playing TTS audio */
export function stopSpeaking() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = "";
    currentAudio = null;
  }
  // Also stop Web Speech fallback
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

/** Speak text using ElevenLabs, falling back to Web Speech API */
export async function speakText(text: string): Promise<void> {
  if (!text.trim()) return;

  // Stop anything currently playing
  stopSpeaking();

  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY as string | undefined;

  if (apiKey) {
    try {
      await speakWithElevenLabs(text, apiKey);
      return;
    } catch (err) {
      console.warn("ElevenLabs TTS failed, falling back to Web Speech:", err);
    }
  }

  // Fallback: browser Web Speech API
  speakWithWebSpeech(text);
}

async function speakWithElevenLabs(text: string, apiKey: string): Promise<void> {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}/stream`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: ELEVENLABS_MODEL,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`ElevenLabs API error ${res.status}`);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  currentAudio = audio;

  return new Promise((resolve, reject) => {
    audio.onended = () => {
      URL.revokeObjectURL(url);
      currentAudio = null;
      resolve();
    };
    audio.onerror = reject;
    audio.play();
  });
}

function speakWithWebSpeech(text: string): void {
  if (!window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}