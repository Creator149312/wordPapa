"use client";
import { useEffect, useState } from "react";
import {
  Trophy,
  Star,
  Sparkles,
  Coins,
  ArrowRight,
  Zap,
  ChevronRight,
} from "lucide-react";
import Confetti from "./Confetti";
import { useAudio } from "../hooks/useAudio";

export default function LevelUpModal({ rank, isOpen, onClose }) {
  const [showContent, setShowContent] = useState(false);
  const { playSynth } = useAudio();

  useEffect(() => {
    if (isOpen) {
      playSynth("LEVEL_UP");

      const timer = setTimeout(() => setShowContent(true), 600);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isOpen, playSynth]);

  if (!isOpen) return null;

  // Calculate rewards based on the new rank level
  const bonusAmount = rank.level * 100;
  const prevRankLevel = Math.max(1, rank.level - 1);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-hidden">
      {/* THE COLOR SWEEP FLASH */}
      <div
        className="absolute inset-0 animate-level-flash pointer-events-none"
        style={{ backgroundColor: rank.color }}
      />

      {/* BACKGROUND DIMMER */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-700 delay-500" />

      {/* THE REWARD CARD */}
      {showContent && (
        <div className="relative bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 text-center max-w-sm w-full border-[4px] border-zinc-900 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-500">
          <Confetti />

          {/* Rank Progression Header */}
          <div className="flex items-center justify-center gap-3 mb-6 opacity-60">
            <span className="text-xs font-black italic text-zinc-400">
              LVL {prevRankLevel}
            </span>
            <ChevronRight size={14} className="text-zinc-300" />
            <span
              className="text-xs font-black italic px-2 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-800"
              style={{ color: rank.color }}
            >
              LVL {rank.level}
            </span>
          </div>

          {/* Icon Header with Pulsing Aura */}
          <div className="mb-8 flex justify-center relative">
            <div
              className="absolute inset-0 bg-current rounded-full blur-2xl opacity-20 animate-pulse"
              style={{ color: rank.color }}
            />
            <div
              className="relative p-6 rounded-3xl border-[3px] border-zinc-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-bounce"
              style={{ backgroundColor: rank.color }}
            >
              <Trophy size={48} className="text-white" />
            </div>
          </div>

          {/* Rank Info */}
          <div className="space-y-1 mb-8">
            <div className="flex items-center justify-center gap-2">
              <Zap
                size={14}
                fill={rank.color}
                stroke="none"
                className="animate-pulse"
              />
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
                Rank Promoted
              </h2>
              <Zap
                size={14}
                fill={rank.color}
                stroke="none"
                className="animate-pulse"
              />
            </div>

            <h1
              className="text-6xl font-black uppercase italic tracking-tighter leading-none py-2 drop-shadow-[4px_4px_0px_rgba(0,0,0,0.1)]"
              style={{ color: rank.color }}
            >
              {rank.name}
            </h1>
          </div>

          {/* Reward Section */}
          <div className="space-y-3 mb-8">
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-5 border-2 border-dashed border-zinc-200 dark:border-zinc-700 relative overflow-hidden">
              {/* Internal Background Label */}
              <p className="text-[9px] font-black text-zinc-300 dark:text-zinc-600 uppercase tracking-widest mb-2">
                Claimed Rewards
              </p>

              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-4 py-2 rounded-xl border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <Coins
                    size={18}
                    className="text-amber-500"
                    fill="currentColor"
                  />
                  <span className="text-lg font-black text-zinc-900 dark:text-zinc-100">
                    +{bonusAmount}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-4 py-2 rounded-xl border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <Star
                    size={18}
                    className="text-sky-500"
                    fill="currentColor"
                  />
                  <span className="text-lg font-black text-zinc-900 dark:text-zinc-100">
                    PRO
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[11px] font-bold text-zinc-500 italic px-4">
              "Your legend grows. New challenges await in the {rank.name}{" "}
              arena."
            </p>
          </div>

          {/* Continue Button */}
          <button
            onClick={onClose}
            className="group w-full py-5 rounded-2xl font-black uppercase italic tracking-widest text-sm text-white border-2 border-zinc-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-3"
            style={{ backgroundColor: rank.color }}
          >
            Enter Arena
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes level-flash {
          0% {
            transform: scale(0);
            border-radius: 100%;
            opacity: 1;
          }
          40% {
            transform: scale(2.5);
            border-radius: 20%;
            opacity: 1;
          }
          100% {
            transform: scale(3);
            border-radius: 0%;
            opacity: 1;
          }
        }
        .animate-level-flash {
          animation: level-flash 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  );
}
