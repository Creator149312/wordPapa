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
      <div className="px-4 pt-4 space-y-4 animate-pulse">
        <div className="flex gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-2 flex-1 rounded-full bg-gray-200 dark:bg-gray-800" />
          ))}
        </div>
        <div className="h-48 rounded-3xl bg-gray-100 dark:bg-gray-800" />
        <div className="h-14 rounded-2xl bg-gray-100 dark:bg-gray-800" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
      <QuizFlow questions={questions} />
    </div>
  );
}