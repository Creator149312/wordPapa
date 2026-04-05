"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Sparkles } from "lucide-react";

export default function MatchingPractice({ wordList, isSingleRound = false, onCorrect, onComplete, reverseMode = false }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'correct' or 'wrong'

  const currentItem = wordList[currentIndex];

  useEffect(() => {
    if (currentItem) {
      if (reverseMode) {
        // Reverse: show the word as the prompt, pick the correct definition
        const correctDef = currentItem.wordData || currentItem.definition || "";
        const others = wordList
          .filter(i => i.word !== currentItem.word && (i.wordData || i.definition))
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map(i => i.wordData || i.definition);
        const combined = [correctDef, ...others].sort(() => 0.5 - Math.random());
        setOptions(combined);
      } else {
        // Normal: show the definition as the prompt, pick the correct word
        const correctWord = currentItem.word;
        const others = wordList
          .filter(i => i.word !== correctWord)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map(i => i.word);
        const combined = [correctWord, ...others].sort(() => 0.5 - Math.random());
        setOptions(combined);
      }
      setFeedback(null);
      setSelectedWord(null);
    }
  }, [currentIndex, wordList, reverseMode]);

  const correctAnswer = reverseMode
    ? (currentItem?.wordData || currentItem?.definition || "")
    : currentItem?.word;

  const handleSelect = (word) => {
    if (feedback) return; // Prevent multiple clicks
    setSelectedWord(word);
    if (word === correctAnswer) {
      setFeedback('correct');
      onCorrect?.();
      setTimeout(() => {
        if (isSingleRound) {
          if (onComplete) onComplete();
        } else if (currentIndex < wordList.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setFeedback('finished');
        }
      }, 1200);
    } else {
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback(null);
        setSelectedWord(null);
      }, 1000);
    }
  };

  if (feedback === 'finished' && !isSingleRound) {
    return <div className="text-center p-10 font-black text-[#75c32c]">List Mastered! ✨</div>;
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 border-2 border-gray-100 dark:border-gray-800 shadow-sm text-center">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-4">
          {reverseMode ? "Pick the Definition" : "Match Definition"} {currentIndex + 1}/{wordList.length}
        </span>

        {reverseMode ? (
          <h2 className="text-3xl font-black text-gray-800 dark:text-gray-100 leading-tight capitalize">
            {currentItem.word}
          </h2>
        ) : (
          <h2 className="text-xl md:text-2xl font-black text-gray-800 dark:text-gray-100 leading-tight">
            "{currentItem.wordData || currentItem.definition}"
          </h2>
        )}
      </div>

      {/* Options */}
      <div className={`grid gap-3 ${reverseMode ? "grid-cols-1" : "grid-cols-2"}`}>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleSelect(opt)}
            className={`p-4 rounded-2xl transition-all border-2 ${reverseMode ? "text-xs font-bold text-left" : "font-black text-lg text-center"} ${
              selectedWord === opt
                ? (feedback === 'correct' ? "bg-[#75c32c] text-white border-[#75c32c]" : "bg-red-500 text-white border-red-500 animate-shake")
                : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-100 dark:border-gray-800 hover:border-[#75c32c]"
            }`}
          >
            {reverseMode ? (opt.length > 80 ? opt.slice(0, 80) + "\u2026" : opt) : opt}
          </button>
        ))}
      </div>

      {/* Floating Feedback */}
      {feedback && (
        <div className="flex justify-center animate-bounce">
          {feedback === 'correct' ? (
            <div className="flex items-center gap-2 text-[#75c32c] font-black uppercase tracking-widest text-sm">
              <CheckCircle2 size={20} /> Correct!
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-500 font-black uppercase tracking-widest text-sm">
              <XCircle size={20} /> Try Again
            </div>
          )}
        </div>
      )}
    </div>
  );
}