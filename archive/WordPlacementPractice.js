"use client";

import { useState, useMemo, useEffect } from "react";
import { Info, RotateCcw, CheckCircle2, CornerRightDown } from "lucide-react";

export default function WordPlacementPractice({ sentence, practiceWord, onCorrect }) {
  const { displaySentence, wordBankWords, words } = useMemo(() => {
    const wordsArray = sentence.split(" ");
    const practiceIndices = wordsArray
      .map((w, i) => (w.toLowerCase().replace(/[.,!?;]/g, "") === practiceWord.toLowerCase() ? i : -1))
      .filter((i) => i !== -1);

    let extraBlankCount = wordsArray.length > 12 ? 3 : wordsArray.length > 6 ? 2 : 1;

    const candidateIndices = wordsArray
      .map((_, i) => i)
      .filter((i) => !practiceIndices.includes(i));

    const extraIndices = [];
    const tempCandidates = [...candidateIndices];
    while (extraIndices.length < extraBlankCount && tempCandidates.length > 0) {
      const rand = Math.floor(Math.random() * tempCandidates.length);
      extraIndices.push(tempCandidates.splice(rand, 1)[0]);
    }

    const allBlankIndices = [...practiceIndices, ...extraIndices].sort((a, b) => a - b);
    const displayRes = wordsArray.map((w, i) => (allBlankIndices.includes(i) ? "____" : w));
    const bank = allBlankIndices.map((i) => wordsArray[i]);
    const shuffledBank = bank.sort(() => Math.random() - 0.5);

    return { displaySentence: displayRes, wordBankWords: shuffledBank, words: wordsArray };
  }, [sentence, practiceWord]);

  const [answerPositions, setAnswerPositions] = useState({});
  const [feedback, setFeedback] = useState("");
  const [activeBlank, setActiveBlank] = useState(null);

  // Auto-focus the first blank on mount
  useEffect(() => {
    const firstBlank = displaySentence.findIndex(w => w === "____");
    if (firstBlank !== -1) setActiveBlank(firstBlank);
  }, [displaySentence]);

  const handleWordSelect = (word) => {
    if (activeBlank !== null) {
      setAnswerPositions((prev) => ({ ...prev, [activeBlank]: word }));
      setFeedback("");
      
      // Auto-advance to next empty blank
      const nextBlank = displaySentence.findIndex((w, i) => w === "____" && i > activeBlank && !answerPositions[i]);
      setActiveBlank(nextBlank !== -1 ? nextBlank : null);
    }
  };

  const checkAnswer = () => {
    const isCorrect = words.every((originalWord, i) => {
      if (displaySentence[i] === "____") return answerPositions[i] === originalWord;
      return true;
    });
    setFeedback(isCorrect ? "✅ Perfect!" : "❌ Check placement");
    if (isCorrect) {
      onCorrect?.();
    }
  };

  return (
    <div className="flex flex-col gap-3 p-2 w-full max-w-2xl mx-auto animate-in fade-in duration-500">
      {/* Compact Instruction */}
      <div className="flex items-center gap-2 bg-[#75c32c]/5 p-2 rounded-xl border border-[#75c32c]/10">
        <CornerRightDown className="text-[#75c32c] shrink-0" size={14} />
        <p className="text-[10px] font-black uppercase tracking-tighter text-gray-500">
          Select a blank and fill the gap
        </p>
      </div>

      {/* Sentence Area - Optimized for wrapping and flow */}
      <div className="flex flex-wrap items-center gap-x-1 gap-y-2 p-4 bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm leading-relaxed">
        {displaySentence.map((w, i) =>
          w === "____" ? (
            <button
              key={i}
              onClick={() => { setActiveBlank(i); setFeedback(""); }}
              className={`min-w-[60px] px-2 py-0.5 border-b-2 font-black text-sm transition-all rounded-t-md ${
                activeBlank === i 
                  ? "border-[#75c32c] bg-[#75c32c]/10 text-[#75c32c] scale-105" 
                  : answerPositions[i]
                  ? "border-gray-200 text-[#75c32c] bg-gray-50 dark:bg-gray-800"
                  : "border-gray-300 text-transparent"
              }`}
            >
              {answerPositions[i] || "____"}
            </button>
          ) : (
            <span key={i} className="text-sm font-bold text-gray-700 dark:text-gray-200 px-0.5">
              {w}
            </span>
          )
        )}
      </div>

      {/* Word Bank - Minimalist tiles */}
      <div className="flex flex-wrap justify-center gap-2 p-3 bg-gray-50/50 dark:bg-gray-800/20 rounded-2xl">
        {wordBankWords.map((word, i) => {
          const usedCount = Object.values(answerPositions).filter(v => v === word).length;
          const totalInBank = wordBankWords.filter(v => v === word).length;
          const isUsed = usedCount >= totalInBank;

          return (
            <button
              key={i}
              disabled={isUsed || activeBlank === null}
              onClick={() => handleWordSelect(word)}
              className={`px-4 py-2 rounded-xl font-black text-xs transition-all active:scale-90 shadow-sm ${
                isUsed 
                  ? "opacity-0 scale-50 pointer-events-none" 
                  : activeBlank !== null
                  ? "bg-white dark:bg-gray-800 border-b-2 border-[#75c32c] text-[#75c32c]"
                  : "bg-gray-100 text-gray-300 border-b-2 border-transparent"
              }`}
            >
              {word}
            </button>
          );
        })}
      </div>

      {/* Action Row */}
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={checkAnswer}
          className="flex-1 bg-[#75c32c] text-white py-3.5 rounded-2xl font-black text-sm shadow-md shadow-[#75c32c]/10 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <CheckCircle2 size={18} />
          Check Results
        </button>
        
        <button
          onClick={() => { setAnswerPositions({}); setFeedback(""); setActiveBlank(0); }}
          className="p-3.5 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-2xl active:rotate-[-45deg] transition-transform"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Alert-style Feedback */}
      {feedback && (
        <div className={`py-2.5 px-4 rounded-xl text-center text-[11px] font-black animate-in fade-in slide-in-from-top-1 ${
          feedback.includes("✅") 
            ? "bg-[#75c32c] text-white" 
            : "bg-red-500 text-white"
        }`}>
          {feedback}
        </div>
      )}
    </div>
  );
}

// "use client";

// import { useState, useMemo } from "react";

// export default function WordPlacementPractice({ sentence, practiceWord }) {
//   // Use useMemo to ensure the blanks and word bank stay consistent between renders
//   const { displaySentence, wordBankWords, words } = useMemo(() => {
//     const wordsArray = sentence.split(" ");

//     // 1. Find the index of the practice word
//     const practiceIndices = wordsArray
//       .map((w, i) => (w.toLowerCase().replace(/[.,!?;]/g, "") === practiceWord.toLowerCase() ? i : -1))
//       .filter((i) => i !== -1);

//     // 2. Determine count of extra blanks
//     let extraBlankCount = 1;
//     if (wordsArray.length > 6 && wordsArray.length <= 12) extraBlankCount = 2;
//     if (wordsArray.length > 12) extraBlankCount = 3;

//     // 3. Pick random indices for extra blanks
//     const candidateIndices = wordsArray
//       .map((_, i) => i)
//       .filter((i) => !practiceIndices.includes(i));

//     const extraIndices = [];
//     const tempCandidates = [...candidateIndices];
//     while (extraIndices.length < extraBlankCount && tempCandidates.length > 0) {
//       const rand = Math.floor(Math.random() * tempCandidates.length);
//       extraIndices.push(tempCandidates.splice(rand, 1)[0]);
//     }

//     const allBlankIndices = [...practiceIndices, ...extraIndices];

//     // 4. Build the sentence structure
//     const displayRes = wordsArray.map((w, i) =>
//       allBlankIndices.includes(i) ? "____" : w
//     );

//     // 5. Build and shuffle the word bank
//     const bank = allBlankIndices.map((i) => wordsArray[i]);
//     const shuffledBank = bank.sort(() => Math.random() - 0.5);

//     return { 
//       displaySentence: displayRes, 
//       wordBankWords: shuffledBank, 
//       words: wordsArray 
//     };
//   }, [sentence, practiceWord]);

//   const [answerPositions, setAnswerPositions] = useState({});
//   const [feedback, setFeedback] = useState("");

//   const handleDrop = (event, index) => {
//     event.preventDefault();
//     const droppedWord = event.dataTransfer.getData("text/plain");
//     setAnswerPositions((prev) => ({ ...prev, [index]: droppedWord }));
//   };

//   const checkAnswer = () => {
//     // Construct the result by checking if the user filled the blanks correctly
//     const isCorrect = words.every((originalWord, i) => {
//       if (displaySentence[i] === "____") {
//         return answerPositions[i] === originalWord;
//       }
//       return true;
//     });

//     if (isCorrect) {
//       setFeedback("✅ Correct placement!");
//     } else {
//       setFeedback("❌ Some words are in the wrong spot. Try again!");
//     }
//   };

//   const resetPractice = () => {
//     setAnswerPositions({});
//     setFeedback("");
//   };

//   return (
//     <div className="space-y-6 p-4 max-w-2xl mx-auto">
//       <h2 className="text-xl font-bold">Fill in the blanks:</h2>

//       {/* Sentence Area */}
//       <div className="flex flex-wrap items-center gap-x-2 gap-y-4 p-6 border rounded-xl bg-white dark:bg-gray-800 shadow-sm">
//         {displaySentence.map((w, i) =>
//           w === "____" ? (
//             <div
//               key={i}
//               onDragOver={(e) => e.preventDefault()}
//               onDrop={(e) => handleDrop(e, i)}
//               className={`min-w-[80px] h-10 border-b-2 flex items-center justify-center transition-colors ${
//                 answerPositions[i] 
//                   ? "border-blue-500 text-blue-600 font-semibold" 
//                   : "border-gray-400 text-transparent"
//               }`}
//             >
//               {answerPositions[i] || "____"}
//             </div>
//           ) : (
//             <span key={i} className="text-lg text-gray-700 dark:text-gray-200">
//               {w}
//             </span>
//           )
//         )}
//       </div>

//       {/* Word Bank */}
//       <div className="p-4 border-2 border-dashed rounded-xl bg-gray-50 dark:bg-gray-900 flex flex-wrap gap-3 justify-center">
//         {wordBankWords.map((word, i) => {
//           // Visual feedback: check if this specific instance of the word is already "used"
//           const usedCount = Object.values(answerPositions).filter(v => v === word).length;
//           const totalInBank = wordBankWords.filter(v => v === word).length;
//           const isUsed = usedCount >= totalInBank; // Simple logic for duplicates

//           return (
//             <span
//               key={i}
//               draggable={!isUsed}
//               onDragStart={(e) => e.dataTransfer.setData("text/plain", word)}
//               className={`px-4 py-2 rounded-lg cursor-grab active:cursor-grabbing select-none transition-all shadow-sm ${
//                 isUsed 
//                   ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
//                   : "bg-blue-600 text-white hover:bg-blue-700"
//               }`}
//             >
//               {word}
//             </span>
//           );
//         })}
//       </div>

//       <div className="flex gap-3">
//         <button
//           onClick={checkAnswer}
//           className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
//         >
//           Check Answer
//         </button>
//         <button
//           onClick={resetPractice}
//           className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//         >
//           Reset
//         </button>
//       </div>

//       {feedback && (
//         <div className={`p-4 rounded-lg text-center font-bold ${
//           feedback.includes("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//         }`}>
//           {feedback}
//         </div>
//       )}
//     </div>
//   );
// }