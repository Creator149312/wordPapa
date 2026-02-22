"use client";

import { useState } from "react";
import ListDisplay from "@components/ListDisplay";
import MacroPractice from "../../../components/training/MacroPractice";
import { ChevronLeft, AlertCircle, PlayCircle, BookOpen } from "lucide-react";
import Link from "next/link";

export default function ListClientWrapper({ wordsList, listerror }) {
  const [view, setView] = useState("list");

  if (listerror || !wordsList) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center space-y-6">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">List Not Found</h2>
        <Link href="/dashboard" className="inline-block px-8 py-4 bg-[#75c32c] text-white rounded-2xl font-bold">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-500">
      <div className="mx-auto px-4 sm:px-6 py-8 max-w-4xl">
        
        {/* Navigation Header */}
        <header className="mb-8 flex items-center justify-between">
          <button
            onClick={() => view === 'practice' ? setView('list') : window.history.back()}
            className="group flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#75c32c] transition-colors"
          >
            <div className="p-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all group-hover:shadow-[#75c32c]/20">
              <ChevronLeft size={18} />
            </div>
            {view === 'practice' ? "Exit Practice" : "Back"}
          </button>
          
          <button
            onClick={() => setView(view === 'list' ? 'practice' : 'list')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#75c32c] text-white rounded-2xl font-black text-sm shadow-lg shadow-[#75c32c]/20 hover:scale-105 active:scale-95 transition-all"
          >
            {view === 'list' ? (
              <><PlayCircle size={18} /> Start Practice</>
            ) : (
              <><BookOpen size={18} /> View Word List</>
            )}
          </button>
        </header>

        <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {view === 'list' ? (
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl shadow-[#75c32c]/5 border border-white dark:border-gray-800">
              <div className="bg-white dark:bg-gray-900 rounded-[2.2rem] overflow-hidden">
                <ListDisplay
                  title={wordsList.title}
                  description={wordsList.description}
                  words={wordsList.words}
                />
              </div>
            </div>
          ) : (
            <div className="py-4">
              <MacroPractice wordList={wordsList.words} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}