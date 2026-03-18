"use client";
import { useMemo } from "react";
import { Flag, Star, Trophy, Zap } from "lucide-react";
import { calculateLevel, calculateProgress, getNextRank } from "../lib/progression";

export default function MilestoneBanner({ streak, stageName, currentXP }) {
  // Calculate progress for the preview
  const stats = useMemo(() => {
    const levelInfo = calculateLevel(currentXP);
    const progress = calculateProgress(currentXP);
    const next = getNextRank(currentXP);
    return { levelInfo, progress, next };
  }, [currentXP]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none px-6">
      <div className="relative w-full max-w-sm bg-[#75c32c] border-[4px] border-zinc-900 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6 animate-banner-in-out">
        
        {/* Icons */}
        <Star className="absolute -top-6 -left-6 text-yellow-400 fill-yellow-400 rotate-12" size={48} />
        <Trophy className="absolute -bottom-6 -right-6 text-white rotate-[-12deg]" size={48} />
        
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex items-center gap-3">
            <Flag className="text-white animate-bounce" fill="white" />
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
              Milestone!
            </h2>
          </div>
          
          <div className="space-y-1">
            <p className="text-zinc-900 font-black uppercase text-xs tracking-widest">
              {streak} Words Mastered
            </p>
            <p className="text-white font-bold italic text-sm">
              Rank: {stats.levelInfo.name}
            </p>
          </div>

          {/* MINI PROGRESS PREVIEW */}
          <div className="w-full bg-zinc-900/20 rounded-xl p-3 border-2 border-zinc-900/30">
            <div className="flex justify-between items-end mb-1">
              <span className="text-[10px] font-black text-zinc-900 uppercase">Next Rank</span>
              <span className="text-xs font-black text-white italic">{stats.progress}%</span>
            </div>
            
            {/* Sketchy Bar */}
            <div className="w-full h-3 bg-white/30 rounded-full border-2 border-zinc-900 overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-1000 ease-out"
                style={{ width: `${stats.progress}%` }}
              />
            </div>
            
            <p className="text-[9px] font-black text-zinc-900/60 uppercase mt-2 tracking-tighter">
              {stats.next ? `Need ${(stats.next.minXP - currentXP).toLocaleString()} XP for Level ${stats.levelInfo.level + 1}` : "Max Rank Reached!"}
            </p>
          </div>
        </div>

        {/* Decorative Background Scribble */}
        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 400 200">
           <path d="M10 10 L390 190 M390 10 L10 190" stroke="white" strokeWidth="1" strokeDasharray="5 5" />
        </svg>
      </div>

      <style jsx>{`
        @keyframes banner-in-out {
          0% { transform: scale(0) rotate(-10deg); opacity: 0; }
          15% { transform: scale(1.1) rotate(2deg); opacity: 1; }
          20% { transform: scale(1) rotate(0deg); }
          85% { transform: scale(1) rotate(0deg); opacity: 1; }
          100% { transform: scale(1.2) translateY(-100px); opacity: 0; }
        }
        .animate-banner-in-out {
          animation: banner-in-out 4s forwards cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
    </div>
  );
}