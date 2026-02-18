"use client";

import { useState } from "react";
import Link from "next/link";
import Flashcards from "./Flashcards";
import AudioTypingPractice from "./AudioTypingPractice";
import SpeakingPractice from "./SpeakingPractice";

const ListDisplay = ({ title, description, words }) => {
  const [practiceMode, setPracticeMode] = useState(null);

  return (
    <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {title}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setPracticeMode("flashcards")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600 flex items-center justify-center"
          >
            <span className="inline md:hidden">🃏</span>
            <span className="hidden md:inline">Flashcards</span>
          </button>

          <button
            onClick={() => setPracticeMode("audio")}
            className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition-colors dark:bg-green-500 dark:hover:bg-green-600 flex items-center justify-center"
          >
            <span className="inline md:hidden">🎧</span>
            <span className="hidden md:inline">Listening</span>
          </button>

          <button
            onClick={() => setPracticeMode("speaking")}
            className="bg-purple-600 text-white px-4 py-2 rounded-md shadow hover:bg-purple-700 transition-colors dark:bg-purple-500 dark:hover:bg-purple-600 flex items-center justify-center"
          >
            <span className="inline md:hidden">🎤</span>
            <span className="hidden md:inline">Speaking</span>
          </button>

          {practiceMode && (
            <button
              onClick={() => setPracticeMode(null)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md shadow hover:bg-gray-400 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 flex items-center justify-center"
            >
              <span className="inline md:hidden">📋</span>
              <span className="hidden md:inline">List</span>
            </button>
          )}
        </div>
      </div>

      {practiceMode === "flashcards" ? (
        <Flashcards words={words} />
      ) : practiceMode === "audio" ? (
        <AudioTypingPractice words={words} />
      ) : practiceMode === "speaking" ? (
        <SpeakingPractice words={words} />
      ) : (
        <>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
          <ul className="space-y-3">
            {words.map((word, index) => (
              <li
                key={index}
                className="flex flex-col md:flex-row md:items-center justify-between bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Link
                  href={`/define/${word.word}`}
                  className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                  {word.word}
                </Link>
                <div className="text-gray-500 dark:text-gray-400 text-sm mt-2 md:mt-0 md:ml-4">
                  {word.wordData}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ListDisplay;
