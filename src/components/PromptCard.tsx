import { motion } from "framer-motion";

interface PromptCardProps {
  prompt: string;
  loading?: boolean;
}

export default function PromptCard({ prompt, loading }: PromptCardProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <div className="h-4 w-24 rounded-full bg-muted animate-pulse-soft" />
        <div className="h-10 w-48 rounded-2xl bg-muted animate-pulse-soft" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="flex flex-col items-center gap-2"
    >
      <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Today's prompt
      </span>
      <motion.h1
        className="text-4xl font-extrabold tracking-tight text-foreground"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 25 }}
      >
        {prompt}
      </motion.h1>
    </motion.div>
  );
}
