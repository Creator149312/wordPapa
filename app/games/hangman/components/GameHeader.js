"use client";
import { useState } from "react";
import {
  Globe,
  Tag,
  Timer,
  AlertTriangle,
  X,
  Check,
  ArrowLeft,
  Activity,
  Layers,
  Trophy,
  Coins,
  Zap,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

export default function GameHeader({
  gameMode,
  category,
  timeLeft,
  onQuit,
  streak,
  playerRank,
  papaPoints = 0,
  wrongCount = 0,
  maxTries = 6,
  journeyXP = 0,
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const isEndless = gameMode === "endless" || gameMode === "Endless Run";
  const isOnline = gameMode === "online";

  // Use the rank's accent color as the primary theme color
  const themeColor = playerRank?.color || "#75c32c";

  const handleQuitClick = () => {
    // Show confirmation for high-stakes modes
    if (isOnline || isEndless) setShowConfirm(true);
    else onQuit();
  };

  return (
    <div className="flex justify-between items-center mb-2 sm:mb-4 relative px-1 transition-colors duration-300">
      {/* LEFT SIDE: ACTIONS & RANK STATUS */}
      <div className="flex items-center gap-2 md:gap-3">
        {!showConfirm ? (
          <button
            onClick={handleQuitClick}
            className="group flex items-center gap-2 px-3 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="hidden sm:inline text-[10px] font-black uppercase tracking-wider">
              Quit
            </span>
          </button>
        ) : (
          <div className="flex items-center gap-3 bg-red-600 text-white px-3 py-2 rounded-full animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-[10px] font-black uppercase tracking-tighter flex items-center gap-2">
              <AlertTriangle size={14} />
              <span className="hidden xs:inline">Forfeit?</span>
            </span>
            <div className="flex gap-2 pl-2 bg-black/20 rounded-full py-0.5 px-2">
              <button
                onClick={onQuit}
                className="hover:scale-125 transition-transform"
              >
                <Check size={16} />
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="hover:scale-125 transition-transform"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Rank Badge: Shows the current Rank Name and Icon */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/50">
          <div style={{ color: themeColor }}>
            {/* If the rank has a specific icon string, you can render it, 
                otherwise we use a fallback Trophy icon */}
            {playerRank?.icon ? (
              <span className="text-sm">{playerRank.icon}</span>
            ) : (
              <Trophy size={14} />
            )}
          </div>
          <span className="hidden md:block text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
            {playerRank?.name || "Rookie"}
          </span>
        </div>

        {/* Streak Counter with Rank Glow */}
        {streak > 0 && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-full text-white shadow-lg transition-all duration-500"
            style={{
              backgroundColor: themeColor,
              boxShadow: `0 4px 12px ${themeColor}40`,
            }}
          >
            <span className="text-[10px] font-black tracking-widest">
              {streak}
            </span>
          </div>
        )}
      </div>

      {/* RIGHT SIDE: CATEGORY & GAME MODE */}
      <div className="flex items-center gap-2">
        {/* Category Pill (Hidden in Online/Endless to keep it clean) */}
        {!isOnline && !isEndless && (
          <div className="hidden xs:flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
            <Layers size={13} style={{ color: themeColor }} />
            <span className="text-[10px] font-black uppercase tracking-[0.15em] opacity-80">
              {category || "General"}
            </span>
          </div>
        )}

        {/* Mode Pill */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 transition-all duration-300">
          {isOnline ? (
            <>
              <Globe size={14} className="text-blue-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Online
              </span>
            </>
          ) : (
            <>
              <Tag size={14} style={{ color: themeColor }} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {isEndless ? category || "Endless" : "Classic"}
              </span>
            </>
          )}
        </div>

        {/* Timer (For Online Mode) */}
        {isOnline && (
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-black text-xs tabular-nums transition-all ${
              timeLeft < 15
                ? "bg-red-500 text-white animate-pulse"
                : "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
            }`}
          >
            <Timer size={14} strokeWidth={3} />
            <span>{timeLeft}s</span>
          </div>
        )}

        {/* Journey XP pill — shown only in Journey mode */}
        {journeyXP > 0 && (
          <motion.div
            key={journeyXP}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full border"
            style={{
              backgroundColor: `${themeColor}15`,
              borderColor: `${themeColor}30`,
              color: themeColor,
            }}
          >
            <Zap size={12} fill="currentColor" fillOpacity={0.7} />
            <span className="text-[11px] font-black tabular-nums tracking-tight">
              {journeyXP.toLocaleString()}
            </span>
          </motion.div>
        )}

        {/* --- PAPA COINS (The very right) --- */}
        <motion.div
          key={papaPoints} // Triggers animation on value change
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
        >
          <Coins
            size={14}
            className="animate-pulse"
            fill="currentColor"
            fillOpacity={0.2}
          />
          <span className="text-[11px] sm:text-xs font-black tabular-nums tracking-tight">
            {papaPoints.toLocaleString()}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
