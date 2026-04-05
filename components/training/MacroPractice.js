"use client";

import { useEffect, useState } from "react";
import QuizFlow from "./QuizFlow";


export default function MacroPractice({ wordList, listTitle, listId }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function generateMacroQuestions() {
      try {
        // 1. Generate the pool of potential questions
        const pool = wordList.flatMap((item) => {
          const { word, wordData } = item;
          const challenges = [];

          // Challenge 1: Audio/Spelling (Always include)
          challenges.push({ type: "audioTyping", word });

          // Challenge 2: Matching + Reverse Matching (Only if definition exists)
          if (wordData || item.definition) {
            // Build a pool of 4 items for matching choices (current word + 3 distractors)
            const matchingOptions = [
              item,
              ...wordList.filter(w => w.word !== word).slice(0, 3)
            ];
            // Normal match: see definition, pick word
            challenges.push({
              type: "match",
              word: word,
              wordData: wordData || item.definition,
              fullList: matchingOptions,
            });
            // Reverse match: see word, pick definition
            challenges.push({
              type: "matchReverse",
              word: word,
              wordData: wordData || item.definition,
              fullList: matchingOptions,
            });
            // Word placement: fill in the target word in a context sentence
            const def = (wordData || item.definition).toLowerCase().replace(/\.$/, "");
            challenges.push({
              type: "wordPlacement",
              word: word,
              sentence: `A ${word} is ${def}.`,
              practiceWord: word,
            });
          }

          // Challenge 3: Speaking
          challenges.push({ type: "speaking", word });

          return challenges;
        });

        // 2. Deduplicate: one (type, word) combo per session
        const seen = new Set();
        const deduped = pool.filter(q => {
          const key = `${q.type}-${q.word}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        // 3. Shuffle and cap at 15 questions per session
        const shuffled = deduped.sort(() => Math.random() - 0.5);

        // Reorder to avoid back-to-back questions on the same word
        const reordered = [];
        const remaining = [...shuffled];
        while (remaining.length > 0) {
          const lastWord = reordered.length > 0 ? reordered[reordered.length - 1].word : null;
          const idx = lastWord != null ? remaining.findIndex((q) => q.word !== lastWord) : 0;
          if (idx === -1) {
            // All remaining items share the same word — just append them
            reordered.push(...remaining.splice(0));
          } else {
            reordered.push(remaining.splice(idx, 1)[0]);
          }
        }

        setQuestions(reordered.slice(0, 15));
      } catch (err) {
        console.error("Error generating word list practice:", err);
      } finally {
        setTimeout(() => setLoading(false), 800); // Tiny delay for smooth transition
      }
    }

    if (wordList?.length > 0) {
      generateMacroQuestions();
    }
  }, [wordList]);

  if (loading) {
    return (
      <div className="px-4 pt-4 space-y-4 animate-pulse">
        {/* Fake progress bar */}
        <div className="flex gap-1 px-0 pt-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-2 flex-1 rounded-full bg-gray-200 dark:bg-gray-800" />
          ))}
        </div>
        {/* Fake question card */}
        <div className="rounded-3xl bg-gray-100 dark:bg-gray-800 h-52" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <QuizFlow questions={questions} listTitle={listTitle} listId={listId} />
    </div>
  );
}
