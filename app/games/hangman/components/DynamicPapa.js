"use client";
import React, { useMemo, useEffect, useState } from "react";
import { ARENAS } from "../constants";

export default function DynamicPapa({
  wrongCount,
  isWon,
  isLost,
  isReviving,
  maxTries = 10,
  streak = 0,
  arenaId = 1,
  accent = "#75c32c", // Pass currentRank.color here
}) {
  const currentArena = ARENAS[arenaId] || ARENAS[1];
  const livesRemaining = Math.max(0, maxTries - wrongCount);
  const [lastPopped, setLastPopped] = useState(null);

  useEffect(() => {
    if (wrongCount > 0) {
      setLastPopped(wrongCount - 1);
      const timer = setTimeout(() => setLastPopped(null), 600);
      return () => clearTimeout(timer);
    }
  }, [wrongCount]);

  const altitudeY = useMemo(() => Math.max(-180, (streak % 15) * -12), [streak]);

  const getEmotion = () => {
    if (isLost && !isReviving) return { face: "O_O", status: "FALLEN" };
    if (isReviving) return { face: "°o°", status: "SAVED!" };
    if (isWon) return { face: "^‿^", status: "WINNER" };
    return { face: "•‿•", status: currentArena.name.toUpperCase() };
  };

  const { face, status } = getEmotion();

  return (
    <div
      className={`relative w-full aspect-[3/4] flex items-center justify-center rounded-[2.5rem] border-[3px] border-zinc-900 overflow-hidden shadow-[8px_8px_0px_rgba(0,0,0,0.2)] transition-all duration-1000 ease-in-out ${currentArena.arenaBg}`}
    >
      {/* 1. Environment-Specific Sketch Elements (Neutral) */}
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 300">
        {arenaId <= 3 && (
          <g className="animate-drift text-zinc-400 dark:text-zinc-600">
            <path d="M20 50 Q 40 40, 60 50 T 100 50" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M130 120 Q 150 110, 170 120 T 210 120" fill="none" stroke="currentColor" strokeWidth="2" />
          </g>
        )}
        {arenaId > 3 && arenaId <= 7 && (
          <g className="text-zinc-400 dark:text-zinc-600">
            <path d="M20 300 L20 250 M180 300 L180 240" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="20" cy="240" r="15" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="180" cy="230" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
          </g>
        )}
        {arenaId > 7 && (
          <g className="animate-pulse text-zinc-300 dark:text-zinc-500">
            <circle cx="40" cy="40" r="2" fill="currentColor" />
            <circle cx="160" cy="80" r="1.5" fill="currentColor" />
            <circle cx="100" cy="30" r="1" fill="currentColor" />
          </g>
        )}
      </svg>

      {/* 2. Labels (Uses Rank Accent) */}
      <div className="absolute top-6 left-6 z-10 flex flex-col">
        <span
          className="font-black italic text-[10px] uppercase tracking-tighter leading-none"
          style={{ color: accent }}
        >
          {status}
        </span>
        <span className="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1">
          {currentArena.description}
        </span>
      </div>

      {/* 3. The Voyager */}
      <div
        className={`relative w-full h-full transition-all duration-1000 ease-in-out ${isLost && !isReviving ? 'animate-plummet' : 'animate-float'}`}
        style={{ transform: (isLost && !isReviving) ? 'translateY(400px)' : `translateY(${altitudeY}px)` }}
      >
        <svg viewBox="0 0 200 300" className="w-full h-full overflow-visible">

          {/* REFILL ANIMATION */}
          {isReviving && (
            <g className="animate-refill-fly-in">
              {[...Array(5)].map((_, i) => (
                <g key={i} transform={`translate(${70 + (i * 15)}, 350)`}>
                  <line x1="0" y1="0" x2="0" y2="-40" stroke={accent} strokeWidth="1" opacity="0.5" />
                  <path d="M0 -40 c-8-12, -8-22, 0-30 c8,5, 8,15, 0,30 z" fill={accent} stroke="black" strokeWidth="2" />
                </g>
              ))}
            </g>
          )}

          {/* BALLOONS (Uses Rank Accent Color) */}
          <g transform="translate(100, 140)">
            {[...Array(maxTries)].map((_, i) => {
              const isPopped = i >= livesRemaining;
              const isCurrentlyPopping = i === lastPopped;
              const angle = (i - (maxTries / 2)) * 14;
              const xPos = Math.sin(angle * (Math.PI / 180)) * 50;
              const yPos = Math.cos(angle * (Math.PI / 180)) * -60;

              return (
                <g key={i}>
                  {isCurrentlyPopping && (
                    <g className="animate-pop-burst" transform={`translate(${xPos}, ${yPos - 15})`}>
                      <path d="M-10 -10 L10 10 M-10 10 L10 -10" stroke={accent} strokeWidth="3" />
                      <circle r="15" fill="none" stroke={accent} strokeWidth="1" strokeDasharray="2 2" />
                    </g>
                  )}
                  <g className={`transition-all duration-500 ${isPopped ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
                    <line x1="0" y1="0" x2={xPos} y2={yPos + 8} stroke="currentColor" strokeWidth="1.2" className="text-zinc-400" />
                    <path
                      d={`M${xPos} ${yPos} c-12-18, -12-28, 0-35 c12,7, 12,17, 0,35 z`}
                      fill={accent}
                      stroke="black"
                      strokeWidth="2.5"
                    />
                  </g>
                </g>
              );
            })}
          </g>

          {/* PAPA FIGURE */}
          <g transform="translate(100, 160)" className={isWon ? "animate-bounce" : ""}>
            <g style={{ color: (isLost && !isReviving) ? "#ef4444" : "currentColor" }} className="text-zinc-900 dark:text-zinc-100">
              <circle cx="0" cy="0" r="14" fill="white" stroke="currentColor" strokeWidth="3" />
              <text x="0" y="4" textAnchor="middle" className="text-[10px] font-black fill-current italic">{face}</text>
              <path d="M0 -5 L0 -20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <line x1="0" y1="14" x2="0" y2="40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <path d="M0 18 L15 28" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <path d="M-8 60 L0 40 L8 60" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </g>
          </g>
        </svg>
      </div>

      <style jsx>{`
        @keyframes float { 0%, 100% { transform: translateY(${altitudeY}px) rotate(-1deg); } 50% { transform: translateY(${altitudeY - 12}px) rotate(1deg); } }
        @keyframes drift { from { transform: translateX(-20px); } to { transform: translateX(20px); } }
        @keyframes pop-burst { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(2); opacity: 0; } }
        @keyframes plummet { 0% { transform: translateY(${altitudeY}px) rotate(0deg); } 100% { transform: translateY(600px) rotate(180deg); } }
        @keyframes refill-fly-in { 0% { transform: translateY(0); opacity: 0; } 20% { opacity: 1; } 100% { transform: translateY(-380px); opacity: 1; } }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-drift { animation: drift 10s ease-in-out infinite alternate; }
        .animate-pop-burst { animation: pop-burst 0.5s ease-out forwards; }
        .animate-plummet { animation: plummet 1.5s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards; }
        .animate-refill-fly-in { animation: refill-fly-in 1.2s ease-out forwards; }
      `}</style>
    </div>
  );
}

// "use client";
// import React from "react";
// import { ARENAS } from "../constants";

// export default function DynamicPapa({
//   wrongCount,
//   isWon,
//   isLost,
//   maxTries = 6,
//   streak = 0,
//   arenaId = 1,
//   gameMode = "classic", // Default to classic
// }) {
//   const currentArena = ARENAS[arenaId] || ARENAS[1];
//   const isEndless = gameMode === "endless" || gameMode === "Endless Run";
//   const isOnFire = streak >= 5;

//   // Logic Constants
//   const tension = Math.min(wrongCount / maxTries, 1);
//   const isDanger = wrongCount >= maxTries - 2 && maxTries > 2;

//   // Mapping function: Scales 6 visual parts to any maxTries (6 or 10)
//   const shouldShow = (partIndex) => {
//     if (isWon && !isEndless) return true;
//     const threshold = Math.ceil((partIndex / 6) * maxTries);
//     return wrongCount >= threshold;
//   };

//   const getEmotion = () => {
//     if (isLost) return { face: "x_x", status: "FAILED" };
//     if (isWon && !isEndless) return { face: "^‿^", status: "VICTORY" };
//     if (isEndless && !isLost) return { face: "•̀_•́", status: "RUNNING" };
//     if (isDanger) return { face: "°o°", status: "DANGER" };
//     return { face: "•‿•", status: currentArena.name.toUpperCase() };
//   };

//   const { face, status } = getEmotion();

//   return (
//     <div className="relative w-full aspect-square flex items-center justify-center rounded-[2.5rem] transition-all duration-700 bg-zinc-100 dark:bg-zinc-900/60">
//       <style>{`
//         @keyframes pivotSway {
//           0%, 100% { transform: rotate(-${2 + tension * 4}deg); transform-origin: 132px 75px; }
//           50% { transform: rotate(${2 + tension * 4}deg); transform-origin: 132px 75px; }
//         }
//         @keyframes winJump {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-20px); }
//         }
//         .stick-root { 
//           animation: ${(isWon && !isEndless) ? "winJump 0.5s ease-in-out infinite" : isLost ? "none" : "pivotSway 3s ease-in-out infinite"}; 
//         }
//         .pop-in { animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
//         @keyframes pop { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
//       `}</style>

//       {/* STAGE WATERMARK */}
//       <div className="absolute top-6 left-8 opacity-[0.05] font-black italic text-2xl md:text-4xl select-none tracking-tighter text-zinc-900 dark:text-zinc-100 uppercase">
//         {status}
//       </div>

//       <div className="relative w-full h-full max-w-[180px] md:max-w-[220px]">
//         <svg viewBox="0 0 200 250" className="w-full h-full overflow-visible">
//           {/* GALLOWS */}
//           <g
//             className="transition-colors duration-700"
//             style={{
//               color: isLost
//                 ? "#ef4444"
//                 : isDanger
//                   ? "#f97316"
//                   : "rgba(161, 161, 170, 0.3)",
//             }}
//           >
//             <line x1="40" y1="230" x2="160" y2="230" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
//             <path d="M60 230 L60 40 L132 40 L132 75" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
//             {!isLost && (
//               <line x1="132" y1="75" x2="132" y2="90" stroke="currentColor" strokeWidth="3" />
//             )}
//           </g>

//           {/* THE CHARACTER */}
//           <g className="stick-root" style={{ color: isLost ? "#ef4444" : currentArena.accent }}>
//             {shouldShow(1) && (
//               <g className="pop-in">
//                 <circle cx="132" cy="110" r="20" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="4" />
//                 <text x="132" y="117" textAnchor="middle" className="text-[14px] font-black fill-current">{face}</text>
//               </g>
//             )}
//             {shouldShow(2) && <line x1="132" y1="130" x2="132" y2="175" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="pop-in" />}
//             {shouldShow(3) && <line x1="132" y1="145" x2="105" y2={(isWon && !isEndless) ? "120" : "165"} stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="pop-in" />}
//             {shouldShow(4) && <line x1="132" y1="145" x2="159" y2={(isWon && !isEndless) ? "120" : "165"} stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="pop-in" />}
//             {shouldShow(5) && <line x1="132" y1="175" x2="110" y2="215" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="pop-in" />}
//             {shouldShow(6) && <line x1="132" y1="175" x2="154" y2="215" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="pop-in" />}
//           </g>
//         </svg>
//       </div>

//       {/* STREAK PILL */}
//       {streak > 0 && (
//         <div className={`absolute top-6 right-8 px-3 py-1.5 rounded-xl font-black text-[11px] ${isOnFire ? "bg-orange-500 text-white animate-bounce" : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"}`}>
//           {isOnFire ? "🔥" : "⚡"} {streak}
//         </div>
//       )}

//       {/* HEALTH TRACKER (PERSISTENT) */}
//       <div className="absolute bottom-6 flex flex-col items-center w-full px-8 md:px-12">
//         <div className="flex gap-1 w-full justify-center">
//           {[...Array(maxTries)].map((_, i) => (
//             <div
//               key={i}
//               className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i < wrongCount ? "bg-zinc-200 dark:bg-zinc-800" : ""}`}
//               style={{ backgroundColor: i < wrongCount ? undefined : currentArena.accent }}
//             />
//           ))}
//         </div>
//         {isEndless && (
//           <p className="text-[8px] font-black text-zinc-400 mt-2 uppercase tracking-widest">System Integrity</p>
//         )}
//       </div>
//     </div>
//   );
// }