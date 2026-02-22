"use client";

import { useState, useMemo, useEffect } from "react";
import { CheckCircle2, RotateCcw, Info } from "lucide-react";

export default function SentenceMakingPractice({ sentence }) {
  const initialShuffledBank = useMemo(() => {
    return sentence.split(" ").sort(() => Math.random() - 0.5);
  }, [sentence]);

  const [wordBank, setWordBank] = useState([]);
  const [answerArea, setAnswerArea] = useState([]);
  const [feedback, setFeedback] = useState({ message: "", type: "" });

  useEffect(() => {
    setWordBank(initialShuffledBank);
    setAnswerArea([]);
    setFeedback({ message: "", type: "" });
  }, [initialShuffledBank]);

  const moveToAnswer = (index) => {
    const newBank = [...wordBank];
    const [moved] = newBank.splice(index, 1);
    setWordBank(newBank);
    setAnswerArea([...answerArea, moved]);
    setFeedback({ message: "", type: "" });
  };

  const moveToBank = (index) => {
    const newAnswer = [...answerArea];
    const [moved] = newAnswer.splice(index, 1);
    setAnswerArea(newAnswer);
    setWordBank([...wordBank, moved]);
    setFeedback({ message: "", type: "" });
  };

  const checkAnswer = () => {
    const userSentence = answerArea.join(" ");
    if (userSentence === sentence) {
      setFeedback({ message: "Perfect!", type: "success" });
    } else {
      setFeedback({ message: "Try again!", type: "error" });
    }
  };

  return (
    <div className="flex flex-col gap-3 p-2 w-full max-w-2xl mx-auto">
      {/* 1. Ultra-compact Header */}
      <div className="flex items-center gap-2 bg-[#75c32c]/5 p-2 rounded-xl border border-[#75c32c]/10">
        <Info size={14} className="text-[#75c32c] shrink-0" />
        <p className="text-[9px] font-black uppercase tracking-tighter text-gray-500">
          Tap words to build the sentence
        </p>
      </div>

      {/* 2. Optimized Answer Area */}
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap gap-1.5 p-3 bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-800 min-h-[80px] max-h-[180px] overflow-y-auto content-start">
          {answerArea.length === 0 && (
            <div className="w-full flex items-center justify-center h-12">
              <p className="text-gray-300 dark:text-gray-700 font-bold text-xs italic">Construct here...</p>
            </div>
          )}
          {answerArea.map((word, index) => (
            <button
              key={`answer-${index}`}
              onClick={() => moveToBank(index)}
              className="px-3 py-1.5 bg-[#75c32c]/5 text-[#75c32c] border-b-2 border-[#75c32c]/20 rounded-lg font-bold text-xs active:translate-y-0.5 active:border-b-0 transition-all"
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Tight Word Bank */}
      <div className="flex flex-wrap justify-center gap-1.5 min-h-[60px] p-2 bg-gray-50/50 dark:bg-gray-800/20 rounded-2xl">
        {wordBank.map((word, index) => (
          <button
            key={`bank-${index}`}
            onClick={() => moveToAnswer(index)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-950 rounded-lg font-bold text-xs text-gray-600 dark:text-gray-300 shadow-sm active:translate-y-0.5 active:border-b-0 transition-all"
          >
            {word}
          </button>
        ))}
      </div>

      {/* 4. Action Bar (Condensed) */}
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={checkAnswer}
          disabled={answerArea.length === 0}
          className="flex-1 bg-[#75c32c] disabled:bg-gray-200 disabled:text-gray-400 text-white py-3 rounded-xl font-black text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle2 size={16} />
          Check
        </button>
        
        <button
          onClick={() => {
            setWordBank([...initialShuffledBank]);
            setAnswerArea([]);
            setFeedback({ message: "", type: "" });
          }}
          className="p-3 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-xl active:rotate-[-45deg] transition-transform"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* 5. Minimal Feedback */}
      {feedback.message && (
        <div className={`mt-1 py-2 px-4 rounded-xl text-center text-xs font-black animate-in fade-in slide-in-from-top-1 ${
          feedback.type === "success" 
            ? "bg-[#75c32c] text-white" 
            : "bg-red-500 text-white"
        }`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
}

// "use client";

// import { useState, useMemo, useEffect } from "react";

// export default function SentenceMakingPractice({ sentence, distractor = "banana" }) {
//   // Use useMemo so the shuffled bank is only created once per sentence change
//   const initialShuffledBank = useMemo(() => {
//     const words = sentence.split(" ");
//     const combined = [...words, distractor];
//     return combined.sort(() => Math.random() - 0.5);
//   }, [sentence, distractor]);

//   const [wordBank, setWordBank] = useState([]);
//   const [answerArea, setAnswerArea] = useState([]);
//   const [feedback, setFeedback] = useState({ message: "", type: "" });

//   // Initialize wordBank when component mounts or initialShuffledBank changes
//   useEffect(() => {
//     setWordBank(initialShuffledBank);
//     setAnswerArea([]);
//     setFeedback({ message: "", type: "" });
//   }, [initialShuffledBank]);

//   const moveToAnswer = (index) => {
//     const newBank = [...wordBank];
//     const [moved] = newBank.splice(index, 1);
//     setWordBank(newBank);
//     setAnswerArea([...answerArea, moved]);
//     setFeedback({ message: "", type: "" }); // Clear feedback on interaction
//   };

//   const moveToBank = (index) => {
//     const newAnswer = [...answerArea];
//     const [moved] = newAnswer.splice(index, 1);
//     setAnswerArea(newAnswer);
//     setWordBank([...wordBank, moved]);
//     setFeedback({ message: "", type: "" });
//   };

//   const checkAnswer = () => {
//     const userSentence = answerArea.join(" ");
//     if (userSentence === sentence) {
//       setFeedback({ message: "✨ Excellent! That's perfectly structured.", type: "success" });
//     } else {
//       setFeedback({ message: "Not quite right. Check the word order!", type: "error" });
//     }
//   };

//   const resetPractice = () => {
//     setWordBank([...initialShuffledBank].sort(() => Math.random() - 0.5));
//     setAnswerArea([]);
//     setFeedback({ message: "", type: "" });
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 space-y-6 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
//       <div className="text-center space-y-1">
//         <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Sentence Builder</h2>
//         <p className="text-sm text-gray-500">Tap the words to arrange them correctly</p>
//       </div>

//       {/* Answer Area (The "Slot") */}
//       <div className="space-y-2">
//         <span className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-2">Your Sentence</span>
//         <div className="flex flex-wrap gap-2 p-5 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-2xl min-h-[80px] bg-gray-50/50 dark:bg-gray-900/50 transition-all">
//           {answerArea.length === 0 && (
//             <p className="text-gray-400 italic self-center mx-auto text-sm">Words will appear here...</p>
//           )}
//           {answerArea.map((word, index) => (
//             <button
//               key={`answer-${word}-${index}`}
//               onClick={() => moveToBank(index)}
//               className="px-4 py-2 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 rounded-xl shadow-sm font-medium hover:scale-105 active:scale-95 transition-all"
//             >
//               {word}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Word Bank Area */}
//       <div className="space-y-2">
//         <span className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-2">Word Bank</span>
//         <div className="flex flex-wrap gap-2 p-5 bg-blue-50/50 dark:bg-blue-900/20 rounded-2xl border border-blue-100/50 dark:border-blue-800/50">
//           {wordBank.map((word, index) => (
//             <button
//               key={`bank-${word}-${index}`}
//               onClick={() => moveToAnswer(index)}
//               className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow-md font-medium hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 transition-all"
//             >
//               {word}
//             </button>
//           ))}
//           {wordBank.length === 0 && (
//             <p className="text-blue-400 text-sm italic mx-auto">All words used!</p>
//           )}
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="flex flex-col sm:flex-row gap-3 pt-4">
//         <button
//           onClick={checkAnswer}
//           disabled={answerArea.length === 0}
//           className="flex-1 bg-green-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-200 dark:shadow-none transition-all"
//         >
//           Check Sentence
//         </button>
//         <button
//           onClick={resetPractice}
//           className="px-6 py-3 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
//         >
//           🔄 Reshuffle
//         </button>
//       </div>

//       {/* Feedback Message */}
//       {feedback.message && (
//         <div className={`p-4 rounded-xl text-center font-bold animate-in slide-in-from-top-2 duration-300 ${
//           feedback.type === "success" 
//             ? "bg-green-100 text-green-800 border border-green-200" 
//             : "bg-red-50 text-red-800 border border-red-100"
//         }`}>
//           {feedback.message}
//         </div>
//       )}
//     </div>
//   );
// }