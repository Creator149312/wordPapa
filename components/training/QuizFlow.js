"use client";

import { useState } from "react";
import ProgressBar from "./ProgressBar"; 
import AudioTypingPractice from "../AudioTypingPractice";
import SpeakingPractice from "../SpeakingPractice";
import SentenceMakingPractice from "../SentenceMakingPractice";
import WordPlacementPractice from "../WordPlacementPractice";
import MatchingPractice from "../MatchingPractice";
import { Trophy, ArrowRight, RotateCcw, AlertCircle, Home } from "lucide-react";

export default function QuizFlow({ questions, listTitle }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    // Standardized data access to handle both Single Word and List objects
    const targetWord = currentQuestion.word;
    const wordList = currentQuestion.fullList || [];

    switch (currentQuestion.type) {
      case "speaking":
        return <SpeakingPractice key={currentIndex} words={[{ word: targetWord }]} />;

      case "audioTyping":
        return <AudioTypingPractice key={currentIndex} words={[{ word: targetWord }]} />;

      case "sentenceMaking":
        return <SentenceMakingPractice key={currentIndex} sentence={currentQuestion.sentence} />;

      case "match":
        // Logic: Only show Match if we have 4+ items. 
        // In MicroPractice, this will usually show the fallback.
        if (wordList.length >= 4) {
          return (
            <MatchingPractice
              key={currentIndex}
              wordList={wordList}
              targetWord={targetWord} 
              isSingleRound={true}
              onComplete={nextQuestion}
            />
          );
        } else {
          return (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-gray-50 dark:bg-gray-800/40 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center text-orange-500 mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-lg font-black text-gray-800 dark:text-white mb-2">Match Mode Locked</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[220px] mb-6 font-medium leading-relaxed">
                Matching requires at least 4 words in a collection to generate choices.
              </p>
              <button
                onClick={nextQuestion}
                className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-2xl font-black text-xs transition-all active:scale-95 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Skip Challenge
              </button>
            </div>
          );
        }

      case "wordPlacement":
        return (
          <WordPlacementPractice
            key={currentIndex}
            sentence={currentQuestion.sentence}
            practiceWord={currentQuestion.practiceWord}
          />
        );

      default:
        return (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem]">
            <p className="text-gray-500 font-bold">New challenge coming soon!</p>
          </div>
        );
    }
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center text-center py-12 px-6 bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-[#75c32c]/20 rounded-full animate-ping" />
          <div className="relative flex items-center justify-center w-24 h-24 bg-[#75c32c] rounded-full text-white shadow-lg shadow-[#75c32c]/30">
            <Trophy size={48} strokeWidth={2.5} />
          </div>
        </div>

        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter">Session Clear!</h2>
        <p className="text-gray-500 dark:text-gray-400 font-medium mb-10 max-w-[280px] mx-auto leading-relaxed">
          You've mastered these challenges {listTitle ? `for ${listTitle}` : ""}. Ready for more?
        </p>

        <div className="flex flex-col w-full gap-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center gap-2 px-8 py-5 bg-[#75c32c] text-white rounded-2xl font-black text-lg shadow-lg shadow-[#75c32c]/20 active:scale-95 transition-all hover:opacity-90"
          >
            <RotateCcw size={20} strokeWidth={3} />
            Practice Again
          </button>

          <button
            onClick={() => window.history.back()}
            className="w-full flex items-center justify-center gap-2 py-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-bold text-sm transition-colors"
          >
            <Home size={16} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md pt-2 pb-4">
        <ProgressBar current={currentIndex + 1} total={questions.length} />
      </div>

      <div
        key={currentIndex}
        className="min-h-[420px] animate-in fade-in slide-in-from-bottom-4 duration-500"
      >
        {renderQuestion()}
      </div>

      <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <div className="flex-1 min-w-0 px-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate mb-0.5">
              Challenge {currentIndex + 1} of {questions.length}
            </p>
            <p className="text-xs font-bold text-[#75c32c] truncate capitalize flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#75c32c]" />
              {currentQuestion?.type?.replace(/([A-Z])/g, ' $1') || "Practice"}
            </p>
          </div>

          <button
            onClick={nextQuestion}
            className={`
              flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm 
              transition-all active:scale-95 shadow-lg
              ${
                currentIndex < questions.length - 1
                  ? "bg-[#75c32c] text-white shadow-[#75c32c]/20"
                  : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-gray-900/10"
              }
            `}
          >
            <span>{currentIndex < questions.length - 1 ? "Continue" : "Finish"}</span>
            <ArrowRight size={18} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import ProgressBar from "./ProgressBar"; 
// import AudioTypingPractice from "../AudioTypingPractice";
// import SpeakingPractice from "../SpeakingPractice";
// import SentenceMakingPractice from "../SentenceMakingPractice";
// import WordPlacementPractice from "../WordPlacementPractice";
// import MatchingPractice from "../MatchingPractice";
// import { Trophy, ArrowRight, RotateCcw, AlertCircle } from "lucide-react";

// export default function QuizFlow({ questions }) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isFinished, setIsFinished] = useState(false);

//   const currentQuestion = questions[currentIndex];

//   const nextQuestion = () => {
//     if (currentIndex < questions.length - 1) {
//       setCurrentIndex((prev) => prev + 1);
//     } else {
//       setIsFinished(true);
//     }
//   };

//   const renderQuestion = () => {
//     if (!currentQuestion) return null;

//     switch (currentQuestion.type) {
//       case "speaking":
//         return (
//           <SpeakingPractice
//             key={currentIndex}
//             words={[{ word: currentQuestion.word }]}
//           />
//         );

//       case "audioTyping":
//         return (
//           <AudioTypingPractice
//             key={currentIndex}
//             words={[{ word: currentQuestion.word }]}
//           />
//         );

//       case "sentenceMaking":
//         return (
//           <SentenceMakingPractice
//             key={currentIndex}
//             sentence={currentQuestion.sentence}
//           />
//         );

//       case "match":
//         // Only render if there are enough distractors (4 total words needed)
//         if (currentQuestion.fullList && currentQuestion.fullList.length >= 4) {
//           return (
//             <MatchingPractice
//               key={currentIndex}
//               wordList={currentQuestion.fullList}
//               // Optional: if your MatchingPractice needs to know which word to target
//               targetWord={currentQuestion.word} 
//               isSingleRound={true}
//               onComplete={nextQuestion}
//             />
//           );
//         } else {
//           // Fallback for short lists
//           return (
//             <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-gray-50 dark:bg-gray-800/40 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
//               <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center text-orange-500 mb-4">
//                 <AlertCircle size={32} />
//               </div>
//               <h3 className="text-lg font-black text-gray-800 dark:text-white mb-2">
//                 Match Mode Locked
//               </h3>
//               <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[220px] mb-6 font-medium">
//                 This challenge requires a list of at least 4 words to generate options.
//               </p>
//               <button
//                 onClick={nextQuestion}
//                 className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold text-xs transition-transform active:scale-95"
//               >
//                 Skip to Next
//               </button>
//             </div>
//           );
//         }

//       case "wordPlacement":
//         return (
//           <WordPlacementPractice
//             key={currentIndex}
//             sentence={currentQuestion.sentence}
//             practiceWord={currentQuestion.practiceWord}
//           />
//         );

//       default:
//         return (
//           <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem]">
//             <p className="text-gray-500 font-bold">New challenge coming soon!</p>
//           </div>
//         );
//     }
//   };

//   if (isFinished) {
//     return (
//       <div className="flex flex-col items-center text-center py-12 px-6 bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl animate-in fade-in zoom-in duration-500">
//         <div className="relative mb-6">
//           <div className="absolute inset-0 bg-[#75c32c]/20 rounded-full animate-ping" />
//           <div className="relative flex items-center justify-center w-24 h-24 bg-[#75c32c] rounded-full text-white shadow-lg shadow-[#75c32c]/30">
//             <Trophy size={48} strokeWidth={2.5} />
//           </div>
//         </div>

//         <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter">
//           Great Work!
//         </h2>
//         <p className="text-gray-500 dark:text-gray-400 font-medium mb-10 max-w-[250px] mx-auto">
//           You've completed all challenges for this session.
//         </p>

//         <div className="flex flex-col w-full gap-3">
//           <button
//             onClick={() => window.location.reload()}
//             className="w-full flex items-center justify-center gap-2 px-8 py-5 bg-[#75c32c] text-white rounded-2xl font-black text-lg shadow-lg shadow-[#75c32c]/20 active:scale-95 transition-all"
//           >
//             <RotateCcw size={20} />
//             Practice More
//           </button>

//           <button
//             onClick={() => window.history.back()}
//             className="w-full py-4 text-gray-400 font-bold text-sm active:text-gray-600"
//           >
//             Return to List
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col gap-6">
//       {/* Fixed Header: Progress */}
//       <div className="sticky top-0 z-20 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md pt-2 pb-4">
//         <ProgressBar current={currentIndex + 1} total={questions.length} />
//       </div>

//       {/* Content Area */}
//       <div
//         key={currentIndex}
//         className="min-h-[420px] animate-in fade-in slide-in-from-bottom-4 duration-500"
//       >
//         {renderQuestion()}
//       </div>

//       {/* Navigation Footer */}
//       <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
//         <div className="flex items-center gap-3">
//           <div className="flex-1 min-w-0 px-1">
//             <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter truncate">
//               Current Mode
//             </p>
//             <p className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate capitalize">
//               {currentQuestion?.type?.replace(/([A-Z])/g, ' $1') || "Practice"}
//             </p>
//           </div>

//           <button
//             onClick={nextQuestion}
//             className={`
//               flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-sm 
//               transition-all active:scale-95 shadow-lg
//               ${
//                 currentIndex < questions.length - 1
//                   ? "bg-[#75c32c] text-white shadow-[#75c32c]/20"
//                   : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-gray-900/10"
//               }
//             `}
//           >
//             <span>
//               {currentIndex < questions.length - 1 ? "Next" : "Finish"}
//             </span>
//             <ArrowRight size={16} strokeWidth={3} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

