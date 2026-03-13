"use client";

import { useState } from "react";
import Link from "next/link";
import Flashcards from "./Flashcards";
import AudioTypingPractice from "./AudioTypingPractice";
import SpeakingPractice from "./SpeakingPractice";
import {
  Headphones,
  Mic2,
  ListOrdered,
  ChevronRight,
  BookOpen,
  Trophy,
  Sparkles,
  Layout,
} from "lucide-react";

const ListDisplay = ({ title, description, words = [] }) => {
  const [practiceMode, setPracticeMode] = useState(null);

  const modes = [
    {
      id: "audio",
      label: "Listen",
      icon: <Headphones size={16} />,
      color: "bg-[#75c32c]",
    },
    {
      id: "speaking",
      label: "Speak",
      icon: <Mic2 size={16} />,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-10 space-y-4 md:space-y-6">
      {/* 1. Sleek Header */}
      <header className="bg-white dark:bg-gray-900 rounded-[2rem] p-5 md:p-7 border border-gray-100 dark:border-gray-800 shadow-sm transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#75c32c]/10 text-[#75c32c] text-[9px] font-black uppercase tracking-widest rounded-md">
                Collection
              </span>
              <span className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">
                {words.length} Vocabulary Units
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
              {title}
            </h1>
          </div>

          {/* Practice Switcher */}
          <div className="flex items-center gap-1 p-1 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setPracticeMode(mode.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-black text-[10px] uppercase tracking-tighter transition-all ${
                  practiceMode === mode.id
                    ? `${mode.color} text-white shadow-md scale-105`
                    : "text-gray-500 hover:bg-white dark:hover:bg-gray-700"
                }`}
              >
                {mode.icon}
                <span
                  className={
                    practiceMode === mode.id ? "block" : "hidden sm:block"
                  }
                >
                  {mode.label}
                </span>
              </button>
            ))}

            {practiceMode && (
              <button
                onClick={() => setPracticeMode(null)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-black text-[10px] uppercase text-red-500 hover:bg-red-50 transition-all"
              >
                <ListOrdered size={16} />
                <span className="hidden sm:block">Exit</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {practiceMode === "audio" ? (
          <AudioTypingPractice words={words} />
        ) : practiceMode === "speaking" ? (
          <SpeakingPractice words={words} />
        ) : (
          <div className="space-y-8">
            {/* PRACTICE ZONE: Flashcards (Distinct visual section) */}
            <Flashcards words={words} />

            {/* REFERENCE ZONE: Word List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <Layout size={14} className="text-[#75c32c]" />
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Glossary Reference
                  </h2>
                </div>
              </div>

              {description && (
                <div className="mx-4 p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl flex items-start gap-3 shadow-sm">
                  <BookOpen
                    size={18}
                    className="text-[#75c32c] mt-0.5 shrink-0"
                  />
                  <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm leading-relaxed font-medium">
                    {description}
                  </p>
                </div>
              )}

              {/* Compact Word List Grid */}
              <div className="grid grid-cols-1 gap-2 px-2 md:px-0">
                {words.map((word, index) => (
                  <Link
                    key={index}
                    href={`/define/${word.word}`}
                    className="group flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 hover:border-[#75c32c] hover:shadow-lg transition-all active:scale-[0.98]"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <h3 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-[#75c32c] transition-colors capitalize">
                        {word.word}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-xs font-medium line-clamp-1 italic mt-0.5">
                        {word.wordData ||
                          word.definition ||
                          "Explore definition..."}
                      </p>
                    </div>
                    <div className="h-8 w-8 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-300 group-hover:bg-[#75c32c] group-hover:text-white transition-all shadow-sm">
                      <ChevronRight size={16} strokeWidth={3} />
                    </div>
                  </Link>
                ))}
              </div>

              {/* Footer CTA */}
              <div className="mx-2 bg-gray-900 dark:bg-white rounded-[2rem] p-6 text-center relative overflow-hidden group">
                <div className="absolute -top-4 -right-4 opacity-10 text-white dark:text-gray-900 group-hover:rotate-12 transition-transform">
                  <Sparkles size={80} />
                </div>
                <Trophy className="mx-auto mb-2 text-[#75c32c]" size={32} />
                <h4 className="text-white dark:text-gray-900 font-black text-sm uppercase tracking-tighter">
                  List Mastery
                </h4>
                <p className="text-gray-400 dark:text-gray-500 text-[10px] font-bold max-w-[200px] mx-auto mt-1 uppercase">
                  Complete all practice modes to achieve fluency.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ListDisplay;
