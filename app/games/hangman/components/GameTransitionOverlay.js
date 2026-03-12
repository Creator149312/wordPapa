'use client';
import { Flame, Sparkles } from "lucide-react";

export default function GameTransitionOverlay() {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/40 dark:bg-black/40 backdrop-blur-md rounded-[1.5rem] md:rounded-[2rem] animate-in fade-in duration-300">
      
      {/* Decorative background pulse */}
      <div className="absolute w-64 h-64 bg-[#75c32c]/20 rounded-full animate-ping" />
      
      <div className="relative flex flex-col items-center space-y-4">
        {/* Animated Icon Group */}
        <div className="relative">
          <div className="bg-[#75c32c] p-4 rounded-full shadow-2xl animate-bounce">
            <Sparkles className="text-white w-8 h-8" />
          </div>
          <Flame className="absolute -top-2 -right-2 text-orange-500 animate-pulse" size={24} />
        </div>

        {/* Text Branding */}
        <div className="text-center">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
            Word Cleared!
          </h2>
          <p className="text-[#75c32c] font-bold text-sm uppercase tracking-widest mt-2 animate-pulse">
            Next Word Incoming...
          </p>
        </div>

        {/* Progress Bar Loader */}
        <div className="w-48 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-[#75c32c] animate-progress-fast" />
        </div>
      </div>

      <style jsx>{`
        @keyframes progress-fast {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress-fast {
          animation: progress-fast 2s linear forwards;
        }
      `}</style>
    </div>
  );
}