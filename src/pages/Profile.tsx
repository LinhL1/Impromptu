import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { currentUser, friends } from "@/lib/mock-data";
import ProfilePhotoEditor from "@/components/ProfilePhotoEditor";

interface SubmissionRecord {
  id: string;
  photoUrl: string;
  altText: string;
  createdAt: Date;
}

function calcStreak(submissions: SubmissionRecord[]): number {
  if (submissions.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const submissionDays = new Set(
    submissions.map((s) => {
      const d = new Date(s.createdAt);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
  );

  const DAY_MS = 1000 * 60 * 60 * 24;
  let streak = 0;
  let checkDay = today.getTime();
  while (submissionDays.has(checkDay)) {
    streak++;
    checkDay -= DAY_MS;
  }
  return streak;
}

export default function Profile() {
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const q = query(
          collection(db, "submissions"),
          where("userId", "==", currentUser.id)
        );
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            photoUrl: data.photoUrl ?? "",
            altText: data.altText ?? "",
            createdAt:
              data.createdAt instanceof Timestamp
                ? data.createdAt.toDate()
                : new Date(data.createdAt),
          };
        }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setSubmissions(docs);
      } catch (err) {
        console.error("Failed to load submissions from Firestore:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();

    // Re-fetch when a new photo is submitted in the same session
    window.addEventListener("sh:submission_added", loadStats);
    return () => window.removeEventListener("sh:submission_added", loadStats);
  }, []);

  const totalPhotos = submissions.length;
  const streak = calcStreak(submissions);

  return (
    <main className="min-h-screen px-6 pb-24 pt-8">
      <div className="mx-auto max-w-sm">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <button
            onClick={() => navigate("/settings")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring outline-none"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </button>
        </motion.div>

        {/* User card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center gap-4 rounded-2xl bg-card p-6 shadow-card"
        >
          <ProfilePhotoEditor currentAvatar={avatar} onAvatarChange={setAvatar} />
          <div className="text-center">
            <h2 className="text-lg font-bold text-foreground">{currentUser.name}</h2>
            <p className="text-sm text-muted-foreground">Joined the hunt</p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 grid grid-cols-3 gap-3"
        >
          {[
            {
              label: "Streak",
              value: loading ? "—" : streak > 0 ? `${streak}🔥` : "0",
              title: `${streak} day streak`,
            },
            {
              label: "Photos",
              value: loading ? "—" : String(totalPhotos),
              title: `${totalPhotos} photos submitted`,
            },
            {
              label: "Friends",
              value: String(friends.length),
              title: `${friends.length} friends`,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              title={stat.title}
              className="flex flex-col items-center rounded-xl bg-card p-4 shadow-card"
            >
              <span className="text-xl font-bold text-foreground">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Recent submissions */}
        {!loading && totalPhotos > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-6"
          >
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Your recent photos
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {submissions.slice(0, 6).map((sub) => (
                <div
                  key={sub.id}
                  className="aspect-square overflow-hidden rounded-xl shadow-card"
                >
                  <img
                    src={sub.photoUrl}
                    alt={sub.altText}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Friends list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Your friends
          </h3>
          <div className="space-y-3">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center gap-3 rounded-xl bg-card px-4 py-3 shadow-card"
              >
                <img
                  src={friend.avatar}
                  alt={`${friend.name}'s avatar`}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <span className="flex-1 text-sm font-medium text-foreground">
                  {friend.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </main>
  );
}