"use client";
import React from "react";
import { ArrowLeft, Clock, Zap } from "lucide-react";

export default function ClashArenaHeader({
  timeLeft = 90,
  onQuit,
  isSuddenDeath = false,
  isOvertime = false,
  category = "General",
  currentArena,
}) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="w-full flex items-center justify-between px-2 py-1 select-none">
      {/* Left: Compact Back / Surrender Button */}
      <button
        onClick={onQuit}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 active:scale-95 text-zinc-300 hover:text-white transition-all border border-zinc-700/50 shadow-sm"
      >
        <ArrowLeft size={14} />
        <span className="text-[10px] font-black uppercase tracking-wider">Leave</span>
      </button>

      {/* Center: Arena Category Pill */}
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-wider text-zinc-300">
          {category}
        </span>
      </div>

      {/* Right: Clash Timer Pill */}
      <div
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
          isOvertime
            ? "bg-fuchsia-600/30 border-fuchsia-400 text-fuchsia-200 animate-pulse shadow-[0_0_15px_rgba(217,70,239,0.4)]"
            : isSuddenDeath
            ? "bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse shadow-[0_0_12px_rgba(251,191,36,0.3)]"
            : "bg-zinc-900/90 border-zinc-800 text-white"
        }`}
      >
        {isOvertime ? (
          <Zap size={13} className="fill-fuchsia-300 text-fuchsia-300 animate-bounce" />
        ) : isSuddenDeath ? (
          <Zap size={13} className="fill-amber-300 text-amber-300" />
        ) : (
          <Clock size={13} className="text-zinc-400" />
        )}
        <span className="text-xs font-black tabular-nums tracking-wider">
          {isOvertime ? `+${seconds}` : `${minutes}:${seconds}`}
        </span>
      </div>
    </div>
  );
}
