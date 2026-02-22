"use client";

import MicroPractice from "../../../../components/training/MicroPractice";
import Link from "next/link";
import { ChevronLeft, LayoutDashboard, Zap } from "lucide-react";

export default function TrainingPage({ params }) {
  const { word } = params;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-500">
      {/* Top Navigation / Header */}
      <header className="max-w-4xl mx-auto px-4 py-6 sm:py-8 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Link 
              href="/dashboard" 
              className="hover:text-[#75c32c] transition-colors flex items-center gap-1"
            >
              <LayoutDashboard size={12} />
              <span>Dashboard</span>
            </Link>
            <span className="opacity-30">/</span>
            <span className="text-[#75c32c]">Training</span>
          </div>
          {/* <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Training Ground
          </h1> */}
        </div>

        {/* Status Badge - Now smaller and cleaner for mobile */}
        {/* <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-900 rounded-full border border-gray-100 dark:border-gray-800 shadow-sm shadow-[#75c32c]/10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#75c32c] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#75c32c]"></span>
          </span>
          <span className="hidden xs:inline text-[9px] font-black text-gray-600 dark:text-gray-400 uppercase tracking-tighter">
            Live Session
          </span>
        </div> */}
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 pb-20">
        {/* Container with the brand shadow glow */}
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-1.5 shadow-2xl shadow-[#75c32c]/10 border border-white dark:border-gray-800">
          <div className="bg-white dark:bg-gray-900 rounded-[2.2rem] overflow-hidden">
             <MicroPractice word={word} />
          </div>
        </div>

        {/* Footer Support Text - Slimmed down for mobile */}
        <footer className="mt-8 text-center">
          {/* <div className="flex justify-center items-center gap-8 py-4 px-6 bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
            <div className="flex flex-col items-center gap-1">
              <span className="text-lg">🎧</span>
              <span className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">Audio</span>
            </div>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-800" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-lg">🎤</span>
              <span className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">Mic</span>
            </div>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-800" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-lg">⚡</span>
              <span className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">Focus</span>
            </div>
          </div> */}
          
          {/* <p className="mt-6 text-[10px] font-bold text-gray-300 dark:text-gray-600 uppercase tracking-[0.2em]">
            WordPapa Training System v3.0
          </p> */}
        </footer>
      </main>
    </div>
  );
}