"use client";
import React from "react";
import { Droplets, Zap } from "lucide-react";

export default function ClashElixirBar({
  elixir = 5,
  maxElixir = 10,
  isSuddenDeath = false,
  isShaking = false,
}) {
  const percentage = Math.min(100, Math.max(0, (elixir / maxElixir) * 100));
  const displayVal = Math.min(maxElixir, Math.max(0, elixir)).toFixed(1);

  return (
    <div
      className={`w-full flex items-center gap-2 select-none px-1 transition-transform duration-100 ${
        isShaking ? "animate-bounce ring-2 ring-red-500 rounded-xl" : ""
      }`}
    >
      {/* Hexagonal Droplet Icon / Elixir Count */}
      <div className="relative shrink-0 flex items-center justify-center">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-700 flex items-center justify-center shadow-md shadow-fuchsia-500/40 border border-fuchsia-300/40">
          <Droplets size={16} className="text-white fill-white" />
        </div>
        <span className="absolute -bottom-1 -right-1 px-1 rounded-full bg-black/90 text-fuchsia-200 text-[10px] font-black border border-fuchsia-500/50 tabular-nums">
          {displayVal}
        </span>
      </div>

      {/* Segmented Elixir Track */}
      <div className="flex-1 relative h-4 bg-zinc-950 rounded-xl overflow-hidden border border-fuchsia-950/80 p-0.5 shadow-inner">
        {/* Fluid Fill */}
        <div
          className="h-full rounded-lg bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 transition-all duration-150 ease-out relative shadow-[0_0_10px_rgba(217,70,239,0.5)]"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
        </div>

        {/* 10 Segment Markers */}
        <div className="absolute inset-0 flex justify-between pointer-events-none px-0.5">
          {Array.from({ length: maxElixir - 1 }).map((_, i) => (
            <div
              key={i}
              className="h-full w-[1px] bg-black/50 z-10"
              style={{ left: `${((i + 1) / maxElixir) * 100}%` }}
            />
          ))}
        </div>
      </div>

      {/* Sudden Death Pill */}
      {isSuddenDeath && (
        <span className="shrink-0 flex items-center gap-0.5 px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[9px] font-black uppercase tracking-wider animate-pulse">
          <Zap size={10} className="fill-amber-300" /> 2X
        </span>
      )}
    </div>
  );
}
