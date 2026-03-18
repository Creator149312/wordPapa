"use client";
import { Flame, Sparkles } from "lucide-react";

export default function GameTransitionOverlay({ duration = 1500, accent = "#75c32c" }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-zinc-950/90 backdrop-blur-md rounded-[2.5rem] animate-in fade-in zoom-in-95 duration-300 border-[3px] border-zinc-900 dark:border-zinc-100">

      {/* Dynamic Background Pulse using Rank Accent */}
      <div 
        className="absolute w-72 h-72 rounded-full animate-ping opacity-15" 
        style={{ backgroundColor: accent }}
      />

      <div className="relative flex flex-col items-center space-y-6">
        {/* Animated Icon Group */}
        <div className="relative">
          <div 
            className="p-6 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-bounce border-2 border-zinc-900"
            style={{ backgroundColor: accent }}
          >
            <Sparkles className="text-white w-12 h-12" />
          </div>
          <Flame className="absolute -top-4 -right-4 text-orange-500 animate-pulse" size={36} />
        </div>

        {/* Text Branding */}
        <div className="text-center">
          <h2 className="text-5xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter leading-none">
            Word Cleared!
          </h2>
          <p 
            className="font-black text-[10px] uppercase tracking-[0.4em] mt-4"
            style={{ color: accent }}
          >
            Ascending Further..
          </p>
        </div>

        {/* Progress Bar Loader */}
        <div className="w-64 h-4 bg-zinc-200 dark:bg-zinc-800 rounded-lg overflow-hidden border-2 border-zinc-900 dark:border-zinc-100">
          <div
            className="h-full transition-all ease-linear"
            style={{
              backgroundColor: accent,
              width: '0%',
              animation: `progress-grow ${duration}ms linear forwards`
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes progress-grow {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}