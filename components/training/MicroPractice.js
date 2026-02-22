"use client";

import { useEffect, useState } from "react";
import QuizFlow from "./QuizFlow";

export default function MicroPractice({ word }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWordData() {
      try {
        const res = await fetch(`/api/words?word=${encodeURIComponent(word)}`);
        const data = await res.json();

        // Helper: pick a random example sentence
        const examples = data.entries?.[0]?.examples || [];
        const randomSentence = (fallback) => {
          if (examples.length === 0) return fallback;
          const idx = Math.floor(Math.random() * examples.length);
          return examples[idx];
        };

        const generatedQuestions = [
          { type: "speaking", word },
          { type: "audioTyping", word },
          {
            type: "sentenceMaking",
            sentence: randomSentence(`I use ${word} in a sentence.`),
          },
          {
            type: "wordPlacement",
            sentence: randomSentence(`This is a sample sentence using ${word}.`),
            practiceWord: word,
          },
        ];

        setQuestions(generatedQuestions);
      } catch (err) {
        console.error("Error fetching word data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchWordData();
  }, [word]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        {/* Animated Loading Spinner */}
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">
          Preparing your practice session...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Introduction Card */}
      {/* <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-200 dark:shadow-none mb-8">
        <div className="flex flex-col items-center text-center space-y-2">
          <span className="text-blue-100 text-xs font-bold uppercase tracking-[0.2em]">
            Vocabulary Mission
          </span>
          <h1 className="text-4xl font-black capitalize tracking-tight">
            {word}
          </h1>
          <div className="w-12 h-1 bg-white/30 rounded-full mt-2" />
          <p className="text-blue-100/80 text-sm max-w-xs pt-2">
            Complete the following 4 exercises to master this word.
          </p>
        </div>
      </div> */}

      {/* The Quiz Flow Component */}
      <div className="relative">
        <QuizFlow questions={questions} />
      </div>

      {/* Footer Info */}
      <div className="text-center pb-8">
        <p className="text-xs text-gray-400 font-medium italic">
          Tip: Listen carefully to the pronunciation in the audio rounds!
        </p>
      </div>
    </div>
  );
}