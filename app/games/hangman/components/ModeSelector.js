"use client";
import {
  Globe,
  Users,
  Lock,
  Coins,
  Flame,
  Trophy,
  ChevronRight,
  Swords,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { calculateLevel, calculateProgress, getNextRank } from "../lib/progression";

export default function ModeSelector({ onSelect, profile, requirements }) {
  const isXPLocked = profile.xp < requirements.MIN_XP;
  const isCoinLocked = profile.papaPoints < requirements.MIN_COINS;
  const isLocked = isXPLocked || isCoinLocked;

  return (
    <div className="w-full mx-auto animate-in fade-in zoom-in duration-700">
      {/* Minimalist Header */}
      <div className="text-center mb-4">
        <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-gray-900 dark:text-white leading-none">
          Hang<span className="text-[#75c32c]">Man</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 max-w-5xl mx-auto">
        {/* ENDLESS CLASSIC MODE */}
        {/* <button
          onClick={() => onSelect("classic")}
          className="group relative p-8 rounded-[2rem] bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 border-2 border-transparent hover:border-[#75c32c] transition-all duration-500 text-left flex flex-col h-full shadow-sm hover:shadow-2xl hover:-translate-y-1"
        >
          {profile.highestStreak > 0 && (
            <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 bg-orange-500 text-white rounded-full shadow-lg shadow-orange-500/20">
              <Flame size={12} fill="currentColor" />
              <span className="text-[10px] font-black">
                {profile.highestStreak}
              </span>
            </div>
          )}

          <div className="mb-8">
            <div className="w-14 h-14 bg-[#75c32c]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <Coffee className="text-[#75c32c]" size={30} strokeWidth={2.5} />
            </div>
            <h3 className="font-black text-2xl text-gray-900 dark:text-white uppercase tracking-tighter">
              Classic Run
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest mt-2 leading-relaxed">
              Infinite words. <br />
              One life.{" "}
              <span className="text-[#75c32c] font-black">Build a legacy.</span>
            </p>
          </div>

          <div className="mt-auto flex items-center gap-2 text-[#75c32c] font-black text-[10px] uppercase tracking-[0.2em]">
            Quick Play{" "}
            <ChevronRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </div>
        </button> */}

        {/* DAILY CHALLENGE MODE */}
        {/* <Link href="/games/hangman/daily" className="block h-full">
          <button className="w-full group relative p-8 rounded-[2rem] bg-zinc-900 hover:bg-black border-2 border-transparent hover:border-amber-400 transition-all duration-500 text-left flex flex-col h-full shadow-xl hover:-translate-y-1 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-colors duration-500" />

            <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-black rounded-full shadow-lg">
              <span className="text-[9px] font-black uppercase tracking-tighter">
                New Word
              </span>
            </div>

            <div className="mb-8 relative z-10">
              <div className="w-14 h-14 bg-amber-400/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                <CalendarDays
                  className="text-amber-400"
                  size={30}
                  strokeWidth={2.5}
                />
              </div>
              <h3 className="font-black text-2xl text-white uppercase tracking-tighter">
                Daily Mode
              </h3>
              <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-widest mt-2 leading-relaxed">
                One word. One chance. <br />
                <span className="text-amber-400 font-black">
                  Level 6+ Difficulty.
                </span>
              </p>
            </div>

            <div className="mt-auto flex items-center gap-2 text-amber-400 font-black text-[10px] uppercase tracking-[0.2em] relative z-10">
              Enter Challenge{" "}
              <ChevronRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </button>
        </Link> */}

        {/* ENDLESS RUN MODE */}
        <button
          onClick={() => onSelect("endless")}
          className="group relative p-4 md:p-5 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 border-2 border-transparent hover:border-red-500 transition-all duration-300 text-left flex flex-col shadow-sm hover:shadow-lg"
        >
          {/* Best Session Badge */}
          {profile.highestEndlessRun > 0 ? (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded-full shadow-md shadow-red-500/20">
              <Flame size={9} fill="currentColor" />
              <span className="text-[9px] font-black">Best: {profile.highestEndlessRun}</span>
            </div>
          ) : (
            <div className="absolute top-3 right-3 px-2 py-0.5 bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 rounded-full">
              <span className="text-[8px] font-black uppercase tracking-wider">New</span>
            </div>
          )}

          <div className="mb-3">
            <div className="w-14 h-14 bg-red-500/10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Flame className="text-red-500" size={20} />
            </div>
            <h3 className="font-black text-2xl uppercase tracking-tighter">
              Endless Run
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 uppercase leading-tight">
              How long can you last?
            </p>
          </div>

          {/* Endless XP stat */}
          <div className="mt-auto pt-4 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">XP</span>
            <span className="text-[11px] font-black text-red-500">{(profile.endlessXP || 0).toLocaleString()}</span>
          </div>
        </button>

        {/* JOURNEY MODE */}
        <button
          onClick={() => onSelect("journey")}
          className="group relative p-4 md:p-5 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-800/40 dark:hover:to-blue-800/40 border-2 border-transparent hover:border-purple-400 transition-all duration-300 text-left flex flex-col shadow-sm hover:shadow-lg"
        >
          {/* Rank Badge */}
          {(() => {
            const rank = calculateLevel(profile.xp || 0);
            return (
              <div
                className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full shadow-sm"
                style={{ backgroundColor: rank.color + "22", color: rank.color }}
              >
                <span className="text-[10px] font-black uppercase tracking-widest">{rank.name}</span>
              </div>
            );
          })()}

          <div className="mb-3">
            <div className="w-14 h-14 bg-purple-500/10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Trophy className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
            <h3 className="font-black text-2xl uppercase tracking-tighter">
              Journey Mode
            </h3>
            <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1 uppercase leading-tight">
              Progress through 8 ranks
            </p>
          </div>

          {/* XP Progress toward next rank */}
          {(() => {
            const progress = calculateProgress(profile.xp || 0);
            const nextRank = getNextRank(profile.xp || 0);
            const currentRank = calculateLevel(profile.xp || 0);
            return (
              <div className="mt-auto pt-4 border-t border-purple-100 dark:border-purple-900/50 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                    {nextRank ? `→ ${nextRank.name}` : "Max"}
                  </span>
                  <span className="text-[10px] font-black" style={{ color: currentRank.color }}>{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-purple-100 dark:bg-purple-900/40 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${progress}%`, backgroundColor: currentRank.color }}
                  />
                </div>
              </div>
            );
          })()}
        </button>

        {/* CLASH 1v1 ARENA DUEL */}
        <button
          onClick={() => !isLocked ? onSelect("online") : null}
          className={`group relative p-4 md:p-5 rounded-xl border-2 transition-all duration-300 text-left flex flex-col shadow-sm hover:shadow-lg ${
            isLocked
              ? "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 opacity-70 cursor-not-allowed"
              : "bg-gradient-to-br from-blue-500/10 via-fuchsia-500/10 to-purple-600/15 dark:from-blue-900/30 dark:via-fuchsia-900/30 dark:to-purple-900/40 border-fuchsia-400/40 hover:border-fuchsia-500 hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer"
          }`}
        >
          {/* Header Status Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1">
            {profile.onlineWinStreak > 0 && !isLocked && (
              <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-black shadow-sm">
                <Flame size={10} fill="currentColor" /> {profile.onlineWinStreak} Streak
              </span>
            )}
            <span
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                isLocked
                  ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
                  : "bg-fuchsia-500 text-white shadow-sm shadow-fuchsia-500/40 animate-pulse"
              }`}
            >
              {isLocked ? <Lock size={9} /> : <Zap size={9} className="fill-white" />}
              {isLocked ? "Locked" : "Live Duel"}
            </span>
          </div>

          <div className="mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-fuchsia-600 rounded-lg flex items-center justify-center mb-3 text-white shadow-md shadow-fuchsia-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <Swords size={22} />
            </div>
            <h3 className="font-black text-2xl uppercase tracking-tighter text-zinc-900 dark:text-white">
              1v1 Arena
            </h3>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 uppercase leading-tight">
              Clash Duel with Elixir & Spells
            </p>
          </div>

          {/* Stakes / Requirements */}
          <div className="mt-auto pt-4 border-t border-fuchsia-200/50 dark:border-fuchsia-900/40 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
              Entry
            </span>
            <span className="text-[11px] font-black text-amber-500 flex items-center gap-1">
              <Coins size={12} className="fill-amber-500" />
              {requirements?.MIN_COINS || 10} Coins
            </span>
          </div>
        </button>
      </div>

      {/* Footer Stats */}
      {/* <div className="mt-10 flex items-center justify-center gap-8 border-t border-gray-100 dark:border-gray-800 pt-8 opacity-60">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 tracking-widest">
          <Users size={14} className="text-blue-500" />
          <span>2.4k Online</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 tracking-widest">
          <Trophy size={14} className="text-amber-500" />
          <span>Season 1 Ends in 4d</span>
        </div>
      </div> */}
    </div>
  );
}
