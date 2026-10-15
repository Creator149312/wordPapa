"use client";
import React from "react";
import { Zap, Droplets } from "lucide-react";

export default function ElixirBar({
  elixir = 5,
  maxElixir = 10,
  isSuddenDeath = false,
  isShaking = false,
}) {
  const percentage = Math.min(100, Math.max(0, (elixir / maxElixir) * 100));
  const displayVal = Math.min(maxElixir, Math.max(0, elixir)).toFixed(1);
  const isFull = elixir >= maxElixir;

  return (
    <div
      className={`w-full max-w-2xl mx-auto my-2 p-2.5 rounded-2xl bg-zinc-900/90 dark:bg-black/90 border border-fuchsia-900/40 shadow-lg backdrop-blur-sm transition-transform duration-100 ${
        isShaking ? "animate-bounce ring-2 ring-red-500 scale-[0.99]" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-1.5 px-1">
        {/* Left: Elixir Label with Icon */}
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center shadow-sm shadow-fuchsia-500/50">
            <Droplets size={14} className="text-white fill-white animate-pulse" />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-fuchsia-300">
            Elixir
          </span>
          {isFull && (
            <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-fuchsia-500/30 text-fuchsia-200 border border-fuchsia-400/40 animate-pulse">
              MAX
            </span>
          )}
        </div>

        {/* Center: Sudden Death Indicator */}
        {isSuddenDeath && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[10px] font-black uppercase tracking-widest animate-pulse">
            <Zap size={12} className="fill-amber-300" />
            2X Elixir Boost!
          </div>
        )}

        {/* Right: Numeric Display */}
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-black text-fuchsia-100 tabular-nums">
            {displayVal}
          </span>
          <span className="text-xs font-bold text-fuchsia-400/70">
            /{maxElixir}
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="relative h-4 w-full bg-zinc-950 rounded-xl overflow-hidden border border-fuchsia-950/60 p-0.5">
        {/* Fluid Fill */}
        <div
          className="h-full rounded-lg bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 transition-all duration-150 ease-out relative shadow-[0_0_12px_rgba(217,70,239,0.5)]"
          style={{ width: `${percentage}%` }}
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-[shimmer_2s_infinite]" />
        </div>

        {/* Tick separators for each Elixir point (1 to 9) */}
        <div className="absolute inset-0 flex justify-between pointer-events-none px-0.5">
          {Array.from({ length: maxElixir - 1 }).map((_, i) => (
            <div
              key={i}
              className="h-full w-[1px] bg-black/40 z-10"
              style={{ left: `${((i + 1) / maxElixir) * 100}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
