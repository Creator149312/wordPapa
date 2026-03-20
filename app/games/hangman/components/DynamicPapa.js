"use client";
import React, { useMemo } from "react";
import { getMentorMessage } from "../constants/mentorMessages";

export default function DynamicPapa({
  errors,
  maxErrors = 10,
  accent = "#75c32c",
  isWinner = false,
  secondsElapsed = 0,
  showMentorMsg = false,
  currentRankName = "Infant",
  streak = 0,
}) {
  // --- 1. ALL ORIGINAL EXPRESSION LOGIC RESTORED ---
  const getExpression = () => {
    if (errors >= maxErrors) return "(x_x)";
    if (isWinner) return "٩(^‿^)۶";
    if (errors >= maxErrors * 0.8) return "(╥﹏╥)";
    if (errors >= 3) return "(O_O)";
    if (errors === 0 && secondsElapsed > 15) return "(¬_¬)";
    if (errors > 0 && errors < 3) return "(•_•)";
    return "(•‿•)";
  };

  const mentorText = useMemo(() => {
    return getMentorMessage(currentRankName, streak >= 10);
  }, [currentRankName, streak]);

  const isDead = errors >= maxErrors;

  return (
    <div className="relative flex flex-row lg:flex-col items-center justify-between h-[200px] lg:h-[380px] w-full lg:max-w-[240px] overflow-hidden bg-gradient-to-r lg:bg-gradient-to-b from-sky-300 via-sky-100 to-white dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-950 rounded-2xl border-[3px] border-zinc-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] lg:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mx-auto p-4 lg:p-0">
      {/* 2. ORIGINAL CLOUD ANIMATIONS RESTORED */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-5 lg:top-10 left-[-10%] animate-cloud-slow text-[30px] lg:text-[40px] opacity-30">
          ☁️
        </div>
        <div className="absolute top-20 lg:top-40 right-[-10%] animate-cloud-fast text-[40px] lg:text-[60px] opacity-20">
          ☁️
        </div>
      </div>

      {/* 3. ORIGINAL BALLOON BOUQUET & STRINGS RESTORED */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {Array.from({ length: maxErrors }).map((_, i) => {
          const isPopped = i < errors;

          // Responsive Positioning
          const isMobile =
            typeof window !== "undefined" && window.innerWidth < 1024;
          const colsPerRow = isMobile ? 5 : maxErrors > 6 ? 4 : 3;
          const row = Math.floor(i / colsPerRow);
          const col = i % colsPerRow;

          // Fan out from the left on mobile, center on desktop
          const xOffset = (col - (colsPerRow - 1) / 2) * (isMobile ? 40 : 35);
          const yOffset = isMobile ? row * 18 + 25 : row * 28 + 35;
          const xOrigin = isMobile ? "25%" : "50%";

          return (
            <div
              key={i}
              className="absolute top-0 transition-all duration-700"
              style={{ left: xOrigin }}
            >
              {/* RESTORED BALLOON STRINGS */}
              {!isPopped && (
                <div
                  className="absolute top-[40px] lg:top-[60px] left-1/2 w-[1px] bg-zinc-900/10 origin-bottom"
                  style={{
                    height: isMobile ? "80px" : "140px",
                    transform: `translateX(${xOffset * 0.4}px) rotate(${xOffset * 0.15}deg)`,
                  }}
                />
              )}

              <div
                className={`absolute w-7 h-9 lg:w-8 lg:h-10 rounded-full border-[2px] border-zinc-900 transition-all duration-500 
                   ${isPopped ? "scale-0 opacity-0 -translate-y-10" : "scale-100 opacity-100 animate-float"}
                 `}
                style={{
                  backgroundColor: accent,
                  left: `${xOffset}px`,
                  top: `${yOffset}px`,
                  animationDelay: `${i * 0.05}s`,
                  zIndex: 30 + row,
                  boxShadow: `inset -2px -2px 0px rgba(0,0,0,0.1)`,
                }}
              >
                <div className="absolute top-1 left-1.5 w-1.5 h-2 bg-white/40 rounded-full" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. PAPA & MENTOR MSG RESTORED */}
      <div
        className={`relative flex flex-col items-center z-40 transition-all duration-[800ms] ease-in-out 
        ${
          isDead
            ? "translate-y-[60px] lg:translate-y-[138px] rotate-[10deg]"
            : "translate-y-0 lg:translate-y-[-70px]"
        } 
        mt-auto ml-auto lg:ml-0 mr-4 lg:mr-0 mb-4 lg:mb-0`}
      >
        {showMentorMsg && !isDead && (
          <div className="absolute top-[-50px] lg:top-[-55px] z-50 animate-bounce">
            <div className="bg-zinc-900 text-white text-[8px] font-black px-3 py-1.5 rounded-xl border-2 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-max max-w-[110px] lg:max-w-[120px] text-center uppercase">
              {mentorText}
            </div>
          </div>
        )}

        <div
          className={`relative ${isWinner ? "animate-bounce" : !isDead ? "animate-float" : ""}`}
        >
          <div
            className={`w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center rounded-2xl border-[3px] border-zinc-900 bg-white dark:bg-zinc-800 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] lg:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] 
            ${errors >= maxErrors * 0.8 && !isDead ? "animate-shake" : ""}`}
          >
            <div
              className="absolute top-0 left-0 right-0 h-2 lg:h-2.5 border-b-2 border-zinc-900 rounded-t-[0.8rem] lg:rounded-t-[1.3rem]"
              style={{ backgroundColor: accent }}
            />
            <span className="text-xl lg:text-2xl font-black text-zinc-900 dark:text-zinc-100 select-none">
              {getExpression()}
            </span>
          </div>
        </div>
      </div>

      {/* 5. ORIGINAL SPIKES RESTORED (Height 12px) */}
      <div className="absolute bottom-0 left-0 w-full h-[12px] flex justify-around items-end z-10 bg-zinc-200 dark:bg-zinc-800">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-zinc-900 dark:border-b-white"
          />
        ))}
      </div>

      {/* 6. ORIGINAL ANIMATION STYLES RESTORED */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(-1.5deg);
          }
          50% {
            transform: translateY(-10px) rotate(1.5deg);
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-2px);
          }
          75% {
            transform: translateX(2px);
          }
        }
        @keyframes cloud-slow {
          0% {
            transform: translateX(-100px);
          }
          100% {
            transform: translateX(250px);
          }
        }
        @keyframes cloud-fast {
          0% {
            transform: translateX(250px);
          }
          100% {
            transform: translateX(-150px);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out infinite;
        }
        .animate-cloud-slow {
          animation: cloud-slow 40s linear infinite;
        }
        .animate-cloud-fast {
          animation: cloud-fast 25s linear infinite;
        }
      `}</style>
    </div>
  );
}
