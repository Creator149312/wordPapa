'use client';
import Hangman from './Hangman';
import { GraduationCap } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black selection:bg-[#75c32c]/30 flex flex-col">
      {/* Background Glow - Condensed height */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 bg-gradient-to-b from-[#75c32c]/10 to-transparent blur-3xl -z-0 pointer-events-none" />

      {/* Game Area - Integrated with Header */}
      <main className="flex-grow w-full mx-auto px-3 md:px-6 pt-2 pb-8 relative z-20">
        <Hangman />
      </main>

      {/* Minimalist Footer */}
      {/* <footer className="w-full text-center py-4 opacity-30 hover:opacity-100 transition-all duration-500">
        <p className="text-[8px] font-black uppercase tracking-[0.3em] dark:text-white text-gray-400">
          WordPapa Engine v3.0
        </p>
      </footer> */}
    </div>
  );
}