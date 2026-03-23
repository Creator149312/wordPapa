"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins } from "lucide-react";
import { useAudio } from "../hooks/useAudio";

export default function WordDisplay({
  wordLetters,
  guessedLetters,
  isLost,
  isWon,
  wrongCount,
  xpGained = 0,
  coinsGained = 0,
  accent = "#75c32c",
}) {
  const { playSynth } = useAudio();
  const [showWinJuice, setShowWinJuice] = useState(false);
  const [showMistakeJuice, setShowMistakeJuice] = useState(false);

  // Captures rewards so they don't vanish if props reset to 0 for the next word
  const [displayRewards, setDisplayRewards] = useState({ xp: 0, coins: 0 });

  const prevWrongCount = useRef(wrongCount);
  const currentWordStr = wordLetters.join("");
  const len = wordLetters.length;

  // --- 1. RESET & WIN LOGIC ---
  useEffect(() => {
    if (isWon && xpGained > 0) {
      setDisplayRewards({ xp: xpGained, coins: coinsGained });

      // Trigger the "Pop" and Sound
      const rewardTimer = setTimeout(() => {
        setShowWinJuice(true);
        if (coinsGained > 0) playSynth("COIN");
      }, 200);

      // Strictly 3 seconds of visibility
      const hideTimer = setTimeout(() => {
        setShowWinJuice(false);
      }, 3200);

      return () => {
        clearTimeout(rewardTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [isWon, currentWordStr, xpGained, coinsGained, playSynth]);

  // Clean up juice if word changes before animation finishes
  useEffect(() => {
    setShowWinJuice(false);
  }, [currentWordStr]);

  // --- 2. MISTAKE JUICE ---
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
    <div className="relative flex flex-wrap gap-2 md:gap-3 justify-center items-center py-6 md:py-12 w-full max-w-full mx-auto select-none overflow-visible">
      {/* BACKGROUND GLOW */}
      <AnimatePresence>
        {showWinJuice && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.2, scale: 1.4 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-full blur-[100px] pointer-events-none z-0"
            style={{ backgroundColor: accent }}
          />
        )}
      </AnimatePresence>

      {/* REWARD OVERLAY */}
      <AnimatePresence>
        {showWinJuice && (
          <motion.div
            key={`reward-container-${currentWordStr}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            {/* XP FLOAT */}
            <motion.div
              initial={{ opacity: 0, y: 40, x: -30, scale: 0.5 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: -160,
                x: -50,
                scale: [0.5, 1.2, 1.2, 1.4],
              }}
              transition={{
                duration: 3, // Total animation time
                times: [0, 0.1, 0.8, 1],
                ease: "easeOut",
              }}
              className="absolute"
            >
              <span
                className="text-5xl md:text-7xl font-black italic drop-shadow-2xl"
                style={{
                  color: accent,
                  textShadow: `4px 4px 0px black`,
                }}
              >
                +{displayRewards.xp} XP
              </span>
            </motion.div>

            {/* COINS FLOAT */}
            <motion.div
              initial={{ opacity: 0, y: 40, x: 30, scale: 0.5 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: -120,
                x: 70,
                scale: [0.5, 1.3, 1.3, 1.5],
              }}
              transition={{
                duration: 3,
                delay: 0.1,
                times: [0, 0.1, 0.8, 1],
                ease: "easeOut",
              }}
              className="absolute flex items-center gap-3 bg-zinc-900/95 px-6 py-3 rounded-2xl border-2 border-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.5)]"
            >
              <Coins size={32} className="text-amber-400 animate-spin-slow" />
              <span className="text-4xl md:text-5xl font-black text-amber-400 italic">
                +{displayRewards.coins}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WORD LETTERS */}
      {wordLetters.map((letter, index) => {
        if (letter === " ")
          return <div key={`space-${index}`} className="w-4 md:w-8 h-1" />;
        const isRevealed = guessedLetters.includes(letter);
        const showMissed = isLost && !isRevealed;

        return (
          <div
            key={`${currentWordStr}-${index}`}
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
          </div>
        );
      })}

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
      `}</style>
    </div>
  );
}
