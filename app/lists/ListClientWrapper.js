"use client";

import { useState } from "react";
import ListDisplay from "@components/ListDisplay";
import MacroPractice from "../../components/training/MacroPractice";
import { ChevronLeft, AlertCircle, BookOpen } from "lucide-react";

export default function ListClientWrapper({ wordsList, listerror }) {
  const [view, setView] = useState("list");

  // --- Error State ---
  if (listerror || !wordsList) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-black text-gray-800 dark:text-white">List Not Found</h2>
        <p className="text-gray-500 max-w-xs mt-2 mb-6">
          We couldn't load the collection. It might have been deleted or moved.
        </p>
        <button
          onClick={() => (window.location.href = "/lists")}
          className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-sm active:scale-95 transition-transform"
        >
          Explore Other Lists
        </button>
      </div>
    );
  }

  const hasWords = wordsList.words?.length > 0;

  return (
    <div className="relative min-h-screen pt-2 bg-white dark:bg-gray-950">

      {/* ── Back button — absolute so it doesn't push content down ── */}
      {/* <button
        onClick={() => (view === "practice" ? setView("list") : window.history.back())}
        className="absolute top-3 left-3 z-10 flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 active:scale-90 transition-transform"
        aria-label={view === "practice" ? "End session" : "Back"}
      >
        <ChevronLeft size={18} className="text-gray-700 dark:text-gray-200" />
      </button> */}

      {/* ── Page content ── */}
      <main className="max-w-2xl mx-auto">
        {view === "list" ? (
          hasWords ? (
            <ListDisplay
              title={wordsList.title}
              description={wordsList.description}
              words={wordsList.words}
              listId={wordsList._id}
              createdBy={wordsList.createdBy}
              practiceCount={wordsList.practiceCount || 0}
              onStartPractice={() => setView("practice")}
            />
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-8">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-300 dark:text-gray-600">
                <BookOpen size={28} />
              </div>
              <p className="text-gray-400 dark:text-gray-600 font-bold leading-relaxed">
                This collection is empty.<br />Add some words to get started!
              </p>
            </div>
          )
        ) : (
          <MacroPractice
            wordList={wordsList.words}
            listTitle={wordsList.title}
            listId={wordsList._id}
          />
        )}
      </main>
    </div>
  );
}
