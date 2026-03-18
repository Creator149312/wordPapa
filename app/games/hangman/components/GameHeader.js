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
  Trees,
  Sun,
  Home,
  School,
  Mountain,
  Crown,
  Waves,
  Orbit,
  Sparkles,
  Heart,
  Activity,
  Layers,
} from "lucide-react";

export default function GameHeader({
  gameMode,
  category,
  timeLeft,
  onQuit,
  streak,
  currentArena,
  wrongCount = 0, // Passed from Endless mode
  maxTries = 6,    // Defaults to 6 for Classic/Daily
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const isEndless = gameMode === "endless" || gameMode === "Endless Run";
  const isOnline = gameMode === "online";

  const handleQuitClick = () => {
    if (isOnline || isEndless) setShowConfirm(true);
    else onQuit();
  };

  const getArenaIcon = (id) => {
    const iconMap = {
      1: <Sparkles size={14} />,
      2: <Home size={14} />,
      3: <Trees size={14} />,
      4: <School size={14} />,
      5: <Mountain size={14} />,
      6: <Trees size={14} />,
      7: <Crown size={14} />,
      8: <Waves size={14} />,
      9: <Sun size={14} className="animate-spin-slow" />,
      10: <Orbit size={14} className="animate-pulse" />,
    };
    return iconMap[id] || <Trees size={14} />;
  };

  return (
    <div className="flex justify-between items-center mb-2 sm:mb-4 relative px-1 transition-colors duration-300">
      {/* LEFT SIDE: ACTIONS & HEALTH/ARENA */}
      <div className="flex items-center gap-2 md:gap-3">
        {!showConfirm ? (
          <button
            onClick={handleQuitClick}
            className="group flex items-center gap-2 px-3 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline text-[10px] font-black uppercase tracking-wider">Quit</span>
          </button>
        ) : (
          <div className="flex items-center gap-3 bg-red-600 text-white px-3 py-2 rounded-full animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-[10px] font-black uppercase tracking-tighter flex items-center gap-2">
              <AlertTriangle size={14} /> <span className="hidden xs:inline">Forfeit?</span>
            </span>
            <div className="flex gap-2 pl-2 bg-black/20 rounded-full py-0.5 px-2">
              <button onClick={onQuit} className="hover:scale-125 transition-transform"><Check size={16} /></button>
              <button onClick={() => setShowConfirm(false)} className="hover:scale-125 transition-transform"><X size={16} /></button>
            </div>
          </div>
        )}

        {/* Health (Endless) or Arena (Classic) Badge */}
        {isEndless ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shadow-sm">
            <Heart size={14} fill="currentColor" className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
              {Math.max(0, maxTries - wrongCount)} HP
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-0 md:gap-2 px-3 py-2 rounded-full transition-all duration-300 bg-zinc-100 dark:bg-zinc-800">
            <div style={{ color: currentArena?.accent || "#75c32c" }}>{getArenaIcon(currentArena?.id)}</div>
            <span className="hidden md:block text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100">{currentArena?.name || "Stage 1"}</span>
          </div>
        )}

        {streak > 0 && (
          <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-white shadow-lg ${isEndless ? 'bg-rose-600 shadow-rose-500/20' : 'bg-orange-500 shadow-orange-500/20'}`}>
            <span className="text-[10px] font-black tracking-widest">{streak}</span>
          </div>
        )}
      </div>

      {/* RIGHT SIDE: CATEGORY & STATUS */}
      <div className="flex items-center gap-2">
        {/* We hide the secondary category pill in Endless mode since it's now in the main Mode Pill */}
        {!isOnline && !isEndless && (
          <div className="hidden xs:flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-transparent dark:border-zinc-700/50">
            <Layers size={13} className="text-[#75c32c]" />
            <span className="text-[10px] font-black uppercase tracking-[0.15em] opacity-80">
              {category || "General"}
            </span>
          </div>
        )}

        {/* MODE/CATEGORY PILL */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 transition-all duration-300">
          {isOnline ? (
            <>
              <Globe size={14} className="text-blue-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Online</span>
            </>
          ) : isEndless ? (
            <>
              <Tag size={14} className="text-rose-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {category || "Endless"}
              </span>
            </>
          ) : (
            <>
              <div style={{ color: currentArena?.accent || "#75c32c" }}><Tag size={14} /></div>
              <span className="text-[10px] font-black uppercase tracking-widest">Classic</span>
            </>
          )}
        </div>

        {/* TIMER (Online Only) */}
        {isOnline && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-black text-xs tabular-nums transition-all ${timeLeft < 15 ? "bg-red-500 text-white animate-pulse" : "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"}`}>
            <Timer size={14} strokeWidth={3} />
            <span>{timeLeft}s</span>
          </div>
        )}
      </div>
    </div>
  );
}