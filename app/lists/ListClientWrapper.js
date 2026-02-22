"use client";

import { useState, useEffect } from "react";
import ListDisplay from "@components/ListDisplay";
import MacroPractice from "../../components/training/MacroPractice";
import { ChevronLeft, AlertCircle, PlayCircle, BookOpen } from "lucide-react";

export default function ListClientWrapper({ wordsList, listerror }) {
  const [view, setView] = useState("list");

  // Update document title for browser history clarity
  useEffect(() => {
    if (wordsList?.title) {
      document.title = view === 'practice' 
        ? `Practicing: ${wordsList.title} | WordPapa` 
        : `${wordsList.title} | WordPapa`;
    }
  }, [view, wordsList]);

  // --- Error State Handling ---
  if (listerror || !wordsList) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-black text-gray-800 dark:text-white">List Not Found</h2>
        <p className="text-gray-500 max-w-xs mt-2 mb-6">We couldn't load the collection. It might have been deleted or moved.</p>
        <button 
          onClick={() => window.location.href = "/lists"}
          className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-sm transition-transform active:scale-95"
        >
          Explore Other Lists
        </button>
      </div>
    );
  }

  const hasWords = wordsList.words?.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-500">
      <div className="mx-auto px-4 sm:px-6 py-8 max-w-4xl">
        
        {/* Sticky Header - Keeps actions accessible during long scrolls */}
        <header className="mb-8 flex items-center justify-between sticky top-4 z-30">
          <button
            onClick={() => {
              if (view === 'practice') {
                setView('list');
              } else {
                window.location.href = "/lists";
              }
            }}
            className="group flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#75c32c] transition-colors bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-1 pr-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"
          >
            <div className="p-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all group-hover:shadow-[#75c32c]/20">
              <ChevronLeft size={18} />
            </div>
            {view === 'practice' ? "End Session" : "Back to Lists"}
          </button>
          
          {/* <button
            disabled={!hasWords}
            onClick={() => {
              setView(view === 'list' ? 'practice' : 'list');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 
              ${!hasWords 
                ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                : "bg-[#75c32c] text-white shadow-[#75c32c]/20 hover:scale-105"
              }`}
          >
            {view === 'list' ? (
              <><PlayCircle size={18} /> Train Now</>
            ) : (
              <><BookOpen size={18} /> View List</>
            )}
          </button> */}
        </header>

        <main className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          {view === 'list' ? (
            <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-3 shadow-2xl shadow-[#75c32c]/5 border border-white dark:border-gray-800/50">
              <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden">
                <ListDisplay
                  title={wordsList.title}
                  description={wordsList.description}
                  words={wordsList.words}
                />
                {!hasWords && (
                  <div className="p-16 text-center">
                    <p className="text-gray-400 font-bold italic">
                      "This garden is empty... time to plant some words!"
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-2">
              <MacroPractice wordList={wordsList.words} listTitle={wordsList.title} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}


// "use client";

// import { useState, useEffect } from "react";
// import ListDisplay from "@components/ListDisplay";
// import MacroPractice from "../../components/training/MacroPractice";
// import { ChevronLeft, AlertCircle, PlayCircle, BookOpen } from "lucide-react";
// import Link from "next/link";

// export default function ListClientWrapper({ wordsList, listerror }) {
//   const [view, setView] = useState("list");

//   // AI Age Tip: Update document title so browser history makes sense
//   useEffect(() => {
//     if (wordsList?.title) {
//       document.title = view === 'practice' 
//         ? `Practicing: ${wordsList.title} | WordPapa` 
//         : `${wordsList.title} | WordPapa`;
//     }
//   }, [view, wordsList]);

//   if (listerror || !wordsList) {
//     // ... (Your existing error state is perfect)
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-500">
//       <div className="mx-auto px-4 sm:px-6 py-8 max-w-4xl">
        
//         <header className="mb-8 flex items-center justify-between">
//           <button
//             onClick={() => {
//               if (view === 'practice') {
//                 setView('list');
//               } else {
//                 // Instead of window.history.back(), 
//                 // it's safer to link back to the public list directory
//                 window.location.href = "/lists";
//               }
//             }}
//             className="group flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#75c32c] transition-colors"
//           >
//             <div className="p-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all group-hover:shadow-[#75c32c]/20">
//               <ChevronLeft size={18} />
//             </div>
//             {view === 'practice' ? "End Session" : "Explore All Lists"}
//           </button>
          
//           <button
//             onClick={() => {
//               setView(view === 'list' ? 'practice' : 'list');
//               // Logic: Smooth scroll to top when switching modes
//               window.scrollTo({ top: 0, behavior: 'smooth' });
//             }}
//             className="flex items-center gap-2 px-6 py-3 bg-[#75c32c] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#75c32c]/20 hover:scale-105 active:scale-95 transition-all"
//           >
//             {view === 'list' ? (
//               <><PlayCircle size={18} /> Train Now</>
//             ) : (
//               <><BookOpen size={18} /> List View</>
//             )}
//           </button>
//         </header>

//         <main className="animate-in fade-in slide-in-from-bottom-6 duration-700">
//           {view === 'list' ? (
//             <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-3 shadow-2xl shadow-[#75c32c]/5 border border-white dark:border-gray-800/50">
//               <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden">
//                 <ListDisplay
//                   title={wordsList.title}
//                   description={wordsList.description}
//                   words={wordsList.words}
//                 />
//               </div>
//             </div>
//           ) : (
//             <div className="py-2">
//               {/* Pass the list title to MacroPractice if you want the AI 
//                   to use it for context! */}
//               <MacroPractice wordList={wordsList.words} listTitle={wordsList.title} />
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }