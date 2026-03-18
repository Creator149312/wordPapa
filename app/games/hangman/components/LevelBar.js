"use client";
import { useMemo } from "react";
import { calculateLevel, getNextRank, calculateProgress } from "../lib/progression";
import { Zap } from "lucide-react";
import { useProfile } from "../../../ProfileContext";

export default function LevelBar() {
  const { profile } = useProfile();
  const { xp } = profile;

  const currentRank = useMemo(() => calculateLevel(xp), [xp]);
  const nextRank = useMemo(() => getNextRank(xp), [xp]);
  const progress = useMemo(() => calculateProgress(xp), [xp]);

  const isMaxLevel = !nextRank;
  // This color is the source of truth for the entire page's UI theme
  const brandColor = currentRank.color || "#75c32c";

  return (
    <div className="w-full animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="relative bg-white dark:bg-zinc-900 border-[3px] border-zinc-900 dark:border-zinc-100 rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-colors duration-1000">

        {/* The Progress Fill - Smooth color transition */}
        <div
          className="absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-in-out z-20"
          style={{
            width: `${isMaxLevel ? 100 : progress}%`,
            backgroundColor: brandColor,
          }}
        />

        <div className="flex items-center justify-between px-3 py-2 relative z-10">

          <div className="flex items-center gap-3">
            {/* Level Square with Sweep Transition */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-white italic transition-colors duration-1000"
              style={{ backgroundColor: brandColor }}
            >
              {currentRank.level || 1}
            </div>

            <div className="flex flex-col">
              <span className="text-[11px] font-black uppercase tracking-tighter text-zinc-900 dark:text-zinc-100 leading-none">
                {currentRank.name}
              </span>
              <span className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 tabular-nums mt-1 uppercase">
                {isMaxLevel ? "Maxed Out" : `${xp.toLocaleString()} XP`}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1">
              <Zap size={10} style={{ color: brandColor }} fill="currentColor" className="animate-pulse transition-colors duration-1000" />
              <p className="text-sm font-black text-zinc-900 dark:text-zinc-100 italic">
                {progress}%
              </p>
            </div>
            {!isMaxLevel && (
              <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mt-1">
                Next Rank at {nextRank.minXP.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}