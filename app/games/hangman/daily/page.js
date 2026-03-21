"use client";

import { useState, useEffect } from "react";
import { useProfile } from "../../../ProfileContext";
import { getDailyMetadata, getTimeUntilNextDay } from "../lib/daily";
import { Card } from "@/components/ui/card";
import { Timer, ChevronLeft, Trophy, Share2, Check, Users } from "lucide-react";
import DailyMode from "../modes/DailyMode";
import LevelBar from "../components/LevelBar";

export default function DailyChallengePage() {
  const { profile, syncToDatabase, addDailyRewards } = useProfile();
  const [meta, setMeta] = useState(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [copied, setCopied] = useState(false);
  const [gameStats, setGameStats] = useState(null);

  // Initialize Game Data
  useEffect(() => {
    const dailyData = getDailyMetadata();
    setMeta(dailyData);

    // Check if player already finished today and load their result grid
    const savedStats = localStorage.getItem(`daily_stats_${dailyData.dateKey}`);
    if (savedStats) {
      setHasPlayed(true);
      setGameStats(JSON.parse(savedStats));
    }

    const timer = setInterval(() => {
      const { formatted, isNewDay } = getTimeUntilNextDay();
      if (isNewDay) window.location.reload();
      setTimeLeft(formatted);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /**
   * Called by DailyMode when the game ends.
   * Receives stats like { won, attempts, maxAttempts, grid }
   */
  const handleDailyComplete = (stats) => {
    if (meta) {
      localStorage.setItem(`daily_${meta.dateKey}`, "true");
      localStorage.setItem(
        `daily_stats_${meta.dateKey}`,
        JSON.stringify(stats),
      );
      setGameStats(stats);
      setHasPlayed(true);
    }
  };

  /**
   * Handles sharing the result using Web Share API or Clipboard
   */
  const handleShare = async () => {
    if (!gameStats || !meta) return;

    const shareBody =
      `Hangman Arcade #${meta.dayNumber}\n` +
      `Result: ${gameStats.won ? "🏆 SOLVED" : "❌ FAILED"}\n` +
      `Mistakes: ${gameStats.attempts}/${gameStats.maxAttempts}\n` +
      `${gameStats.grid}\n\n` +
      `Play now: ${window.location.origin}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Hangman Arcade Daily",
          text: shareBody,
        });
      } catch (err) {
        console.log("Share cancelled or failed", err);
      }
    } else {
      // Fallback for desktop browsers
      await navigator.clipboard.writeText(shareBody);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 1. LOADING STATE
  if (!meta || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
          <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
        </div>
      </div>
    );
  }

  // 2. ALREADY PLAYED / RESULTS STATE
  if (hasPlayed) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 transition-colors">
        <Card className="max-w-md w-full p-8 text-center rounded-[2.5rem] shadow-2xl border-none bg-white dark:bg-zinc-900">
          <div className="mb-6 flex justify-center relative">
            <div className="p-5 bg-amber-100 dark:bg-amber-900/20 rounded-full">
              <Trophy
                className="text-amber-600 dark:text-amber-500 animate-bounce"
                size={40}
              />
            </div>
            <div className="absolute -top-2 -right-2 bg-zinc-900 text-white text-[10px] px-2 py-1 rounded-full font-bold">
              #{meta.dayNumber}
            </div>
          </div>

          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-zinc-800 dark:text-zinc-100">
            {gameStats?.won ? "Challenge Met!" : "Try Tomorrow!"}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
            {gameStats?.won
              ? "You've conquered today's word."
              : "That was a tough one. New word soon!"}
          </p>

          {/* STATS & LEADERBOARD BLOCK */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-3xl border border-zinc-200 dark:border-zinc-700">
              <Users size={18} className="mx-auto mb-2 text-blue-500" />
              <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                Solved Today
              </p>
              <p className="text-2xl font-black tabular-nums">1,429</p>
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-3xl border border-zinc-200 dark:border-zinc-700">
              <Timer size={18} className="mx-auto mb-2 text-[#75c32c]" />
              <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                Next Word
              </p>
              <p className="text-2xl font-black tabular-nums">
                {timeLeft || "00:00:00"}
              </p>
            </div>
          </div>

          {/* SHARE BUTTON */}
          <button
            onClick={handleShare}
            className="mt-6 w-full flex items-center justify-center gap-3 py-5 bg-[#75c32c] hover:bg-[#6ab127] text-black font-black uppercase italic rounded-2xl shadow-[0_5px_0_0_#4d821c] active:translate-y-1 active:shadow-none transition-all"
          >
            {copied ? <Check size={20} /> : <Share2 size={20} />}
            {copied ? "Copied to Clipboard!" : "Share Results"}
          </button>

          <button
            onClick={() => (window.location.href = "/games/hangman")}
            className="mt-8 flex items-center justify-center gap-2 w-full text-xs font-bold text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            <ChevronLeft size={16} /> Back to Main Menu
          </button>
        </Card>
      </div>
    );
  }

  // 3. ACTIVE GAME STATE
  return (
    <div className="min-h-screen p-2 md:p-6 bg-white dark:bg-zinc-950">
      <div className="max-w-5xl mx-auto mb-4">
        <LevelBar />
      </div>

      <main className="max-w-5xl w-full mx-auto">
        <DailyMode
          dailyWord={meta.wordObj}
          dayNumber={meta.dayNumber}
          profile={profile}
          onDailyComplete={handleDailyComplete}
          syncToDatabase={syncToDatabase}
          addDailyRewards={addDailyRewards}
        />
      </main>
    </div>
  );
}
