"use client";
import React from "react";
import { TrendingUp, Zap, Flag, Trophy } from "lucide-react";

export default function SessionProgress({
  totalXPEarned,
  xpPercent,
  isBreakingXPRecord,
  isRefilling,
  highestXP = 0,
  accent = "#75c32c", // playerRank.color passed from parent
}) {
  return (
    <div className="w-full animate-in fade-in slide-in-from-top-2 duration-500 mb-3">
      <div className="relative bg-white dark:bg-zinc-900 border-[3px] border-zinc-900 dark:border-zinc-100 rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        {/* PROGRESS FILL: Anchored at bottom */}
        <div
          className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-in-out z-20 ${
            isBreakingXPRecord
              ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_100%] animate-shimmer"
              : ""
          }`}
          style={{
            width: `${Math.min(xpPercent, 100)}%`,
            backgroundColor: isBreakingXPRecord ? undefined : accent,
          }}
        />

        <div className="flex items-center justify-between px-3 py-2.5 relative z-10">
          {/* LEFT SIDE: Session XP Gain */}
          <div className="flex items-center gap-3">
            {/* Stat Square - Theme matched to player rank accent */}
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-500 ${
                isBreakingXPRecord ? "bg-indigo-600 animate-bounce-subtle" : ""
              }`}
              style={{
                backgroundColor: isBreakingXPRecord ? undefined : accent,
              }}
            >
              <TrendingUp size={20} className="text-white" />
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-400 leading-none">
                Session Gain
              </span>
              <span
                className={`text-lg font-black italic tabular-nums mt-0.5 transition-all duration-300 ${
                  isBreakingXPRecord
                    ? "text-indigo-600 dark:text-indigo-400 animate-pulse drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                    : "text-zinc-900 dark:text-zinc-100"
                }`}
                style={{ color: isBreakingXPRecord ? undefined : accent }}
              >
                +{totalXPEarned}{" "}
                <span className="text-[9px] not-italic opacity-70">XP</span>
              </span>
            </div>
          </div>

          {/* RIGHT SIDE: Personal Best Status */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5">
              {isBreakingXPRecord ? (
                <div className="flex items-center gap-1 text-indigo-500 animate-bounce">
                  <Trophy size={12} fill="currentColor" />
                  <p className="text-sm font-black italic uppercase tracking-tighter">
                    New Best!
                  </p>
                </div>
              ) : (
                <>
                  <Flag
                    size={10}
                    style={{ color: accent }}
                    fill="currentColor"
                  />
                  <p className="text-sm font-black text-zinc-900 dark:text-zinc-100 italic">
                    {Math.round(xpPercent)}%
                  </p>
                </>
              )}
            </div>

            <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mt-1">
              Personal Best: {highestXP.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Refill Overlay */}
        {isRefilling && (
          <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-30 animate-in fade-in zoom-in duration-300">
            <div
              className="flex items-center gap-2 px-4 py-1.5 text-white rounded-full text-[10px] font-black uppercase shadow-lg border-2 border-white/20"
              style={{ backgroundColor: accent }}
            >
              <Zap size={12} fill="currentColor" className="animate-pulse" />{" "}
              Energy Refilled!
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        @keyframes bounce-subtle {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-3px) scale(1.05);
          }
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
