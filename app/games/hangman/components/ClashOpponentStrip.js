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

  return (
    <div
      className={`w-full p-2.5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
        isFrozen
          ? "bg-sky-950/50 border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.25)]"
          : isShielded
          ? "bg-amber-950/40 border-amber-400/80 shadow-[0_0_12px_rgba(251,191,36,0.2)]"
          : "bg-zinc-900/90 border-zinc-800/80 shadow-md"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        {/* Opponent Avatar & Identity */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-rose-500/30">
              {oppInitial}
            </div>
            {isFrozen && (
              <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-sky-500 text-white animate-spin">
                <Snowflake size={10} />
              </div>
            )}
            {isShielded && !isFrozen && (
              <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-amber-500 text-white animate-pulse">
                <Shield size={10} className="fill-white" />
              </div>
            )}
          </div>

          <div className="text-left truncate">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black uppercase tracking-tight text-white truncate max-w-[110px]">
                {opponent.name}
              </span>
              <span className={`text-[8px] font-black uppercase px-1 py-0.2 rounded border ${
                opponent.isBot 
                  ? "bg-zinc-800 text-zinc-300 border-zinc-700" 
                  : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
              }`}>
                {opponent.isBot ? "AI Bot" : "Live Player"}
              </span>
            </div>
            <p className="text-[9px] font-bold text-zinc-400">
              {isFrozen ? (
                <span className="text-sky-300 font-black animate-pulse">FROZEN ({freezeRemaining.toFixed(1)}s)</span>
              ) : isShielded ? (
                <span className="text-amber-300 font-black">SHIELD ACTIVE</span>
              ) : (
                `${oppProgress}/${totalLetters} solved`
              )}
            </p>
          </div>
        </div>

        {/* Lives Counter (Hearts) */}
        <div className="flex items-center gap-0.5 shrink-0">
          {Array.from({ length: maxWrong }).map((_, i) => {
            const hasLife = i < oppLives;
            return (
              <span key={i} className="transition-transform duration-200">
                {hasLife ? (
                  <Heart size={11} className="text-rose-500 fill-rose-500" />
                ) : (
                  <Heart size={11} className="text-zinc-700 fill-zinc-800 opacity-40" />
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* Opponent Word Progress Dots */}
      <div className="mt-2 pt-1.5 border-t border-zinc-800/80 flex items-center justify-center gap-1 overflow-x-auto">
        {Array.from({ length: totalLetters }).map((_, idx) => {
          const isSolved = idx < oppProgress;
          return (
            <div
              key={idx}
              className={`w-5 h-6 rounded-md flex items-center justify-center font-black text-[10px] transition-all duration-200 ${
                isSolved
                  ? "bg-rose-500 text-white shadow-sm shadow-rose-500/40 border border-rose-400 scale-105"
                  : "bg-zinc-800/90 border border-zinc-700/60 text-transparent"
              }`}
            >
              {isSolved ? "✓" : ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}
