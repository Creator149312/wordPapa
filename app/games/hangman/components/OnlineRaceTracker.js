'use client';
import { Users } from 'lucide-react';

export default function OnlineRaceTracker({ myCount, oppCount, total, oppName }) {
  if (!oppName) return null;

  return (
    <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-800/40 rounded-[2rem] border border-slate-100 dark:border-slate-700 animate-in fade-in slide-in-from-top-4">
      <div className="flex justify-between items-end mb-3">
        {/* User Stats */}
        <div className="text-left">
          <p className="text-[10px] font-black text-[#75c32c] uppercase tracking-widest mb-1">You</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-gray-900 dark:text-white">{myCount}</span>
            <span className="text-xs font-bold text-gray-400">/ {total}</span>
          </div>
        </div>

        {/* Center VS Divider */}
        <div className="flex flex-col items-center pb-1">
          <div className="px-3 py-1 bg-white dark:bg-gray-900 rounded-full border border-gray-100 dark:border-gray-800 shadow-sm">
             <span className="text-[10px] font-black text-blue-500 italic">VS</span>
          </div>
        </div>

        {/* Opponent Stats */}
        <div className="text-right">
          <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">{oppName}</p>
          <div className="flex items-baseline justify-end gap-1">
            <span className="text-2xl font-black text-gray-900 dark:text-white">{oppCount}</span>
            <span className="text-xs font-bold text-gray-400">/ {total}</span>
          </div>
        </div>
      </div>

      {/* Visual Progress Bars */}
      <div className="relative h-3 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        {/* Your Progress */}
        <div 
          className="absolute left-0 top-0 h-full bg-[#75c32c] transition-all duration-700 ease-out z-10" 
          style={{ width: `${(myCount / total) * 100}%` }} 
        />
        {/* Opponent Progress (Ghost bar) */}
        <div 
          className="absolute left-0 top-0 h-full bg-red-400 opacity-30 transition-all duration-1000 ease-out z-0" 
          style={{ width: `${(oppCount / total) * 100}%` }} 
        />
      </div>
      
      <div className="mt-3 flex justify-center gap-4 text-[8px] font-black uppercase text-gray-400 tracking-tighter">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#75c32c]" /> Real-time Sync
        </div>
      </div>
    </div>
  );
}