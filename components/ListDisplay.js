"use client";

import { useState } from "react";
import Link from "next/link";
import Flashcards from "./Flashcards";
import AudioTypingPractice from "./AudioTypingPractice";
import SpeakingPractice from "./SpeakingPractice";
import PracticeProgress from "./PracticeProgress";
import {
  Headphones,
  Mic2,
  ListOrdered,
  ChevronRight,
  BookOpen,
  Trophy,
  Sparkles,
  Layout,
  Zap,
  Share2,
  CheckCircle,
  Users,
  Gamepad2,
} from "lucide-react";

const ListDisplay = ({ title, description, words = [], onStartPractice, listId, createdBy, practiceCount = 0 }) => {
  const [practiceMode, setPracticeMode] = useState(null);

  // Official list check using env var (comma-separated admin emails)
  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase());
  const isOfficial = createdBy && adminEmails.includes(createdBy.toLowerCase());

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

  const actionButtonBase =
    "inline-flex items-center justify-center gap-2 min-h-10 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.14em] transition-all active:scale-95";
  const actionButtonMuted =
    `${actionButtonBase} bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700`;

  return (
    <div className="max-w-5xl mx-auto pb-10 space-y-4 md:space-y-6">
      {/* 1. Sleek Header */}
      <header className="bg-white dark:bg-gray-900 rounded-[2rem] p-5 md:p-7 border border-gray-100 dark:border-gray-800 shadow-sm transition-all">
        {/* Row 1: meta badges + title */}
        <div className="space-y-1 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 bg-[#75c32c]/10 text-[#75c32c] text-[9px] font-black uppercase tracking-widest rounded-md">
              Collection
            </span>
            {isOfficial && (
              <span title="WordPapa Curated" className="flex items-center justify-center w-5 h-5 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-full">
                <CheckCircle size={12} strokeWidth={2.5} />
              </span>
            )}
            <span className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">
              {words.length} terms
            </span>
            {practiceCount > 0 && (
              <span className="flex items-center gap-1 text-gray-400 text-[9px] font-bold uppercase tracking-widest">
                <Users size={9} />
                {practiceCount} learner{practiceCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
            {title}
          </h1>
        </div>

        {/* Row 2: all action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Listen / Speak mode toggles */}
          <div className="flex items-center gap-1 p-1 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setPracticeMode(mode.id)}
                className={`inline-flex items-center justify-center gap-2 min-h-10 px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-[0.14em] transition-all ${
                  practiceMode === mode.id
                    ? `${mode.color} text-white shadow-md scale-105`
                    : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700"
                }`}
              >
                {mode.icon}
                {mode.label}
              </button>
            ))}
            {practiceMode && (
              <button
                onClick={() => setPracticeMode(null)}
                className="inline-flex items-center justify-center gap-2 min-h-10 px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-[0.14em] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                <ListOrdered size={16} />
                Exit
              </button>
            )}
          </div>

          {/* Quiz/Practice Button */}
          {onStartPractice && !practiceMode && (
            <button
              onClick={onStartPractice}
              className={`${actionButtonBase} bg-[#75c32c] text-white shadow-lg shadow-[#75c32c]/20 hover:opacity-90`}
            >
              <Zap size={16} strokeWidth={2.5} />
              Quiz
            </button>
          )}

          {/* Hangman Button */}
          {listId && !practiceMode && (
            <Link
              href={`/games/hangman?listId=${listId}`}
              className={`${actionButtonBase} bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:opacity-90`}
            >
              <Gamepad2 size={16} strokeWidth={2.5} />
              Hangman
            </Link>
          )}

          {/* Share Button */}
          {!practiceMode && (
            <button
              onClick={() => {
                const url = window.location.href;
                const shareTitle = `Check out this vocabulary list: ${title}`;
                if (navigator.share) {
                  navigator.share({ title: shareTitle, url });
                } else {
                  navigator.clipboard.writeText(`${shareTitle}\n${url}`);
                }
              }}
              className={actionButtonMuted}
            >
              <Share2 size={16} strokeWidth={2.5} />
              Share
            </button>
          )}
        </div>
      </header>

      {/* Progress Section */}
      {!practiceMode && listId && (
        <div className="mb-6">
          <PracticeProgress listId={listId} />
        </div>
      )}

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
