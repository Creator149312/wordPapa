'use client';
import { useState } from 'react';
import { 
  Globe, Tag, Timer, AlertTriangle, X, Check, 
  ArrowLeft, Heart, Trees, BookOpen, FlaskConical 
} from 'lucide-react';
import { useProfile } from '../../../ProfileContext';

export default function GameHeader({ 
  gameMode, 
  category, 
  timeLeft, 
  onQuit, 
  streak, 
  currentArena // Passed from useGameLogic
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const { profile } = useProfile();

  const handleQuitClick = () => {
    if (gameMode === 'online') {
      setShowConfirm(true);
    } else {
      onQuit();
    }
  };

  // Arena-specific icon and styling logic
  const getArenaTheme = () => {
    switch (currentArena?.id) {
      case 'laboratory':
        return { icon: <FlaskConical size={12} />, color: 'text-purple-500', bg: 'bg-purple-500/10' };
      case 'library':
        return { icon: <BookOpen size={12} />, color: 'text-blue-500', bg: 'bg-blue-500/10' };
      default:
        return { icon: <Trees size={12} />, color: 'text-[#75c32c]', bg: 'bg-[#75c32c]/10' };
    }
  };

  const theme = getArenaTheme();

  return (
    <div className="flex justify-between items-center mb-6 relative">
      {/* LEFT SIDE: ACTIONS & ARENA INFO */}
      <div className="flex items-center gap-3">
        {!showConfirm ? (
          <button 
            onClick={handleQuitClick} 
            className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-red-50 dark:bg-gray-800 dark:hover:bg-red-950/30 transition-all duration-300"
          >
            <ArrowLeft size={14} className="text-gray-500 group-hover:text-red-500 group-hover:-translate-x-1 transition-all" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 group-hover:text-red-600">Quit</span>
          </button>
        ) : (
          <div className="flex items-center gap-3 bg-red-600 text-white px-3 py-1.5 rounded-full shadow-lg shadow-red-500/20 animate-in slide-in-from-left-2 duration-300">
            <span className="text-[10px] font-black uppercase tracking-tighter flex items-center gap-2">
              <AlertTriangle size={12} /> Forfeit?
            </span>
            <div className="flex gap-1 border-l border-white/20 pl-2">
              <button onClick={onQuit} className="p-0.5 hover:scale-125 transition-transform"><Check size={16} /></button>
              <button onClick={() => setShowConfirm(false)} className="p-0.5 hover:scale-125 transition-transform"><X size={16} /></button>
            </div>
          </div>
        )}

        {/* Dynamic Arena Badge */}
        <div className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full ${theme.bg} ${theme.color} border border-current/10`}>
          {theme.icon}
          <span className="text-[9px] font-black uppercase tracking-widest leading-none">
            {currentArena?.name || "Backyard"}
          </span>
        </div>

        {streak > 0 && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/20 text-orange-600 border border-orange-100 dark:border-orange-900/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span className="text-[10px] font-black tracking-widest">{streak} STREAK</span>
          </div>
        )}
      </div>

      {/* RIGHT SIDE: STATUS PILLS */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Lives Counter */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
          <Heart 
            size={12} 
            className={profile.lives > 0 ? "text-red-500 animate-pulse" : "text-gray-400"} 
            fill={profile.lives > 0 ? "currentColor" : "none"} 
          />
          <span className="text-[10px] font-black text-gray-700 dark:text-gray-200">
            {profile.lives}
          </span>
        </div>

        {/* Category Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
          {gameMode === 'online' ? (
            <Globe size={14} className="text-blue-500 animate-pulse" />
          ) : (
            <Tag size={14} className={theme.color} />
          )}
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-200">
            {category || 'Classic'}
          </span>
        </div>

        {/* Timer Pill */}
        {gameMode === 'online' && (
          <div className={`
            flex items-center gap-2 px-3 py-1.5 rounded-full font-black text-xs tabular-nums transition-all duration-300
            ${timeLeft < 15 
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse' 
              : 'bg-gray-900 text-white dark:bg-white dark:text-black'}
          `}>
            <Timer size={14} strokeWidth={3} />
            <span>{timeLeft}s</span>
          </div>
        )}
      </div>
    </div>
  );
}