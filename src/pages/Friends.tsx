import { motion } from "framer-motion";
import { mockFeedSubmissions } from "@/lib/mock-data";
import FriendPost from "@/components/FriendPost";

export default function Friends() {
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
        {mockFeedSubmissions.map((sub, i) => (
          <FriendPost key={sub.id} submission={sub} index={i} />
        ))}
      </div>
    </main>
  );
}
