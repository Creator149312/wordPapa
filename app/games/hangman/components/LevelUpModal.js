import { Trophy, Star, Sparkles, Coins } from 'lucide-react';
import Confetti from './Confetti';

export default function LevelUpModal({ rank, isOpen, onClose }) {
  if (!isOpen) return null;

  // Bonus calculation to show in UI
  const bonusAmount = rank.level * 100;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div 
        className="relative bg-white dark:bg-gray-950 rounded-[2.5rem] p-8 text-center max-w-sm w-full border-2 shadow-2xl overflow-hidden"
        style={{ borderColor: `${rank.color}40` }}
      >
        {/* Background Decorative Glow */}
        <div 
          className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-[80px] opacity-30"
          style={{ backgroundColor: rank.color }}
        />
        
        <Confetti />

        {/* Icon Header */}
        <div className="mb-6 flex justify-center relative">
          <div 
            className="absolute inset-0 scale-150 blur-2xl opacity-20 rounded-full"
            style={{ backgroundColor: rank.color }}
          />
          <div className="relative p-5 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-inner">
            <Trophy size={54} style={{ color: rank.color }} className="animate-bounce" />
          </div>
          <div className="absolute -bottom-2 -right-2 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700">
            <Star size={16} fill={rank.color} stroke={rank.color} />
          </div>
        </div>

        {/* Rank Info */}
        <div className="space-y-1 mb-6">
          <div className="flex items-center justify-center gap-2">
            <Sparkles size={12} style={{ color: rank.color }} />
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
              New Stage Unlocked
            </h2>
            <Sparkles size={12} style={{ color: rank.color }} />
          </div>
          
          <h1 className="text-4xl font-black uppercase tracking-tight" style={{ color: rank.color }}>
            {rank.name}
          </h1>
          
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-[10px] font-black text-gray-500 uppercase">
              Level {rank.level}
            </span>
            <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-[10px] font-black text-gray-500 uppercase">
              CEFR {rank.cefr}
            </span>
          </div>
        </div>

        {/* Stage Name & Reward Card */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-5 mb-8 border border-gray-100 dark:border-gray-800">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Current Arena</p>
          <p className="text-lg font-black text-gray-700 dark:text-gray-200 mb-4 italic">
            "{rank.stageName}"
          </p>
          
          <div className="flex items-center justify-center gap-3 py-2 border-t border-gray-100 dark:border-gray-800">
             <div className="flex items-center gap-1.5 bg-amber-500/10 px-4 py-2 rounded-xl">
                <Coins size={16} className="text-amber-500" fill="currentColor" />
                <span className="text-lg font-black text-amber-600">+{bonusAmount}</span>
             </div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={onClose}
          className="w-full py-4 rounded-2xl font-black uppercase text-sm text-white shadow-xl hover:brightness-110 active:scale-95 transition-all"
          style={{ 
            backgroundColor: rank.color,
            boxShadow: `0 10px 20px -5px ${rank.color}60`
          }}
        >
          Continue Journey
        </button>
        
        <p className="mt-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest opacity-50">
          The path to Word Papa continues...
        </p>
      </div>
    </div>
  );
}