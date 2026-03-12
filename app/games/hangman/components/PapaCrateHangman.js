import React from 'react';
import { Package, Hammer, Trash2, ChevronDown, Utensils } from 'lucide-react';

export default function PapaCrateHangman({ wrongCount, maxWrong }) {
  // Calculate tilt angle based on wrong guesses
  // 0 errors = 0deg, Max errors = 45deg tilt before falling
  const tiltAngle = (wrongCount / maxWrong) * 45;
  const isGameOver = wrongCount >= maxWrong;

  return (
    <div className="relative w-full h-80 bg-orange-50 dark:bg-gray-800 rounded-[3rem] overflow-hidden border-b-8 border-orange-200 shadow-2xl flex flex-col items-center justify-end pb-12">
      
      {/* 1. The Hanging Rope (Crane) */}
      <div className="absolute top-0 w-1 h-32 bg-gray-400/40 z-0">
        <div className="absolute bottom-0 w-4 h-4 -left-1.5 rounded-full bg-gray-500" />
      </div>

      {/* 2. The Floating Crate & Papa */}
      <div 
        className="relative z-10 transition-all duration-700 ease-in-out flex flex-col items-center"
        style={{ 
          transform: `rotate(${isGameOver ? 180 : tiltAngle}deg) translateY(${isGameOver ? 200 : 0}px)`,
          opacity: isGameOver ? 0 : 1
        }}
      >
        {/* Papa (The Ghost icon represents the 'Spirit of Papa') */}
        <div className="relative mb-[-10px] animate-bounce" style={{ animationDuration: '3s' }}>
           <div className="bg-white p-2 rounded-full shadow-lg border-2 border-orange-100">
              <Utensils size={32} className="text-orange-500" />
           </div>
        </div>

        {/* The Crate */}
        <div className="bg-amber-700 w-32 h-20 rounded-lg shadow-xl border-t-4 border-amber-600 flex flex-col items-center justify-center p-2 relative">
          <Package size={40} className="text-amber-900/50" />
          
          {/* Support Ropes (Snapping) */}
          {[...Array(maxWrong)].map((_, i) => (
            <div 
              key={i}
              className={`absolute -top-10 w-0.5 h-10 bg-amber-900/40 transition-opacity duration-300 ${
                i < wrongCount ? 'opacity-0' : 'opacity-100'
              }`}
              style={{ left: `${(i + 1) * (100 / (maxWrong + 1))}%` }}
            />
          ))}
        </div>
      </div>

      {/* 3. The Ground / "The Mess" */}
      <div className="absolute bottom-0 w-full h-16 bg-orange-200 dark:bg-gray-700 flex items-center justify-center border-t-4 border-orange-300">
        <div className="flex gap-4">
          <Trash2 className={`text-orange-900/20 transition-all ${isGameOver ? 'scale-150 text-orange-900' : 'scale-100'}`} size={24} />
          <p className="text-[10px] font-black uppercase text-orange-900/40 tracking-widest mt-1">
            {isGameOver ? "Crate Spilled!" : "Keep the Crate Balanced"}
          </p>
          <Hammer className="text-orange-900/20" size={24} />
        </div>
      </div>

      {/* Warning Flash when close to losing */}
      {wrongCount === maxWrong - 1 && (
        <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none" />
      )}
    </div>
  );
}