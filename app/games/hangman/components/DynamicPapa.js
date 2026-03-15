"use client";
import React from "react";
import { ARENAS } from "../constants";

export default function DynamicPapa({
  wrongCount,
  isWon,
  isLost,
  maxTries = 6,
  streak = 0,
  arenaId = 1,
}) {
  const currentArena = ARENAS[arenaId] || ARENAS[1];
  const isOnFire = streak >= 5;

  // Logic Constants
  const tension = Math.min(wrongCount / maxTries, 1);
  const isDanger = wrongCount >= maxTries - 2 && maxTries > 2;

  const shouldShow = (partIndex) => {
    if (isWon) return true;
    const threshold = Math.ceil((partIndex / 6) * maxTries);
    return wrongCount >= threshold;
  };

  const getEmotion = () => {
    if (isWon) return { face: "^‿^", status: "VICTORY" };
    if (isLost) return { face: "x_x", status: "FAILED" };
    if (isDanger) return { face: "°o°", status: "DANGER" };
    return { face: "•‿•", status: currentArena.name.toUpperCase() };
  };

  const { face, status } = getEmotion();

  return (
    <div className="relative w-full aspect-square flex items-center justify-center rounded-[2.5rem] transition-all duration-700 bg-zinc-100 dark:bg-zinc-900/60">
      <style>{`
        @keyframes pivotSway {
          0%, 100% { transform: rotate(-${2 + tension * 4}deg); transform-origin: 132px 75px; }
          50% { transform: rotate(${2 + tension * 4}deg); transform-origin: 132px 75px; }
        }
        @keyframes winJump {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .stick-root { 
          animation: ${isWon ? "winJump 0.5s ease-in-out infinite" : isLost ? "none" : "pivotSway 3s ease-in-out infinite"}; 
        }
        .pop-in { animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        @keyframes pop { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
      `}</style>

      {/* STAGE WATERMARK - Minimalist Zinc */}
      <div className="absolute top-6 left-8 opacity-[0.05] font-black italic text-2xl md:text-4xl select-none tracking-tighter text-zinc-900 dark:text-zinc-100">
        {status}
      </div>

      <div className="relative w-full h-full max-w-[180px] md:max-w-[220px]">
        <svg viewBox="0 0 200 250" className="w-full h-full overflow-visible">
          {/* GALLOWS - Neutralized */}
          <g
            className="transition-colors duration-700"
            style={{
              color: isLost
                ? "#ef4444"
                : isDanger
                  ? "#f97316"
                  : "rgba(161, 161, 170, 0.3)", // zinc-400 equivalent
            }}
          >
            <line
              x1="40"
              y1="230"
              x2="160"
              y2="230"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M60 230 L60 40 L132 40 L132 75"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {!isLost && (
              <line
                x1="132"
                y1="75"
                x2="132"
                y2="90"
                stroke="currentColor"
                strokeWidth="3"
              />
            )}
          </g>

          {/* THE CHARACTER */}
          <g
            className="stick-root"
            style={{ color: isLost ? "#ef4444" : currentArena.accent }}
          >
            {shouldShow(1) && (
              <g className="pop-in">
                <circle
                  cx="132"
                  cy="110"
                  r="20"
                  fill="currentColor"
                  fillOpacity="0.05"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <text
                  x="132"
                  y="117"
                  textAnchor="middle"
                  className="text-[14px] font-black fill-current"
                >
                  {face}
                </text>
              </g>
            )}
            {shouldShow(2) && (
              <line
                x1="132"
                y1="130"
                x2="132"
                y2="175"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                className="pop-in"
              />
            )}
            {shouldShow(3) && (
              <line
                x1="132"
                y1="145"
                x2="105"
                y2={isWon ? "120" : "165"}
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                className="pop-in"
              />
            )}
            {shouldShow(4) && (
              <line
                x1="132"
                y1="145"
                x2="159"
                y2={isWon ? "120" : "165"}
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                className="pop-in"
              />
            )}
            {shouldShow(5) && (
              <line
                x1="132"
                y1="175"
                x2="110"
                y2="215"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                className="pop-in"
              />
            )}
            {shouldShow(6) && (
              <line
                x1="132"
                y1="175"
                x2="154"
                y2="215"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                className="pop-in"
              />
            )}
          </g>
        </svg>
      </div>

      {/* STREAK PILL - Minimalist Zinc */}
      {streak > 0 && (
        <div
          className={`absolute top-6 right-8 px-3 py-1.5 rounded-xl font-black text-[11px] ${isOnFire ? "bg-orange-500 text-white animate-bounce" : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"}`}
        >
          {isOnFire ? "🔥" : "⚡"} {streak}
        </div>
      )}

      {/* HEALTH TRACKER */}
      <div className="absolute bottom-6 flex flex-col items-center w-full px-8 md:px-12">
        <div className="flex gap-1 w-full justify-center">
          {[...Array(maxTries)].map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i < wrongCount ? "bg-zinc-200 dark:bg-zinc-800" : ""
              }`}
              style={{
                backgroundColor:
                  i < wrongCount ? undefined : currentArena.accent,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
