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
      className={`w-full flex flex-col gap-1 select-none px-1 transition-transform duration-100 ${
        isShaking ? "animate-pulse ring-1 ring-red-500 rounded-lg p-0.5" : ""
      }`}
    >
      {/* Top Info Header */}
      <div className="flex items-center justify-between text-[10px] font-bold">
        <div className="flex items-center gap-1 text-fuchsia-300">
          <Droplets size={11} className="fill-fuchsia-400 text-fuchsia-400" />
          <span className="font-mono tabular-nums text-fuchsia-200">{displayVal}</span>
          <span className="text-zinc-500 font-mono">/ 10 Elixir</span>
        </div>

        {isSuddenDeath && (
          <span className="flex items-center gap-0.5 text-[9px] font-mono text-amber-300 font-bold">
            <Zap size={9} className="fill-amber-300" /> 2X Speed
          </span>
        )}
      </div>

      {/* Sleek Slim Bar */}
      <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 transition-all duration-150 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
