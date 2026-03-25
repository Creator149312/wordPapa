"use client";

import { useState } from "react";
import ListDisplay from "@components/ListDisplay";
import MacroPractice from "../../components/training/MacroPractice";
import { ChevronLeft, AlertCircle } from "lucide-react";

export default function ListClientWrapper({ wordsList, listerror }) {
  const [view, setView] = useState("list");

  // --- Error State Handling ---
  if (listerror || !wordsList) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-black text-gray-800 dark:text-white">List Not Found</h2>
        <p className="text-gray-500 max-w-xs mt-2 mb-6">We couldn't load the collection. It might have been deleted or moved.</p>
        <button 
          onClick={() => window.location.href = "/lists"}
          className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-sm transition-transform active:scale-95"
        >
          Explore Other Lists
        </button>
      </div>
    );
  }

  const hasWords = wordsList.words?.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-500">
      <div className="mx-auto px-4 sm:px-6 py-8 max-w-4xl">
        
        {/* Sticky Header */}
        <header className="mb-8 flex items-center justify-between sticky top-4 z-30">
          <button
            onClick={() => {
              if (view === 'practice') {
                setView('list');
              } else {
                window.location.href = "/lists";
              }
            }}
            className="group flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#75c32c] transition-colors bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-1 pr-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"
          >
            <div className="p-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all group-hover:shadow-[#75c32c]/20">
              <ChevronLeft size={18} />
            </div>
            {view === 'practice' ? "End Session" : "Back to Lists"}
          </button>
        </header>

        <main className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          {view === 'list' ? (
            <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-3 shadow-2xl shadow-[#75c32c]/5 border border-white dark:border-gray-800/50">
              <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden">
                <ListDisplay
                  title={wordsList.title}
                  description={wordsList.description}
                  words={wordsList.words}
                />
                {!hasWords && (
                  <div className="p-16 text-center">
                    <p className="text-gray-400 font-bold italic">
                      "This garden is empty... time to plant some words!"
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-2">
              <MacroPractice wordList={wordsList.words} listTitle={wordsList.title} listId={wordsList._id} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}