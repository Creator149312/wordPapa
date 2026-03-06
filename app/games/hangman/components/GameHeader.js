'use client';
import { useState } from 'react';
import { RotateCcw, Globe, Tag, Timer, AlertTriangle, X, Check } from 'lucide-react';

export default function GameHeader({ gameMode, category, timeLeft, onQuit }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleQuitClick = () => {
    // If it's a solo mode, just quit. If it's online, ask first.
    if (gameMode === 'online') {
      setShowConfirm(true);
    } else {
      onQuit();
    }
  };

  return (
    <div className="flex justify-between items-center mb-10 relative">
      {/* QUIT BUTTON / CONFIRMATION OVERLAY */}
      <div className="flex items-center">
        {!showConfirm ? (
          <button 
            onClick={handleQuitClick} 
            className="group flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 hover:text-red-500 transition-colors"
          >
            <RotateCcw size={12} className="group-hover:rotate-[-120deg] transition-transform" />
            Quit Game
          </button>
        ) : (
          <div className="flex items-center gap-3 bg-red-50 dark:bg-red-950/30 px-3 py-1.5 rounded-xl border border-red-100 dark:border-red-900/50 animate-in fade-in zoom-in duration-200">
            <span className="text-[9px] font-black uppercase text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertTriangle size={10} /> Forfeit Match?
            </span>
            <div className="flex gap-1">
              <button 
                onClick={onQuit}
                className="p-1 hover:bg-red-500 hover:text-white text-red-600 rounded-md transition-colors"
              >
                <Check size={14} />
              </button>
              <button 
                onClick={() => setShowConfirm(false)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 rounded-md transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* GAME INFO & TIMERS */}
      <div className="flex items-center gap-4">
        {gameMode === 'online' ? (
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-6:00 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
              <Globe size={12} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-widest">1vs1 Duel</span>
            </div>
            {/* Show category even in online mode for context */}
            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter mt-1 mr-2">{category}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <Tag size={12} className="text-[#75c32c]" strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-tighter">{category}</span>
          </div>
        )}

        {(gameMode === 'blitz' || gameMode === 'online') && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-black text-xs tabular-nums border ${
            timeLeft < 15 
              ? 'bg-red-100 text-red-600 border-red-200 animate-pulse' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
          }`}>
            <Timer size={14} /> {timeLeft}s
          </div>
        )}
      </div>
    </div>
  );
}