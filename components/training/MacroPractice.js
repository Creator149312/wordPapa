"use client";

import { useEffect, useState } from "react";
import QuizFlow from "./QuizFlow";
import { Sparkles, Loader2 } from "lucide-react";

export default function MacroPractice({ wordList, listTitle }) {
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

          // Challenge 2: Matching (Only if definition exists)
          if (wordData || item.definition) {
            challenges.push({
              type: "match",
              word: word,
              wordData: wordData || item.definition,
              fullList: wordList,
            });
          }

          // Challenge 3: Speaking
          challenges.push({ type: "speaking", word });

          return challenges;
        });

        // 2. Shuffle and Cap (Limit to 12-15 items for a "Quick Session")
        // This prevents burnout and keeps the user coming back.
        let shuffled = pool.sort(() => Math.random() - 0.5);
        
        // Smart Filter: Ensure no back-to-back identical words if possible
        const finalQuestions = [];
        shuffled.forEach((q, i) => {
          if (i > 0 && q.word === finalQuestions[finalQuestions.length - 1].word) {
            // Push to end of array if it's a duplicate of the previous one
            shuffled.push(q);
          } else {
            finalQuestions.push(q);
          }
        });

        // Take the first 15 curated challenges
        setQuestions(finalQuestions.slice(0, 15));
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
      <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-[#75c32c] animate-spin" />
          <Sparkles className="absolute -top-2 -right-2 text-orange-400 animate-pulse" size={20} />
        </div>
        <div>
          <p className="text-gray-900 dark:text-white font-black text-xl tracking-tight">
            Building your quiz...
          </p>
          <p className="text-gray-500 text-sm font-medium">
            Mixing challenges for {listTitle || "your list"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Session Header Info */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1.5 bg-[#75c32c] rounded-full shadow-[0_0_10px_rgba(117,195,44,0.3)]" />
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 leading-none mb-1">
              Active Session
            </h2>
            <p className="text-sm font-bold text-gray-700 dark:text-gray-200 truncate max-w-[200px]">
              {listTitle}
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-900 px-4 py-2 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <span className="text-xs font-black text-[#75c32c]">
            {questions.length} <span className="text-gray-400 font-bold ml-1">Tasks</span>
          </span>
        </div>
      </div>

      {/* The Quiz Engine */}
      <div className="relative min-h-[500px]">
        <QuizFlow questions={questions} />
      </div>

      {/* Footer Branding */}
      <div className="flex flex-col items-center gap-2 opacity-40 hover:opacity-100 transition-opacity pb-10">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 bg-gray-400 rounded-full" />
          <div className="w-1 h-1 bg-gray-400 rounded-full" />
          <div className="w-1 h-1 bg-gray-400 rounded-full" />
        </div>
        <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em]">
          Powered by WordPapa AI
        </p>
      </div>
    </div>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import QuizFlow from "./QuizFlow";

// export default function MacroPractice({ wordList }) {
//   const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     function generateMacroQuestions() {
//       try {
//         const allQuestions = wordList.flatMap((item) => {
//           const { word, wordData } = item;

//           return [
//             // Challenge 1: Spelling/Audio
//             {
//               type: "audioTyping",
//               word: word,
//             },
//             // Challenge 2: Context/Definition Placement
//             // {
//             //   type: "wordPlacement",
//             //   sentence: wordData || `Identify the correct usage of "${word}".`,
//             //   practiceWord: word
//             // },
//             // Challenge 3: Matching (The new mode)
//             {
//               type: "match",
//               word: word, // The target answer
//               wordData: wordData, // The prompt
//               fullList: wordList, // Pass the list to generate distractors
//             },
//             { type: "speaking", word },
//           ];
//         });

//         // SHUFFLE: High retention trick - mix up the types so it's not predictable
//         const shuffled = allQuestions.sort(() => Math.random() - 0.5);

//         setQuestions(shuffled);
//       } catch (err) {
//         console.error("Error generating word list practice:", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (wordList && wordList.length > 0) {
//       generateMacroQuestions();
//     }
//   }, [wordList]);

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center p-12 space-y-4">
//         <div className="w-12 h-12 border-4 border-[#75c32c]/20 border-t-[#75c32c] rounded-full animate-spin" />
//         <p className="text-gray-500 font-bold animate-pulse">
//           Curating your session...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
//       <div className="flex items-center gap-3 mb-2 px-2">
//         <div className="h-6 w-1.5 bg-[#75c32c] rounded-full" />
//         <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
//           Mixed Practice Mode
//         </h2>
//       </div>

//       <div className="relative">
//         <QuizFlow questions={questions} />
//       </div>

//       <div className="text-center pb-8">
//         <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest opacity-60">
//           {questions.length} Challenges • {wordList.length} Words
//         </p>
//       </div>
//     </div>
//   );
// }
