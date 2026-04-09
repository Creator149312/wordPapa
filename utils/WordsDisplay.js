"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const WordsDisplay = ({ length, words }) => {
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();
  const maxWordsToShow = 40;

  const handleToggle = () => setShowAll(!showAll);

  // Optimization: Prepare the displayed slice
  const displayedWords = showAll ? words : words.slice(0, maxWordsToShow);

  return (
    <Card className="mt-6 mb-8 bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
      {/* Header with theme accent */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
        <div className="h-5 w-1.5 bg-[#75c32c] rounded-full" />
        <h3 className="font-black text-lg uppercase tracking-wider text-gray-800 dark:text-gray-200">
          {length} Letter Words
        </h3>
        <span className="ml-auto text-xs font-bold text-gray-400 bg-white dark:bg-gray-900 px-2 py-1 rounded-md border border-gray-100 dark:border-gray-700">
          {words.length} Total
        </span>
      </div>

      <CardContent className="p-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {displayedWords.map((word, index) => (
            <span
              key={`${length}-${index}`}
              role="button"
              tabIndex={0}
              onClick={() => router.push(`/define/${word.toLowerCase()}`)}
              onKeyDown={(e) => e.key === "Enter" && router.push(`/define/${word.toLowerCase()}`)}
              className="px-4 py-2 text-sm md:text-base font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl hover:border-[#75c32c] hover:text-[#75c32c] transition-all duration-200 cursor-pointer"
            >
              {word}
            </span>
          ))}
        </div>

        {/* Themed Load More Button */}
        {words.length > maxWordsToShow && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleToggle}
              className="group flex items-center gap-2 px-6 py-2.5 bg-[#75c32c] hover:bg-[#64a825] text-white font-black text-sm uppercase tracking-widest rounded-xl transition-all duration-200 shadow-lg shadow-[#75c32c]/20 hover:shadow-[#75c32c]/40 hover:-translate-y-0.5 active:scale-95"
            >
              {showAll ? (
                <>Show Less <span className="opacity-70">↑</span></>
              ) : (
                <>View All {words.length} Words <span className="opacity-70">↓</span></>
              )}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WordsDisplay;
