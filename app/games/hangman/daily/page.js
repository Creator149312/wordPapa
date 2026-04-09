"use client";

import { useState, useEffect } from "react";
import { useProfile } from "../../../ProfileContext";
import { getDailyTheme, getTimeUntilNextDay } from "../lib/daily";
import { Card } from "@/components/ui/card";
import { Timer, ChevronLeft, Trophy, Share2, Check, Users, Zap, Map } from "lucide-react";
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
    const dailyData = getDailyTheme();
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

    const wonCount = gameStats.wonCount ?? (gameStats.won ? 1 : 0);
    const shareBody =
      `Wordpapa Daily #${meta.dayNumber}\n` +
      `${gameStats.grid}\n` +
      `${wonCount}/${5} words · Streak: ${gameStats.newStreak ?? 0} 🔥\n\n` +
      `Can you find today's theme?\n` +
      `${window.location.origin}/games/hangman/daily`;

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
            {(gameStats?.wonCount ?? 0) === 5 ? "Full Clear!" : (gameStats?.wonCount ?? 0) > 0 ? "Well Played!" : "Try Tomorrow!"}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
            {(gameStats?.wonCount ?? 0) === 5
              ? `You solved all 5! Theme: ${meta?.theme?.theme} ${meta?.theme?.emoji}`
              : (gameStats?.wonCount ?? 0) > 0
              ? `You solved ${gameStats.wonCount}/5. Theme: ${meta?.theme?.theme} ${meta?.theme?.emoji}`
              : "A tough set. New theme tomorrow!"}
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

          {/* Play more CTA */}
          <div className="mt-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center mb-3">
              Keep Playing
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => (window.location.href = "/games/hangman?mode=endless")}
                className="flex flex-col items-center gap-1 py-4 px-3 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-2xl border border-zinc-200 dark:border-zinc-700 transition-all"
              >
                <Zap size={20} className="text-amber-500" />
                <span className="text-xs font-black uppercase text-zinc-700 dark:text-zinc-200">Endless Run</span>
                <span className="text-[10px] text-zinc-400">How long can you last?</span>
              </button>
              <button
                onClick={() => (window.location.href = "/games/hangman?mode=journey")}
                className="flex flex-col items-center gap-1 py-4 px-3 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-2xl border border-zinc-200 dark:border-zinc-700 transition-all"
              >
                <Map size={20} className="text-blue-500" />
                <span className="text-xs font-black uppercase text-zinc-700 dark:text-zinc-200">Journey</span>
                <span className="text-[10px] text-zinc-400">Level-by-level story</span>
              </button>
            </div>
          </div>

          <button
            onClick={() => (window.location.href = "/games/hangman")}
            className="mt-4 flex items-center justify-center gap-2 w-full text-xs font-bold text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
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
          dailyWords={meta.theme.words}
          themeName={meta.theme.theme}
          themeEmoji={meta.theme.emoji}
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
