import { motion } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SubmissionSuccessProps {
  feedback: string;
  photoUrl: string;
}

export default function SubmissionSuccess({ feedback, photoUrl }: SubmissionSuccessProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="flex flex-col items-center gap-6 text-center"
    >
      {/* Success icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 20 }}
        className="flex h-20 w-20 items-center justify-center rounded-full gradient-warm shadow-soft"
      >
        <Heart className="h-9 w-9 text-primary-foreground" fill="currentColor" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="space-y-2"
      >
        <h2 className="text-2xl font-bold text-foreground">Shared!</h2>
        <p className="text-sm text-muted-foreground">Your friends will love this</p>
      </motion.div>

      {/* Photo thumbnail */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="h-32 w-32 overflow-hidden rounded-2xl shadow-card"
      >
        <img src={photoUrl} alt="Your shared photo" className="h-full w-full object-cover" />
      </motion.div>

      {/* AI feedback */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="max-w-xs rounded-2xl bg-secondary px-5 py-4"
      >
        <p className="text-sm italic text-secondary-foreground">{feedback}</p>
      </motion.div>

      {/* View feed */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate("/friends")}
        className="flex items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-medium text-background focus-visible:ring-2 focus-visible:ring-ring outline-none"
      >
        See friends' photos
        <ArrowRight className="h-4 w-4" />
      </motion.button>
    </motion.div>
  );
}
