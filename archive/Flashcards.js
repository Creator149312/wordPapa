'use client'

import { useState } from "react";
import { FlashcardArray } from "react-quizlet-flashcard";
import { Maximize2, Minimize2, ChevronDown, ChevronUp } from "lucide-react";

const Flashcards = ({ words }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const flashcards = words.map((w) => ({
    id: w._id || Math.random(),
    frontHTML: (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#75c32c] mb-2 opacity-80">Word</span>
        <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-gray-800 capitalize">
          {w.word}
        </h2>
      </div>
    ),
    backHTML: (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#75c32c] mb-2 opacity-80">Definition</span>
        <p className="text-sm md:text-base font-bold text-gray-600 leading-tight">
          {w.wordData}
        </p>
      </div>
    ),
  }));

  const toggleFocus = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) setIsCollapsed(false);
  };

  return (
    <div className={`
      transition-all duration-300 ease-in-out flex flex-col items-center
      ${isFullscreen 
        ? "fixed inset-0 z-[100] bg-white dark:bg-black p-6 flex items-center justify-center" 
        : "p-4 md:p-6 bg-gray-50/30 dark:bg-gray-800/20 rounded-[2rem] border border-gray-100 dark:border-gray-800"}
    `}>
      
      {/* 1. Tightened Controls */}
      <div className="flex items-center justify-between w-full max-w-2xl mb-4 px-2">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2 group transition-opacity hover:opacity-80"
        >
          <div className="h-7 w-7 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 group-hover:text-[#75c32c] shadow-sm">
            {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
            {isCollapsed ? "Expand" : "Collapse"}
          </span>
        </button>

        {!isCollapsed && (
          <button 
            onClick={toggleFocus}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-wider transition-all
              ${isFullscreen 
                ? "bg-red-50 text-red-500 border border-red-100" 
                : "bg-white dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700 shadow-sm"}
            `}
          >
            {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            {isFullscreen ? "Close" : "Focus"}
          </button>
        )}
      </div>

      {/* 2. Centered Flashcard Content */}
      {!isCollapsed && (
        <div className={`w-full flex justify-center animate-in fade-in zoom-in-95 duration-300 ${isFullscreen ? 'scale-110' : ''}`}>
          <div className="w-full max-w-[340px] md:max-w-[450px]">
            <FlashcardArray
              cards={flashcards}
              frontCardStyle={{
                borderRadius: '1.5rem',
                border: '1px solid #f1f5f9',
                backgroundColor: '#ffffff',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              backCardStyle={{
                borderRadius: '1.5rem',
                border: '2px solid #75c32c',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              FlashcardArrayStyle={{
                width: '100%',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem'
              }}
            />
          </div>
        </div>
      )}

      <style jsx global>{`
        /* Tightened library buttons and pagination */
        .react-quizlet-flashcard-button {
          background-color: #75c32c !important;
          border-radius: 10px !important;
          padding: 8px !important;
          width: 32px !important;
          height: 32px !important;
        }
        .react-quizlet-flashcard-pagination {
          font-size: 11px !important;
          font-weight: 900 !important;
          color: #75c32c !important;
          margin: 0 1rem !important;
        }
        /* Fix for potential left-alignment in the library's root */
        .react-quizlet-flashcard {
          margin: 0 auto !important;
        }
        .react-quizlet-flashcard > div {
          background-color: #ffffff !important;
        }
      `}</style>
    </div>
  );
};

export default Flashcards;