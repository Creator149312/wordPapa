// 'use client';

// export default function WordDisplay({ wordLetters, guessedLetters, isLost, isWon }) {
//   const len = wordLetters.length;

//   const getBoxSize = () => {
//     if (len > 12) return 'w-7 h-10 md:w-9 md:h-12';
//     if (len > 8) return 'w-9 h-12 md:w-11 md:h-14';
//     return 'w-10 h-14 md:w-14 md:h-18';
//   };

//   const getFontSize = () => {
//     if (len > 12) return 'text-base md:text-xl';
//     if (len > 8) return 'text-xl md:text-3xl';
//     return 'text-3xl md:text-5xl';
//   };

//   return (
//     <div className="flex flex-wrap gap-2 md:gap-3 justify-center items-center py-6 w-full max-w-full mx-auto select-none">
//       {wordLetters.map((letter, index) => {
//         if (letter === ' ') {
//           return <div key={index} className="w-4 md:w-8 h-1" />;
//         }

//         const isRevealed = guessedLetters.includes(letter);
//         const showMissed = isLost && !isRevealed;

//         return (
//           <div
//             key={index}
//             className={`
//               relative flex items-center justify-center transition-all duration-300
//               ${getBoxSize()}
//               border-b-[3px] md:border-b-[4px]
//               ${isRevealed
//                 ? 'border-[#75c32c]'
//                 : showMissed
//                   ? 'border-red-500'
//                   : 'border-zinc-800 dark:border-zinc-200'
//               }
//             `}
//           >
//             <span className={`
//               font-black transition-all duration-300 uppercase
//               ${getFontSize()}
//               ${isRevealed ? 'text-[#75c32c]' : 'text-zinc-800 dark:text-zinc-100'}
//               ${showMissed ? 'text-red-500 animate-pulse' : ''}
//               ${!isRevealed && !showMissed ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}
//               ${isWon ? 'animate-bounce' : ''}
//             `}>
//               {isRevealed || isLost ? letter : ''}
//             </span>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WordDisplay({
  wordLetters,
  guessedLetters,
  isLost,
  isWon,
  wrongCount, // Added to detect life loss
  xpGained = 100,
  accent = "#75c32c",
}) {
  const [showWinJuice, setShowWinJuice] = useState(false);
  const [showMistakeJuice, setShowMistakeJuice] = useState(false);
  const prevWrongCount = useRef(wrongCount);
  const len = wordLetters.length;

  // --- 1. WIN JUICE LOGIC ---
  useEffect(() => {
    if (isWon) {
      setShowWinJuice(true);
      // Auto-hide after 2 seconds
      const timer = setTimeout(() => setShowWinJuice(false), 4000);
      return () => clearTimeout(timer);
    } else {
      // CRITICAL: Hide immediately if word changes or isWon is reset
      setShowWinJuice(false);
    }
  }, [isWon, wordLetters]); // Re-runs if word changes

  // --- 2. MISTAKE JUICE LOGIC ---
  useEffect(() => {
    if (wrongCount > prevWrongCount.current && !isLost) {
      setShowMistakeJuice(true);
      const timer = setTimeout(() => setShowMistakeJuice(false), 400);
      return () => clearTimeout(timer);
    }
    prevWrongCount.current = wrongCount;
  }, [wrongCount, isLost]);

  const getBoxSize = () => {
    if (len > 12) return "w-7 h-10 md:w-9 md:h-12";
    if (len > 8) return "w-9 h-12 md:w-11 md:h-14";
    return "w-10 h-14 md:w-14 md:h-18";
  };

  const getFontSize = () => {
    if (len > 12) return "text-base md:text-xl";
    if (len > 8) return "text-xl md:text-3xl";
    return "text-3xl md:text-5xl";
  };

  return (
    <div className="relative flex flex-wrap gap-2 md:gap-3 justify-center items-center py-12 w-full max-w-full mx-auto select-none overflow-visible">
      {/* BACKGROUND FLASH (WIN: Accent Color | MISTAKE: Red) */}
      <AnimatePresence>
        {showWinJuice && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.15, scale: 1.2 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-full blur-[80px] pointer-events-none z-0"
            style={{ backgroundColor: accent }}
          />
        )}
        {showMistakeJuice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-red-600 blur-[60px] pointer-events-none z-0"
          />
        )}
      </AnimatePresence>

      {/* FLOATING XP TEXT */}
      <AnimatePresence>
        {showWinJuice && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.5 }}
            animate={{ opacity: [0, 1, 1, 0], y: -120, scale: 1.3 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute z-50 pointer-events-none"
          >
            <div className="flex flex-col items-center">
              <span
                className="text-4xl md:text-6xl font-black italic drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                style={{ color: accent }}
              >
                +{xpGained} XP
              </span>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mt-2 bg-black/10 px-2 py-1 rounded">
                Word Obliterated!
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WORD LETTERS */}
      {wordLetters.map((letter, index) => {
        if (letter === " ")
          return <div key={index} className="w-4 md:w-8 h-1" />;

        const isRevealed = guessedLetters.includes(letter);
        const showMissed = isLost && !isRevealed;

        return (
          <div
            key={index}
            className={`
              relative flex items-center justify-center transition-all duration-300
              ${getBoxSize()} 
              border-b-[3px] md:border-b-[4px]
              ${isRevealed ? "border-[#75c32c]" : showMissed ? "border-red-500" : "border-zinc-800 dark:border-zinc-200"}
            `}
          >
            <span
              className={`
                font-black transition-all duration-300 uppercase
                ${getFontSize()}
                ${isRevealed ? "text-[#75c32c]" : "text-zinc-800 dark:text-zinc-100"}
                ${showMissed ? "text-red-500 animate-pulse" : ""}
                ${!isRevealed && !showMissed ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}
                ${isWon ? "animate-bounce" : ""}
              `}
              style={{
                color: isRevealed && !isLost ? accent : undefined,
                animationDelay: `${index * 50}ms`,
              }}
            >
              {isRevealed || isLost ? letter : ""}
            </span>

            {/* PARTICLE SYSTEM */}
            {showWinJuice && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full animate-particle-burst"
                    style={{
                      backgroundColor: accent,
                      "--dx": `${(Math.random() - 0.5) * 150}px`,
                      "--dy": `${(Math.random() - 1) * 150}px`,
                      animationDelay: `${index * 30}ms`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}

      <style jsx>{`
        @keyframes particle-burst {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy)))
              scale(0);
            opacity: 0;
          }
        }
        .animate-particle-burst {
          animation: particle-burst 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  );
}
