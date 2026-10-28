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
    <div className="w-full flex items-center justify-between px-1 py-1 select-none">
      {/* Left: Minimal Quit Button */}
      <button
        onClick={onQuit}
        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-all border border-zinc-800 text-[10px] font-bold"
      >
        <ArrowLeft size={12} />
        <span>Quit</span>
      </button>

      {/* Center: Arena Category Tag */}
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-tight truncate max-w-[120px]">
          {category}
        </span>
      </div>

      {/* Right: Minimal Timer */}
      <div
        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-mono font-bold transition-all ${
          isOvertime
            ? "bg-fuchsia-950/60 border-fuchsia-500 text-fuchsia-300 animate-pulse"
            : isSuddenDeath
            ? "bg-amber-950/40 border-amber-500/50 text-amber-300"
            : "bg-zinc-900/80 border-zinc-800 text-zinc-200"
        }`}
      >
        {isOvertime ? (
          <Zap size={11} className="fill-fuchsia-300 text-fuchsia-300" />
        ) : isSuddenDeath ? (
          <Zap size={11} className="fill-amber-300 text-amber-300" />
        ) : (
          <Clock size={11} className="text-zinc-400" />
        )}
        <span className="tabular-nums">
          {isOvertime ? `+${seconds}` : `${minutes}:${seconds}`}
        </span>
      </div>
    </div>
  );
}
