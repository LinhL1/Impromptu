import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { generatePrompt } from "@/lib/ai/generatePrompt";
import { analyzePhoto } from "@/lib/ai/analyzePhoto";
import CameraCapture from "@/components/CameraCapture";
import PhotoPreview from "@/components/PhotoPreview";
import SubmissionSuccess from "@/components/SubmissionSuccess";

type CameraState = "capture" | "preview" | "success";

export default function CameraPage() {
  const [state, setState] = useState<CameraState>("capture");
  const [prompt, setPrompt] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    generatePrompt().then(setPrompt);
  }, []);

  const handleCapture = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
    setState("preview");
  }, []);

  const handleSubmit = useCallback(
    async (caption: string) => {
      setSubmitting(true);
      try {
        const result = await analyzePhoto(prompt, "");
        setFeedback(result);
        setState("success");
      } finally {
        setSubmitting(false);
      }
    },
    [prompt]
  );

  const handleBack = useCallback(() => {
    setPhotoUrl("");
    setState("capture");
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 pb-24 pt-12">
      <div className="w-full max-w-sm">
        {prompt && state === "capture" && (
          <p className="mb-6 text-center text-sm text-muted-foreground">
            Today's prompt: <span className="font-bold text-foreground">{prompt}</span>
          </p>
        )}

        <AnimatePresence mode="wait">
          {state === "capture" && (
            <CameraCapture key="capture" onCapture={handleCapture} />
          )}
          {state === "preview" && (
            <PhotoPreview
              key="preview"
              photoUrl={photoUrl}
              prompt={prompt}
              onSubmit={handleSubmit}
              onBack={handleBack}
              submitting={submitting}
            />
          )}
          {state === "success" && (
            <SubmissionSuccess key="success" feedback={feedback} photoUrl={photoUrl} />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
