"use client";
import React from "react";
import { Shield, Snowflake, Heart } from "lucide-react";

export default function ClashOpponentStrip({
  opponent,
  totalLetters = 7,
  oppWrongCount = 0,
  maxWrong = 6,
  isShielded = false,
  isFrozen = false,
  freezeRemaining = 0,
}) {
  if (!opponent) return null;

  const oppProgress = opponent.progress || 0;
  const oppLives = Math.max(0, maxWrong - oppWrongCount);
  const oppInitial = (opponent.name?.[0] || "C").toUpperCase();
  const progressPercent = Math.min(100, Math.round((oppProgress / totalLetters) * 100));

  return (
    <div
      className={`w-full px-3 py-1.5 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 ${
        isFrozen
          ? "bg-sky-950/40 border-sky-500/50"
          : isShielded
          ? "bg-amber-950/30 border-amber-500/50"
          : "bg-zinc-900/60 border-zinc-800/80"
      }`}
    >
      {/* Left: Opponent Avatar, Name & Status */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="relative shrink-0">
          <div className="w-6 h-6 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200 font-black text-[10px]">
            {oppInitial}
          </div>
          {isFrozen && (
            <div className="absolute -bottom-0.5 -right-0.5 p-0.5 rounded-full bg-sky-500 text-white">
              <Snowflake size={8} />
            </div>
          )}
          {isShielded && !isFrozen && (
            <div className="absolute -bottom-0.5 -right-0.5 p-0.5 rounded-full bg-amber-500 text-white">
              <Shield size={8} className="fill-white" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 truncate">
          <span className="text-xs font-bold text-zinc-200 truncate max-w-[100px]">
            {opponent.name}
          </span>
          {isFrozen ? (
            <span className="text-[9px] font-bold text-sky-400 font-mono">
              ❄️ {freezeRemaining.toFixed(1)}s
            </span>
          ) : isShielded ? (
            <span className="text-[9px] font-bold text-amber-400">🛡️ Shield</span>
          ) : (
            <span className="text-[9px] text-zinc-400 font-mono">
              {oppProgress}/{totalLetters}
            </span>
          )}
        </div>
      </div>

      {/* Right: Progress bar & Hearts */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Subtle mini progress bar */}
        <div className="w-14 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-rose-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 6 Minimalist Heart Pips */}
        <div className="flex items-center gap-0.5">
          {Array.from({ length: maxWrong }).map((_, i) => (
            <Heart
              key={i}
              size={10}
              className={i < oppLives ? "text-rose-500 fill-rose-500" : "text-zinc-800 fill-zinc-800"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
