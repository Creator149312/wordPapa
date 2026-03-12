'use client';
import { calculateLevel, getNextRank, calculateProgress } from '../lib/progression';
import { Coins, Shield } from 'lucide-react';
import { useProfile } from '../../../ProfileContext';

export default function LevelBar() {
  const { profile } = useProfile();
  
  const { xp, papaPoints } = profile;
  
  const currentRank = calculateLevel(xp);
  const nextRank = getNextRank(xp);
  const progress = calculateProgress(xp);

  // MAX LEVEL LOGIC
  const isMaxLevel = !nextRank;

  return (
    <div className="w-full animate-in fade-in slide-in-from-top-2 duration-700">
      <div className="relative group bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl border-2 border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        
        {/* Progress Bar Background */}
        <div 
          className="absolute bottom-0 left-0 h-1 transition-all duration-1000 ease-in-out opacity-60"
          style={{ 
            // If Max Level, keep the bar at 100%
            width: `${isMaxLevel ? 100 : progress}%`, 
            backgroundColor: currentRank.color,
            boxShadow: `0 0 10px ${currentRank.color}`
          }}
        />

        <div className="flex justify-between items-center px-4 py-2 relative z-10">
          
          {/* Rank & XP Section */}
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs transition-transform duration-500 group-hover:rotate-6 shadow-sm" 
                style={{ 
                  backgroundColor: `${currentRank.color}15`, 
                  color: currentRank.color, 
                  border: `2px solid ${currentRank.color}` 
                }}
              >
                {currentRank.level || 1}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1 opacity-60">
                <Shield size={8} style={{ color: currentRank.color }} />
                <span className="text-[8px] font-black uppercase tracking-tighter text-gray-500 dark:text-gray-400">
                  {currentRank.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-gray-700 dark:text-gray-200 uppercase tracking-tighter">
                  {xp.toLocaleString()} 
                  {/* Toggle display based on Max Level status */}
                  {isMaxLevel ? (
                    <span className="text-amber-500 ml-1"> (MAX RANK)</span>
                  ) : (
                    <span className="text-gray-400"> / {nextRank.minXP.toLocaleString()} XP</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Economy Display */}
          <div className="flex items-center gap-2">
             <div className="hidden sm:block text-right pr-2 border-r border-gray-100 dark:border-gray-800">
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-0.5">
                  {isMaxLevel ? 'Status' : 'Progress'}
                </p>
                <p className="text-[10px] font-black text-gray-600 dark:text-gray-300 leading-none">
                  {isMaxLevel ? 'LEGEND' : `${progress}%`}
                </p>
             </div>

             {/* Papa Points Pill */}
             <div className="bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-xl flex items-center gap-2 border border-amber-100 dark:border-amber-900/30">
                <Coins size={14} className="text-amber-500" />
                <span className="text-sm font-black text-amber-600 dark:text-amber-400">
                  {papaPoints.toLocaleString()}
                </span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}