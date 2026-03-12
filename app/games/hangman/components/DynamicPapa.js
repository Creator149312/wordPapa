'use client';
import React from 'react';

export default function DynamicPapa({ wrongCount, isWon, isLost, streak = 0 }) {
  const isOnFire = streak >= 5;
  const isLegendary = streak >= 10;

  const getEmotion = () => {
    if (isWon) return { face: "^▽^", color: "text-[#75c32c]", bg: "bg-green-50/30", status: "VICTORY" };
    if (isLost) return { face: "T_T", color: "text-red-500", bg: "bg-red-50/30", status: "SNAP!" };
    if (wrongCount === 0) return { face: isOnFire ? "🔥‿🔥" : "◕‿◕", color: "text-blue-500", bg: "bg-blue-50/10", status: "READY?" };
    if (wrongCount < 3) return { face: "⊙_⊙", color: "text-gray-600", bg: "bg-gray-50/50", status: "CAREFUL" };
    return { face: "Q_Q", color: "text-orange-500", bg: "bg-orange-50/50", status: "DANGER" };
  };

  const { face, color, bg, status } = getEmotion();

  return (
    <div className={`relative w-full aspect-[4/3] lg:aspect-square max-h-[280px] flex items-center justify-center rounded-[2rem] border-2 border-dashed transition-all duration-700 ${bg} overflow-hidden ${isOnFire ? 'border-orange-400 shadow-inner' : 'border-gray-200 dark:border-gray-800'}`}>
      
      {/* 1. COMPACT WATERMARK */}
      <div className="absolute top-4 left-6 opacity-[0.05] select-none pointer-events-none">
        <span className="text-4xl font-black italic uppercase">{status}</span>
      </div>

      {/* 2. FIRE EFFECTS (Condensed) */}
      {isOnFire && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-16 bg-orange-500/10 blur-[40px] rounded-full" />
          <div className="absolute top-4 right-4 animate-bounce text-lg">🔥</div>
        </div>
      )}

      {/* 3. THE SVG: Optimized for smaller container */}
      <div className={`relative w-full h-full max-w-[180px] lg:max-w-[220px] transition-transform duration-500 ${isWon ? 'animate-bounce' : ''} ${isLegendary ? 'scale-110' : 'scale-100'}`}>
        <svg 
          viewBox="0 0 200 250" 
          preserveAspectRatio="xMidYMid meet" 
          className="w-full h-full drop-shadow-md overflow-visible"
        >
          {/* GALLOWS */}
          <g className={`${isOnFire ? 'text-orange-300' : 'text-gray-300 dark:text-gray-700'} transition-colors duration-500`}>
            <path d="M40 230 L160 230" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            <path d="M60 230 L60 40 L132 40 L132 65" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            <line x1="132" y1="65" x2="132" y2="80" stroke={isOnFire ? "#ea580c" : "#78350f"} strokeWidth="3" />
          </g>

          {/* THE MAN */}
          <g className={`transition-all duration-300 ${isLost ? 'translate-y-2' : ''}`}>
            <style>{`
              .limb-enter { animation: limbPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
              @keyframes limbPop {
                0% { opacity: 0; transform: scale(0.8); }
                100% { opacity: 1; transform: scale(1); }
              }
            `}</style>

            {/* Head */}
            {(wrongCount > 0 || isWon) && (
              <g className="limb-enter">
                <circle cx="132" cy="100" r="20" fill="white" stroke="currentColor" strokeWidth="4" className={isOnFire && !isLost ? 'text-orange-500' : color} />
                <text x="132" y="105" textAnchor="middle" className={`font-bold text-[12px] fill-current ${isOnFire && !isLost ? 'fill-orange-600' : color}`}>
                  {face}
                </text>
              </g>
            )}

            {/* Body & Limbs - Thinner lines for sleeker look */}
            {(wrongCount > 1 || isWon) && (
              <line x1="132" y1="120" x2="132" y2="170" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className={`${isOnFire && !isLost ? 'text-orange-500' : color} limb-enter`} />
            )}
            {(wrongCount > 2 || isWon) && (
              <line x1="132" y1="135" x2={isWon ? "155" : "110"} y2={isWon ? "110" : "155"} stroke="currentColor" strokeWidth="4" strokeLinecap="round" className={`${isOnFire && !isLost ? 'text-orange-500' : color} limb-enter`} />
            )}
            {(wrongCount > 3 || isWon) && (
              <line x1="132" y1="135" x2={isWon ? "109" : "154"} y2={isWon ? "110" : "155"} stroke="currentColor" strokeWidth="4" strokeLinecap="round" className={`${isOnFire && !isLost ? 'text-orange-500' : color} limb-enter`} />
            )}
            {(wrongCount > 4 || isWon) && (
              <line x1="132" y1="170" x2="115" y2="210" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className={`${isOnFire && !isLost ? 'text-orange-500' : color} limb-enter`} />
            )}
            {(wrongCount > 5 || isWon) && (
              <line x1="132" y1="170" x2="149" y2="210" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className={`${isOnFire && !isLost ? 'text-orange-500' : color} limb-enter`} />
            )}
          </g>
        </svg>
      </div>

      {/* 4. FLOATING STREAK BADGE */}
      {streak > 0 && (
        <div className={`absolute bottom-3 right-3 px-3 py-1 rounded-full font-bold text-[10px] tracking-widest transition-all shadow-sm ${isOnFire ? 'bg-orange-500 text-white animate-pulse' : 'bg-white/80 text-gray-400 border border-gray-100'}`}>
          STREAK {streak}
        </div>
      )}
    </div>
  );
}