"use client";
import { useEffect, useState } from "react";
import { Trophy, Star, Sparkles, Coins, ArrowRight } from 'lucide-react';
import Confetti from './Confetti';
import { useAudio } from "../hooks/useAudio"; // 1. Import Hook

export default function LevelUpModal({ rank, isOpen, onClose }) {
  const [showContent, setShowContent] = useState(false);
  const { playSynth } = useAudio(); // 2. Initialize Audio

  useEffect(() => {
    if (isOpen) {
      // 3. Play the Majestic Sound precisely when the flash starts
      playSynth("LEVEL_UP");
      
      const timer = setTimeout(() => setShowContent(true), 600);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isOpen, playSynth]);

  if (!isOpen) return null;

  const bonusAmount = rank.level * 100;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-hidden">
      
      {/* THE COLOR SWEEP FLASH */}
      <div 
        className="absolute inset-0 animate-level-flash pointer-events-none"
        style={{ backgroundColor: rank.color }}
      />
      
      {/* BACKGROUND DIMMER */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-700 delay-500" />

      {/* THE REWARD CARD */}
      {showContent && (
        <div className="relative bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 text-center max-w-sm w-full border-[4px] border-zinc-900 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-300">
          
          <Confetti />

          {/* Icon Header */}
          <div className="mb-8 flex justify-center relative">
            <div 
              className="relative p-6 rounded-3xl border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce"
              style={{ backgroundColor: rank.color }}
            >
              <Trophy size={48} className="text-white" />
            </div>
          </div>

          {/* Rank Info */}
          <div className="space-y-2 mb-8">
            <div className="flex items-center justify-center gap-2">
              <Sparkles size={14} style={{ color: rank.color }} />
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                Identity Shift Complete
              </h2>
              <Sparkles size={14} style={{ color: rank.color }} />
            </div>
            
            <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none py-2" style={{ color: rank.color }}>
              {rank.name}
            </h1>
          </div>

          {/* Reward Section */}
          <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-6 mb-8 border-2 border-dashed border-zinc-200 dark:border-zinc-700">
            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Journey Bonus</p>
            <div className="flex items-center justify-center gap-2 mb-4 bg-white dark:bg-zinc-900 px-4 py-2 rounded-xl border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
               <Coins size={20} className="text-amber-500" fill="currentColor" />
               <span className="text-xl font-black text-zinc-900 dark:text-zinc-100">+{bonusAmount}</span>
            </div>
            <p className="text-[10px] font-black text-zinc-500 italic">"Access to {rank.stageName} granted"</p>
          </div>

          {/* Continue Button */}
          <button 
            onClick={onClose}
            className="group w-full py-4 rounded-2xl font-black uppercase italic tracking-widest text-sm text-white border-2 border-zinc-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] active:translate-y-[2px] transition-all flex items-center justify-center gap-2"
            style={{ backgroundColor: rank.color }}
          >
            Enter Arena
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes level-flash {
          0% { transform: scale(0); border-radius: 100%; opacity: 1; }
          40% { transform: scale(2); border-radius: 0%; opacity: 1; }
          100% { opacity: 1; }
        }
        .animate-level-flash {
          animation: level-flash 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}