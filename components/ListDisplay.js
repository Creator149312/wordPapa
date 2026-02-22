"use client";

import { useState } from "react";
import Link from "next/link";
import Flashcards from "./Flashcards";
import AudioTypingPractice from "./AudioTypingPractice";
import SpeakingPractice from "./SpeakingPractice";
import { 
  Layers, 
  Headphones, 
  Mic2, 
  ListOrdered, 
  ChevronRight, 
  BookOpen,
  Trophy,
  Sparkles
} from "lucide-react";

const ListDisplay = ({ title, description, words = [] }) => {
  const [practiceMode, setPracticeMode] = useState(null);

  const modes = [
    { id: "flashcards", label: "Cards", icon: <Layers size={18} />, color: "bg-orange-500" },
    { id: "audio", label: "Listen", icon: <Headphones size={18} />, color: "bg-[#75c32c]" },
    { id: "speaking", label: "Speak", icon: <Mic2 size={18} />, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Mode Switcher */}
      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 md:p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
               <span className="px-3 py-1 bg-[#75c32c]/10 text-[#75c32c] text-[10px] font-black uppercase tracking-wider rounded-full">
                 Collection
               </span>
               <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                 {words.length} Words
               </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-1.5 p-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-x-auto no-scrollbar">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setPracticeMode(mode.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-tight transition-all whitespace-nowrap ${
                  practiceMode === mode.id
                    ? `${mode.color} text-white shadow-lg shadow-${mode.color}/20 scale-105`
                    : "text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700"
                }`}
              >
                {mode.icon}
                <span>{mode.label}</span>
              </button>
            ))}
            
            {practiceMode && (
              <button
                onClick={() => setPracticeMode(null)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs uppercase text-gray-400 hover:text-red-500 transition-all"
              >
                <ListOrdered size={18} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Display Area */}
      <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
        {practiceMode === "flashcards" ? (
          <Flashcards words={words} />
        ) : practiceMode === "audio" ? (
          <AudioTypingPractice words={words} />
        ) : practiceMode === "speaking" ? (
          <SpeakingPractice words={words} />
        ) : (
          <div className="space-y-6">
            {/* Description Card */}
            {description && (
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] p-6 flex items-start gap-4 shadow-sm">
                 <div className="p-3 bg-[#75c32c]/10 rounded-2xl text-[#75c32c]">
                   <BookOpen size={24} />
                 </div>
                 <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed font-medium pt-1">
                   {description}
                 </p>
              </div>
            )}

            {/* Word List Grid */}
            <div className="grid gap-3">
              {words.map((word, index) => (
                <Link
                  key={index}
                  href={`/define/${word.word}`}
                  className="group flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 hover:border-[#75c32c] hover:shadow-xl hover:shadow-[#75c32c]/5 transition-all active:scale-[0.99]"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-[#75c32c] transition-colors mb-0.5">
                      {word.word}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium line-clamp-1 italic">
                      {word.wordData || word.definition || "No definition available."}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-300 group-hover:bg-[#75c32c] group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-[#75c32c]/30">
                      <ChevronRight size={20} strokeWidth={3} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Completion / Trophy Call to Action */}
            <div className="bg-gray-900 dark:bg-white rounded-[2.5rem] p-8 text-center shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10 text-white dark:text-gray-900">
                 <Sparkles size={100} />
               </div>
               <Trophy className="mx-auto mb-3 text-[#75c32c]" size={40} />
               <h3 className="text-white dark:text-gray-900 font-black text-lg">Master this list!</h3>
               <p className="text-gray-400 dark:text-gray-500 text-sm max-w-[240px] mx-auto mt-1">
                 Use the modes above to reach 100% fluency.
               </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListDisplay;

// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import Flashcards from "./Flashcards";
// import AudioTypingPractice from "./AudioTypingPractice";
// import SpeakingPractice from "./SpeakingPractice";
// import { 
//   Layers,      // Replaced Cards with Layers
//   Headphones, 
//   Mic2, 
//   ListOrdered, 
//   ChevronRight, 
//   BookOpen,
//   Trophy
// } from "lucide-react";

// const ListDisplay = ({ title, description, words }) => {
//   const [practiceMode, setPracticeMode] = useState(null);

//   const modes = [
//     { id: "flashcards", label: "Flashcards", icon: <Layers size={18} />, color: "bg-orange-500" },
//     { id: "audio", label: "Listening", icon: <Headphones size={18} />, color: "bg-[#75c32c]" },
//     { id: "speaking", label: "Speaking", icon: <Mic2 size={18} />, color: "bg-purple-500" },
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Mode Switcher Card */}
//       <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
//           <div className="space-y-1">
//             <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
//               {title}
//             </h1>
//             <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
//               {words.length} words in this collection
//             </p>
//           </div>

//           <div className="flex items-center gap-2 p-1.5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
//             {modes.map((mode) => (
//               <button
//                 key={mode.id}
//                 onClick={() => setPracticeMode(mode.id)}
//                 className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
//                   practiceMode === mode.id
//                     ? `${mode.color} text-white shadow-lg`
//                     : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
//                 }`}
//               >
//                 {mode.icon}
//                 <span className="hidden sm:inline">{mode.label}</span>
//               </button>
//             ))}
            
//             {practiceMode && (
//               <button
//                 onClick={() => setPracticeMode(null)}
//                 className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
//               >
//                 <ListOrdered size={18} />
//                 <span className="hidden sm:inline">List</span>
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Main Display Area */}
//       <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
//         {practiceMode === "flashcards" ? (
//           <Flashcards words={words} />
//         ) : practiceMode === "audio" ? (
//           <AudioTypingPractice words={words} />
//         ) : practiceMode === "speaking" ? (
//           <SpeakingPractice words={words} />
//         ) : (
//           <div className="space-y-6">
//             <div className="bg-[#75c32c]/5 border border-[#75c32c]/10 rounded-2xl p-4 flex items-start gap-3">
//                <BookOpen className="text-[#75c32c] mt-1 shrink-0" size={20} />
//                <p className="text-gray-600 dark:text-gray-300 italic text-sm leading-relaxed">
//                  {description}
//                </p>
//             </div>

//             <div className="grid gap-3">
//               {words.map((word, index) => (
//                 <Link
//                   key={index}
//                   href={`/define/${word.word}`}
//                   className="group flex flex-col md:flex-row md:items-center justify-between bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 hover:border-[#75c32c] hover:shadow-md transition-all"
//                 >
//                   <div className="space-y-1">
//                     <span className="text-xl font-black text-gray-900 dark:text-white group-hover:text-[#75c32c] transition-colors">
//                       {word.word}
//                     </span>
//                     <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-1">
//                       {word.wordData}
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-4 mt-3 md:mt-0">
//                     <div className="h-8 w-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-300 group-hover:bg-[#75c32c]/10 group-hover:text-[#75c32c] transition-colors">
//                       <ChevronRight size={18} />
//                     </div>
//                   </div>
//                 </Link>
//               ))}
//             </div>
            
//             <div className="bg-gray-900 dark:bg-[#75c32c] rounded-3xl p-6 text-center text-white">
//                <Trophy className="mx-auto mb-2 opacity-80" size={32} />
//                <p className="font-bold">Ready to test your knowledge?</p>
//                <p className="text-xs opacity-70">Pick a mode above to start practicing.</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ListDisplay;