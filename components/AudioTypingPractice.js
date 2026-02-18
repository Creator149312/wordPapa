"use client";

import { useState, useEffect } from "react";

export default function AudioTypingPractice({ words }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [voices, setVoices] = useState([]);
  const [brianVoice, setBrianVoice] = useState(null);
  const [emmaVoice, setEmmaVoice] = useState(null);

  const currentWord = words[currentIndex]?.word;

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      const brian = availableVoices.find(
        (v) =>
          v.name ===
            "Microsoft Brian Online (Natural) - English (United States)" &&
          v.lang === "en-US"
      );
      const emma = availableVoices.find(
        (v) =>
          v.name ===
            "Microsoft Emma Online (Natural) - English (United States)" &&
          v.lang === "en-US"
      );

      setVoices(availableVoices);
      setBrianVoice(brian || null);
      setEmmaVoice(emma || null);
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const playAudio = () => {
    if (!currentWord) return;

    const utterance = new SpeechSynthesisUtterance(currentWord);

    if (currentIndex % 2 === 0 && brianVoice) {
      utterance.voice = brianVoice;
    } else if (emmaVoice) {
      utterance.voice = emmaVoice;
    }

    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    speechSynthesis.speak(utterance);
  };

  const checkAnswer = () => {
    if (input.trim().toLowerCase() === currentWord.toLowerCase()) {
      setFeedback("✅ Correct!");
    } else {
      setFeedback(`❌ Try again. The word was "${currentWord}".`);
    }
  };

  const nextWord = () => {
    setInput("");
    setFeedback("");
    setCurrentIndex((prev) => (prev + 1) % words.length);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={playAudio}
        className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        🔊 Play Audio
      </button>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type the word you heard"
        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring focus:ring-blue-200 dark:bg-gray-800 dark:text-gray-100"
      />

      <div className="flex gap-2">
        <button
          onClick={checkAnswer}
          className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition-colors dark:bg-green-500 dark:hover:bg-green-600"
        >
          Check
        </button>
        <button
          onClick={nextWord}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md shadow hover:bg-gray-400 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Next Word
        </button>
      </div>

      {feedback && (
        <p className="text-gray-800 dark:text-gray-100 font-medium">
          {feedback}
        </p>
      )}
    </div>
  );
}
