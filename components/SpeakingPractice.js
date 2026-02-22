"use client";

import { useState } from "react";
import { Mic, Square, ChevronRight, MicOff, Info } from "lucide-react";

/**
 * Optimized Levenshtein distance: O(n) space complexity.
 */
function getLevenshteinDistance(a, b) {
  if (a.length < b.length) [a, b] = [b, a];
  if (b.length === 0) return a.length;
  let prevRow = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let currRow = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      currRow[j] = Math.min(prevRow[j] + 1, currRow[j - 1] + 1, prevRow[j - 1] + cost);
    }
    prevRow = currRow;
  }
  return prevRow[b.length];
}

function calculateScore(spoken, target) {
  const cleanSpoken = spoken.toLowerCase().replace(/[.,!?;]/g, "").trim();
  const cleanTarget = target.toLowerCase().replace(/[.,!?;]/g, "").trim();
  if (cleanSpoken === cleanTarget) return 100;
  const distance = getLevenshteinDistance(cleanSpoken, cleanTarget);
  const maxLen = Math.max(cleanSpoken.length, cleanTarget.length);
  return Math.round((1 - distance / maxLen) * 100);
}

export default function SpeakingPractice({ words }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [spokenText, setSpokenText] = useState("");
  const [score, setScore] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const currentWord = words[currentIndex]?.word;

  const startRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported here. Try Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.onstart = () => {
      setIsRecording(true);
      setFeedback("Listening...");
      setScore(null);
      setSpokenText("");
    };

    recognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript;
      const simScore = calculateScore(spoken, currentWord);
      setSpokenText(spoken);
      setScore(simScore);
      setFeedback(simScore >= 90 ? "Excellent!" : simScore >= 70 ? "Good Effort!" : "Try Again");
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  return (
    <div className="flex flex-col gap-3 p-2 w-full max-w-md mx-auto">
      {/* 1. Word Display Area */}
      <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <span className="text-[9px] font-black uppercase tracking-widest text-[#75c32c]">
          Pronunciation {currentIndex + 1}/{words.length}
        </span>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white capitalize mt-1 leading-tight">
          {currentWord}
        </h1>
      </div>

      {/* 2. Compact Mic & Results Toggle */}
      <div className="bg-gray-50/50 dark:bg-gray-800/20 rounded-[2rem] p-4 flex flex-col items-center gap-4 border border-dashed border-gray-200 dark:border-gray-700">
        
        <div className="relative flex items-center justify-center h-20">
          {isRecording && (
            <div className="absolute w-24 h-24 border-4 border-[#75c32c] border-t-transparent rounded-full animate-spin" />
          )}
          <button
            onClick={startRecognition}
            disabled={isRecording}
            className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90 ${
              isRecording ? "bg-gray-900 text-[#75c32c]" : "bg-[#75c32c] text-white"
            }`}
          >
            {isRecording ? <Square size={20} fill="currentColor" /> : <Mic size={24} />}
          </button>
        </div>

        {/* Dynamic Feedback Area */}
        <div className="text-center min-h-[60px] flex items-center justify-center">
          {score !== null ? (
            <div className="animate-in fade-in slide-in-from-top-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter italic">"{spokenText}"</p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className={`text-3xl font-black ${score >= 80 ? "text-[#75c32c]" : "text-orange-500"}`}>
                  {score}%
                </span>
                <span className="text-[10px] font-black uppercase bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm">
                  {feedback}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              {isRecording ? "Listening..." : "Tap mic to speak"}
            </p>
          )}
        </div>
      </div>

      {/* 3. Action Row */}
      <div className="flex gap-2 items-center">
        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % words.length)}
          className="flex-1 bg-white dark:bg-gray-900 border-2 border-[#75c32c] text-[#75c32c] py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          Skip
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";

// // Levenshtein distance for fuzzy matching
// function levenshtein(a, b) {
//   const matrix = Array.from({ length: a.length + 1 }, () =>
//     Array(b.length + 1).fill(0)
//   );
//   for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
//   for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

//   for (let i = 1; i <= a.length; i++) {
//     for (let j = 1; j <= b.length; j++) {
//       const cost = a[i - 1] === b[j - 1] ? 0 : 1;
//       matrix[i][j] = Math.min(
//         matrix[i - 1][j] + 1,
//         matrix[i][j - 1] + 1,
//         matrix[i - 1][j - 1] + cost
//       );
//     }
//   }
//   return matrix[a.length][b.length];
// }

// function calculateScore(spoken, target) {
//   const cleanSpoken = spoken.toLowerCase().trim();
//   const cleanTarget = target.toLowerCase().trim();
//   const distance = levenshtein(cleanSpoken, cleanTarget);
//   const maxLen = Math.max(cleanSpoken.length, cleanTarget.length);
//   const similarity = 1 - distance / maxLen;
//   return Math.round(similarity * 100);
// }

// export default function SpeakingPractice({ words }) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [feedback, setFeedback] = useState("");
//   const [spokenText, setSpokenText] = useState("");
//   const [score, setScore] = useState(null);
//   const [isRecording, setIsRecording] = useState(false);

//   const currentWord = words[currentIndex]?.word;

//   const startRecognition = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       alert("Speech Recognition not supported in this browser.");
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.interimResults = false;

//     recognition.onstart = () => {
//       setIsRecording(true);
//       setFeedback("Listening...");
//       setScore(null);
//       setSpokenText("");
//     };

//     recognition.onresult = (event) => {
//       const spoken = event.results[0][0].transcript;
//       const similarityScore = calculateScore(spoken, currentWord);
//       setSpokenText(spoken);
//       setScore(similarityScore);
      
//       if (similarityScore >= 90) setFeedback("Excellent Pronunciation!");
//       else if (similarityScore >= 70) setFeedback("Good Effort!");
//       else setFeedback("Try to speak more clearly.");
//     };

//     recognition.onerror = (event) => {
//       setFeedback(`Error: ${event.error}`);
//       setIsRecording(false);
//     };

//     recognition.onend = () => {
//       setIsRecording(false);
//     };

//     recognition.start();
//   };

//   const nextWord = () => {
//     setFeedback("");
//     setScore(null);
//     setSpokenText("");
//     setCurrentIndex((prev) => (prev + 1) % words.length);
//   };

//   return (
//     <div className="max-w-md mx-auto p-8 space-y-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all">
//       {/* Header & Progress */}
//       <div className="text-center space-y-2">
//         <span className="text-xs font-bold uppercase tracking-widest text-blue-500">
//           Speaking Practice {currentIndex + 1}/{words.length}
//         </span>
//         <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
//           {currentWord}
//         </h1>
//       </div>

//       {/* Visual Feedback Area */}
//       <div className="relative flex flex-col items-center justify-center py-10">
//         {/* Animated Rings when recording */}
//         {isRecording && (
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="w-32 h-32 bg-red-400/20 rounded-full animate-ping" />
//             <div className="w-24 h-24 bg-red-400/30 rounded-full animate-pulse" />
//           </div>
//         )}

//         <button
//           onClick={startRecognition}
//           disabled={isRecording}
//           className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center text-3xl shadow-2xl transition-all active:scale-95 ${
//             isRecording 
//               ? "bg-red-500 text-white" 
//               : "bg-blue-600 hover:bg-blue-700 text-white"
//           }`}
//         >
//           {isRecording ? "⏹️" : "🎤"}
//         </button>
//       </div>

//       {/* Result Card */}
//       <div className="min-h-[120px] flex flex-col items-center justify-center space-y-3">
//         {score !== null ? (
//           <div className="text-center animate-in fade-in zoom-in duration-300">
//              <div className="inline-block px-4 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-sm mb-2 italic">
//                "{spokenText}"
//              </div>
//              <div className="flex items-center justify-center gap-4">
//                <div className={`text-5xl font-black ${
//                  score >= 80 ? "text-green-500" : score >= 50 ? "text-yellow-500" : "text-red-500"
//                }`}>
//                  {score}%
//                </div>
//                <div className="text-left">
//                  <p className="font-bold text-gray-800 dark:text-gray-100 leading-tight">
//                    {feedback}
//                  </p>
//                </div>
//              </div>
//           </div>
//         ) : (
//           <p className="text-gray-400 dark:text-gray-500 font-medium">
//             {isRecording ? "Speak now..." : "Tap the mic to start"}
//           </p>
//         )}
//       </div>

//       {/* Navigation */}
//       <div className="pt-4 flex gap-3">
//         {words.length > 1 && (
//           <button
//             onClick={nextWord}
//             className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
//           >
//             Next Word
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }