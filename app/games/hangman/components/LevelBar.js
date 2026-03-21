"use client";
import { useMemo } from "react";
import { Zap, Trophy, TrendingUp } from "lucide-react";
import { useProfile } from "../../../ProfileContext";
import { RANKS } from "../constants"; // Using your source of truth constants

export default function LevelBar() {
  const { profile } = useProfile();

  // Primary stat for Rank/Leveling in Endless Mode
  const xp = profile.highestEndlessXP || 0;

  // --- Logic for Rank Calculation ---
  const currentRank = useMemo(() => {
    return [...RANKS].reverse().find((r) => xp >= r.minXP) || RANKS[0];
  }, [xp]);

  const nextRank = useMemo(() => {
    return RANKS.find((r) => r.minXP > xp) || null;
  }, [xp]);

  const progress = useMemo(() => {
    if (!nextRank) return 100;
    const currentMin = currentRank.minXP;
    const nextMin = nextRank.minXP;
    const progressXP = xp - currentMin;
    const totalNeeded = nextMin - currentMin;
    return Math.min(Math.floor((progressXP / totalNeeded) * 100), 100);
  }, [xp, currentRank, nextRank]);

  const isMaxLevel = !nextRank;
  const brandColor = currentRank.color || "#75c32c";

  return (
    <div className="w-full animate-in fade-in slide-in-from-top-2 duration-500">
      {/* Container with dynamic shadow color based on rank */}
      <div className="relative bg-white dark:bg-zinc-900 border-[3px] border-zinc-900 dark:border-zinc-100 rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-colors duration-1000">
        {/* Progress Fill Track */}
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-zinc-100 dark:bg-zinc-800" />

        {/* The Progress Fill - Smooth color transition */}
        <div
          className="absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-in-out z-20"
          style={{
            width: `${progress}%`,
            backgroundColor: brandColor,
            boxShadow: `0px 0px 10px ${brandColor}44`,
          }}
        />

        <div className="flex items-center justify-between px-3 py-2.5 relative z-10">
          <div className="flex items-center gap-3">
            {/* Level Square with Sweep Transition */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-white italic transition-all duration-1000"
              style={{ backgroundColor: brandColor }}
            >
              {currentRank.level || 1}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-black uppercase tracking-tighter text-zinc-900 dark:text-zinc-100 leading-none">
                  {currentRank.name}
                </span>
                {progress > 80 && !isMaxLevel && (
                  <TrendingUp
                    size={10}
                    className="text-emerald-500 animate-bounce"
                  />
                )}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Trophy size={8} className="text-zinc-400" />
                <span className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 tabular-nums uppercase">
                  Best Run: {xp.toLocaleString()} XP
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1">
              <Zap
                size={10}
                style={{ color: brandColor }}
                fill="currentColor"
                className={`transition-colors duration-1000 ${progress > 0 ? "animate-pulse" : ""}`}
              />
              <p className="text-sm font-black text-zinc-900 dark:text-zinc-100 italic">
                {progress}%
              </p>
            </div>

            {!isMaxLevel ? (
              <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mt-1">
                Next: {nextRank.minXP.toLocaleString()}
              </p>
            ) : (
              <p className="text-[8px] font-black uppercase tracking-widest text-amber-500 mt-1">
                Ultimate Rank Achieved
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
