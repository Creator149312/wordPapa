import { Trophy } from 'lucide-react';
import Confetti from './Confetti';

export default function LevelUpModal({ rank, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div 
        className="relative bg-white dark:bg-gray-900 rounded-[2rem] p-8 text-center max-w-sm w-full border-t-8 shadow-2xl overflow-hidden"
        style={{ borderTopColor: rank.color }}
      >
        {/* Simple Confetti Trigger */}
        <Confetti />

        <div className="mb-4 flex justify-center">
          <div className="p-4 rounded-full bg-gray-50 dark:bg-gray-800">
            <Trophy size={48} style={{ color: rank.color }} />
          </div>
        </div>

        <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
          Rank Up!
        </h2>
        <h1 className="text-3xl font-black uppercase mb-4" style={{ color: rank.color }}>
          {rank.name}
        </h1>

        <p className="text-gray-500 text-sm mb-6">
          You've unlocked a new rank. Keep solving to reach Word Papa status!
        </p>

        <button 
          onClick={onClose}
          className="w-full py-3 rounded-xl font-black uppercase text-xs text-white shadow-md active:scale-95 transition-transform"
          style={{ backgroundColor: rank.color }}
        >
          Got it!
        </button>
      </div>
    </div>
  );
}