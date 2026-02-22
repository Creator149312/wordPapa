'use client'

import { FlashcardArray } from "react-quizlet-flashcard";

const Flashcards = ({ words }) => {
  const flashcards = words.map((w) => ({
    id: w._id || Math.random(), // Library usually likes an ID
    frontHTML: (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <span className="text-xs font-black uppercase tracking-[0.3em] text-[#75c32c] mb-4">Word</span>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-800 dark:text-white capitalize">
          {w.word}
        </h2>
      </div>
    ),
    backHTML: (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <span className="text-xs font-black uppercase tracking-[0.3em] text-[#75c32c] mb-4">Definition</span>
        <p className="text-lg md:text-xl font-medium text-gray-700 dark:text-gray-200 leading-relaxed">
          {w.wordData}
        </p>
      </div>
    ),
  }));

  return (
    <div className="flashcard-container p-6 md:p-10 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-[#75c32c]/5">
      <div className="flex items-center gap-2 mb-8 justify-center">
        <div className="h-2 w-2 bg-[#75c32c] rounded-full animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Memory Mode Active</span>
      </div>

      <FlashcardArray
        cards={flashcards}
        // These props allow you to style the library's internal elements
        frontCardStyle={{
          borderRadius: '2rem',
          border: '2px solid #f3f4f6',
          boxShadow: '0 10px 15px -3px rgba(117, 195, 44, 0.1)',
        }}
        backCardStyle={{
          borderRadius: '2rem',
          border: '2px solid #75c32c', // Green border on the "Correct" side
          backgroundColor: '#fdfdfd',
        }}
        // The library uses these for the nav arrows/dots
        FlashcardArrayStyle={{
           display: 'flex',
           flexDirection: 'column',
           gap: '2rem'
        }}
      />
      
      <style jsx global>{`
        /* Overriding library arrow buttons to match your green theme */
        .react-quizlet-flashcard-button {
          background-color: #75c32c !important;
          border-radius: 12px !important;
          transition: all 0.2s !important;
        }
        .react-quizlet-flashcard-button:hover {
          background-color: #66aa26 !important;
          transform: scale(1.1);
        }
        /* Style the "1 / 10" counter */
        .react-quizlet-flashcard-pagination {
          font-weight: 900 !important;
          color: #75c32c !important;
          letter-spacing: 0.1em;
        }
      `}</style>
    </div>
  );
};

export default Flashcards;