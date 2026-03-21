"use client";
import React, { useState, useEffect, useRef } from "react";
import { TrendingUp, Zap, Flag, Trophy } from "lucide-react";

export default function SessionProgress({
  totalXPEarned,
  xpPercent,
  isBreakingXPRecord,
  isRefilling,
  highestXP = 0,
  accent = "#75c32c",
}) {
  const [displayXP, setDisplayXP] = useState(0);
  const [showParticles, setShowParticles] = useState(false);
  const prevXP = useRef(0);

  // Trigger particles when hitting 100%
  useEffect(() => {
    if (xpPercent >= 100 && !showParticles) {
      setShowParticles(true);
      // Reset after animation finishes so it can trigger again if needed
      setTimeout(() => setShowParticles(false), 1000);
    }
  }, [xpPercent]);

  // Incremental counting logic
  useEffect(() => {
    let startTimestamp;
    const duration = 800;
    const startValue = prevXP.current;
    const endValue = totalXPEarned;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOutExpo = 1 - Math.pow(2, -10 * progress);
      const currentXP = Math.floor(
        easeOutExpo * (endValue - startValue) + startValue,
      );

      setDisplayXP(currentXP);
      if (progress < 1) window.requestAnimationFrame(step);
      else prevXP.current = endValue;
    };
    window.requestAnimationFrame(step);
  }, [totalXPEarned]);

  const progressWidth = Math.min(xpPercent, 100);

  return (
    <div className="w-full animate-in fade-in slide-in-from-top-2 duration-500 mb-1 md:mb-2">
      <div className="relative bg-white dark:bg-zinc-900 border-[3px] border-zinc-900 dark:border-zinc-100 rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        {/* PROGRESS FILL CONTAINER */}
        <div className="absolute bottom-0 left-0 w-full h-1 md:h-1.5 bg-zinc-100 dark:bg-zinc-800 z-10">
          <div
            className={`h-full transition-all duration-1000 ease-in-out relative ${
              isBreakingXPRecord ? "animate-shimmer" : ""
            }`}
            style={{
              width: `${progressWidth}%`,
              backgroundColor: isBreakingXPRecord ? undefined : accent,
              backgroundImage: isBreakingXPRecord
                ? "linear-gradient(90deg, #6366f1, #a855f7, #6366f1)"
                : "none",
              backgroundSize: "200% 100%",
            }}
          >
            {/* THE COMET: A bright glow at the leading edge of the bar */}
            {progressWidth > 0 && progressWidth < 100 && (
              <div
                className="absolute right-0 top-0 h-full w-8 blur-sm opacity-80"
                style={{
                  background: `linear-gradient(90deg, transparent, white, transparent)`,
                  transform: "translateX(50%)",
                }}
              />
            )}
          </div>
        </div>

        {/* PARTICLE BURST: Only visible when showParticles is true */}
        {showParticles && (
          <div className="absolute inset-0 pointer-events-none z-50">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  "--angle": `${i * 30}deg`,
                  "--color": isBreakingXPRecord ? "#818cf8" : accent,
                }}
              />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between px-2 py-2 relative z-20">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-500 ${
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
                    ? "text-indigo-600 dark:text-indigo-400 animate-pulse"
                    : "text-zinc-900 dark:text-zinc-100"
                }`}
                style={{ color: isBreakingXPRecord ? undefined : accent }}
              >
                +{displayXP.toLocaleString()}
                <span className="text-[9px] not-italic opacity-70 ml-1">
                  XP
                </span>
              </span>
            </div>
          </div>

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
          <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-40 animate-in fade-in zoom-in duration-300">
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
        @keyframes particle-out {
          0% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateY(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) rotate(var(--angle))
              translateY(-40px);
            opacity: 0;
          }
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }

        .particle {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 6px;
          height: 6px;
          background-color: var(--color);
          border-radius: 50%;
          animation: particle-out 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
