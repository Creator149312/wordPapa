"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Sparkles } from "lucide-react";

export default function MatchingPractice({ wordList }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'correct' or 'wrong'

  const currentItem = wordList[currentIndex];

  useEffect(() => {
    if (currentItem) {
      // Create a bank of 4 words (1 correct + 3 random)
      const correctWord = currentItem.word;
      const others = wordList
        .filter(i => i.word !== correctWord)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(i => i.word);
      
      const combined = [correctWord, ...others].sort(() => 0.5 - Math.random());
      setOptions(combined);
      setFeedback(null);
      setSelectedWord(null);
    }
  }, [currentIndex, wordList]);

  const handleSelect = (word) => {
    if (feedback) return; // Prevent multiple clicks
    setSelectedWord(word);
    if (word === currentItem.word) {
      setFeedback('correct');
      setTimeout(() => {
        if (currentIndex < wordList.length - 1) {
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

  if (feedback === 'finished') {
    return <div className="text-center p-10 font-black text-[#75c32c]">List Mastered! ✨</div>;
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 border-2 border-gray-100 dark:border-gray-800 shadow-sm text-center">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-4">
          Match Definition {currentIndex + 1}/{wordList.length}
        </span>
        
        {/* The Definition */}
        <h2 className="text-xl md:text-2xl font-black text-gray-800 dark:text-gray-100 leading-tight">
          "{currentItem.wordData || currentItem.definition}"
        </h2>
      </div>

      {/* The Word Bank */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((word) => (
          <button
            key={word}
            onClick={() => handleSelect(word)}
            className={`p-4 rounded-2xl font-black text-lg transition-all border-2 ${
              selectedWord === word 
                ? (feedback === 'correct' ? "bg-[#75c32c] text-white border-[#75c32c]" : "bg-red-500 text-white border-red-500 animate-shake")
                : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-100 dark:border-gray-800 hover:border-[#75c32c]"
            }`}
          >
            {word}
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