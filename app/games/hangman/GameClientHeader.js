"use client";
import { GraduationCap, Flame, Coins, Heart } from "lucide-react";
import { useProfile } from "../../ProfileContext";

export default function GameClientHeader() {
  const { profile } = useProfile();
  // Destructure for cleaner access
  const { papaPoints = 0, highestStreak = 0, lives = 0 } = profile;

  return (
    <nav className="relative w-full max-w-6xl mx-auto px-4 py-3 flex justify-between items-center bg-transparent">
      {/* BRAND SECTION */}
      <div className="flex items-center gap-2 group cursor-pointer">
        <div className="bg-[#75c32c] p-1.5 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:-translate-y-0.5">
          <GraduationCap className="text-black w-5 h-5" />
        </div>
        <span className="hidden sm:block font-black tracking-tighter text-lg dark:text-white uppercase italic">
          HangMan <span className="text-[#75c32c]">Arcade</span>
        </span>
      </div>

      {/* STATS CAPSULE */}
      <div className="flex items-center gap-5 bg-white/5 dark:bg-zinc-900/40 px-5 py-2 rounded-2xl backdrop-blur-sm border border-white/10">
        {/* Lives - Vital for knowing when a Revive might be needed */}
        <div className="flex items-center gap-1.5">
          <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
          <span className="text-sm font-black dark:text-white">{lives}</span>
        </div>

        {/* Global Streak - The "All Time" Pride stat */}
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          <span className="text-sm font-black dark:text-white">
            {highestStreak.toLocaleString()}
          </span>
        </div>

        {/* Papa Points - Essential for buying Shatters/Revives */}
        <div className="flex items-center gap-1.5">
          <div className="p-0.5 bg-yellow-400/10 rounded-md">
            <Coins className="w-4 h-4 text-yellow-400 fill-yellow-400/20" />
          </div>
          <span className="text-sm font-black dark:text-white">
            {papaPoints.toLocaleString()}
          </span>
        </div>
      </div>
    </nav>
  );
}
