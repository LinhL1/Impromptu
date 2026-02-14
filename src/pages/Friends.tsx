import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getFeedSubmissions, type Submission } from "@/lib/mock-data";
import { speakText, stopSpeaking } from "@/lib/ai/speakText";
import FriendPost from "@/components/FriendPost";

function isScreenReaderOn(): boolean {
  try {
    return JSON.parse(localStorage.getItem("sh_screenReader") ?? "false");
  } catch {
    return false;
  }
}

export default function Friends() {
  const [submissions, setSubmissions] = useState<Submission[]>(() =>
    getFeedSubmissions()
  );

  // Re-sync when navigating back from camera
  useEffect(() => {
    const refresh = () => setSubmissions(getFeedSubmissions());
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  // Announce the page when screen reader is on
  useEffect(() => {
    if (!isScreenReaderOn()) return;
    speakText(
      `Friends feed. ${submissions.length} photo${submissions.length !== 1 ? "s" : ""} from your friends today.`
    );
    return () => stopSpeaking();
  }, [submissions.length]);

  return (
    <main className="min-h-screen px-4 pb-24 pt-6">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-2xl font-bold text-foreground"
      >
        Friends
      </motion.h1>

      <div className="mx-auto flex max-w-lg flex-col gap-5">
        {submissions.map((sub, i) => (
          <FriendPost key={sub.id} submission={sub} index={i} />
        ))}
      </div>
    </main>
  );
}