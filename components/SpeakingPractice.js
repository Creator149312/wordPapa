"use client";

import { useState } from "react";

// Levenshtein distance
function levenshtein(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}

function calculateScore(spoken, target) {
  const distance = levenshtein(spoken.toLowerCase(), target.toLowerCase());
  const maxLen = Math.max(spoken.length, target.length);
  const similarity = 1 - distance / maxLen;
  return Math.round(similarity * 100);
}

export default function SpeakingPractice({ words }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const currentWord = words[currentIndex]?.word;

  const startRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      setFeedback("🎙️ Listening...");
    };

    recognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript;
      const similarityScore = calculateScore(spoken, currentWord);
      setScore(similarityScore);
      setFeedback(`You said "${spoken}". Score: ${similarityScore}/100`);
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      setFeedback(`Error: ${event.error}`);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const nextWord = () => {
    setFeedback("");
    setScore(null);
    setCurrentIndex((prev) => (prev + 1) % words.length);
  };

  return (
    <div className="space-y-4 text-center">
      <h1 className="text-3xl font-bold">{currentWord}</h1>

      {/* Mic button with animation */}
      <button
        onClick={startRecognition}
        className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto 
          ${isRecording ? "bg-red-600 animate-pulse" : "bg-blue-600"} 
          text-white shadow-lg transition-colors`}
      >
        🎤
      </button>

      <button
        onClick={nextWord}
        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md shadow hover:bg-gray-400 transition-colors"
      >
        Next Word
      </button>

      {feedback && (
        <p
          className={`text-lg font-medium ${
            score >= 80
              ? "text-green-600"
              : score >= 50
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {feedback}
        </p>
      )}
    </div>
  );
}
