'use client';

export default function VirtualKeyboard({ guessedLetters, wordLetters, onGuess, disabled }) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 w-full max-w-md mx-auto select-none animate-in fade-in duration-500">
      {letters.map((char) => {
        const isGuessed = guessedLetters.includes(char);
        const isCorrect = isGuessed && wordLetters.includes(char);
        const isWrong = isGuessed && !wordLetters.includes(char);

        return (
          <button
            key={char}
            onClick={() => onGuess(char)}
            disabled={disabled || isGuessed}
            className={`
              /* Compact square tiles */
              w-11 h-10 md:w-11 md:h-11 flex items-center justify-center
              text-xs md:text-sm font-black rounded-xl
              transition-all duration-75
              
              ${!isGuessed 
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-95' 
                : ''
              }
              ${isCorrect 
                ? 'bg-[#75c32c] text-white' 
                : ''
              }
              ${isWrong 
                ? 'bg-zinc-200 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600 opacity-40 scale-95' 
                : ''
              }
              ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            `}
          >
            {char}
          </button>
        );
      })}
    </div>
  );
}

// 'use client';

// export default function VirtualKeyboard({ guessedLetters, wordLetters, onGuess, disabled }) {
//   const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

//   return (
//     <div className="grid grid-cols-7 gap-1 md:gap-1.5 w-full max-w-sm mx-auto select-none animate-in fade-in duration-500">
//       {letters.map((char) => {
//         const isGuessed = guessedLetters.includes(char);
//         const isCorrect = isGuessed && wordLetters.includes(char);
//         const isWrong = isGuessed && !wordLetters.includes(char);

//         return (
//           <button
//             key={char}
//             onClick={() => onGuess(char)}
//             disabled={disabled || isGuessed}
//             className={`
//               /* Compact square tiles */
//               aspect-square flex items-center justify-center
//               text-[11px] md:text-xs font-black rounded-md
//               transition-all duration-75 border-b-[2px]
              
//               ${!isGuessed 
//                 ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-950 active:translate-y-[1px] active:border-b-0' 
//                 : ''
//               }
//               ${isCorrect 
//                 ? 'bg-[#75c32c] text-white border-[#5da124]' 
//                 : ''
//               }
//               ${isWrong 
//                 ? 'bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-600 border-transparent opacity-30 shadow-none' 
//                 : ''
//               }
//               ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
//             `}
//           >
//             {char}
//           </button>
//         );
//       })}
      
//       {/* Optional: Visual spacers to maintain grid symmetry for the last row */}
//       <div className="aspect-square opacity-0 pointer-events-none" />
//       <div className="aspect-square opacity-0 pointer-events-none" />
//     </div>
//   );
// }