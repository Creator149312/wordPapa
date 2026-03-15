"use client";

import { useState, useEffect } from "react";
// Import the hook
import { useProfile } from "../../../ProfileContext";
import { getDailyMetadata } from "../lib/daily";
import { Card } from "@/components/ui/card";
import { Lock, Timer } from "lucide-react";
import DailyMode from "../modes/DailyMode";
import LevelBar from "../components/LevelBar";

export default function DailyChallengePage() {
  // 1. Initialize the profile hook to get access to the missing variables
  const { profile, syncToDatabase, addDailyRewards } = useProfile();

  const [meta, setMeta] = useState(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const dailyData = getDailyMetadata();
    setMeta(dailyData);

    const played = localStorage.getItem(`daily_${dailyData.dateKey}`);
    if (played) setHasPlayed(true);

    const timer = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0);

      const diff = tomorrow - now;

      if (diff <= 0) {
        window.location.reload();
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleDailyComplete = () => {
    if (meta) {
      localStorage.setItem(`daily_${meta.dateKey}`, "true");
      setHasPlayed(true);
    }
  };

  // Important: Check if profile is loaded to avoid "undefined" errors during initial render
  if (!meta || !profile) return null;

  if (hasPlayed) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 transition-colors">
        <Card className="max-w-md w-full p-8 text-center rounded-[2.5rem] shadow-2xl border-none bg-white dark:bg-zinc-900">
          <div className="mb-6 flex justify-center">
            <div className="p-5 bg-amber-100 dark:bg-amber-900/20 rounded-full animate-bounce">
              <Lock className="text-amber-600 dark:text-amber-500" size={40} />
            </div>
          </div>

          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-zinc-800 dark:text-zinc-100">
            See you tomorrow!
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
            You've successfully completed Daily #{meta.dayNumber}.
          </p>

          <div className="mt-8 p-6 bg-zinc-100 dark:bg-zinc-800/50 rounded-[2rem] border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Timer size={14} className="text-zinc-400" />
              <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                Next Word In
              </p>
            </div>
            <p className="text-4xl font-mono font-black text-[#75c32c] drop-shadow-sm">
              {timeLeft || "00:00:00"}
            </p>
          </div>

          <button
            onClick={() => (window.location.href = "/games/hangman")}
            className="mt-8 text-sm font-bold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
          >
            ← Back to Main Menu
          </button>
        </Card>
      </div>
    );
  }

  return (
    // <HangmanGame
    //   initialMode="daily"
    //   dailyWord={meta.wordObj}
    //   onDailyComplete={handleDailyComplete}
    // />
    // inside return of DailyChallengePage

    <div className="min-h-screen p-1 md:p-4 bg-white dark:bg-zinc-950">
      <div className="max-w-5xl mx-auto mb-2">
        <LevelBar />
      </div>
      <Card className="max-w-5xl w-full mx-auto p-3 md:p-6 rounded-[2rem] bg-zinc-50/50 dark:bg-zinc-900/40 border-none">
        <DailyMode
          dailyWord={meta.wordObj}
          profile={profile}
          onDailyComplete={handleDailyComplete}
          syncToDatabase={syncToDatabase}
          addDailyRewards={addDailyRewards}
        />
      </Card>
    </div>
  );
}
