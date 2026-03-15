"use client";
import { GraduationCap, Flame, Coins, Heart } from "lucide-react";
import { useProfile } from "../../ProfileContext";

export default function GameClientHeader() {
  const { profile } = useProfile();
  const { papaPoints, highestStreak, lives } = profile;

  return (
    <nav className="relative w-full max-w-6xl mx-auto px-4 py-2 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="bg-[#75c32c] p-1.5 rounded-lg">
          <GraduationCap className="text-black w-5 h-5" />
        </div>
        {/* Change 1: Text hidden on mobile, visible from md upwards */}
        <span className="hidden md:block font-black tracking-tighter text-xl dark:text-white uppercase">
          HangMan
        </span>
      </div>

      {/* Change 2: Removed border and shadow-lg from the container */}
      <div className="flex items-center gap-4 bg-white/5 dark:bg-zinc-900/50 px-4 py-2 rounded-full backdrop-blur-md">
        {/* Lives */}
        <div className="flex items-center gap-1.5  border-zinc-200 dark:border-zinc-700 pr-3">
          <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
          <span className="text-sm font-bold dark:text-white">{lives}</span>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-1.5 border-zinc-200 dark:border-zinc-700 pr-3">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          <span className="text-sm font-bold dark:text-white">
            {highestStreak.toLocaleString()}
          </span>
        </div>

        {/* Points */}
        <div className="flex items-center gap-1.5">
          <Coins className="w-4 h-4 text-yellow-400 fill-yellow-400/20" />
          <span className="text-sm font-bold dark:text-white">
            {papaPoints.toLocaleString()}
          </span>
        </div>
      </div>
    </nav>
  );
}