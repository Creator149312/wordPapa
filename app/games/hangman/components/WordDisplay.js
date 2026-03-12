'use client';

export default function WordDisplay({ wordLetters, guessedLetters, isLost, isWon }) {
  const len = wordLetters.length;
  
  // ULTRA-SLEEK SCALING: Keeps long words on one line without bulky height
  const getBoxSize = () => {
    if (len > 12) return 'w-5 h-8 md:w-8 md:h-11';    // Very Long (e.g., CONSTITUTIONAL)
    if (len > 8)  return 'w-7 h-10 md:w-10 md:h-13'; // Medium
    return 'w-8 h-11 md:w-12 md:h-15';               // Short
  };

  const getFontSize = () => {
    if (len > 12) return 'text-[13px] md:text-lg';
    if (len > 8)  return 'text-base md:text-2xl';
    return 'text-xl md:text-3xl';
  };

  return (
    <div className="flex flex-wrap gap-1 md:gap-1.5 justify-center items-center py-1 w-full max-w-full mx-auto select-none">
      {wordLetters.map((letter, index) => {
        const isRevealed = guessedLetters.includes(letter);
        const showMissed = isLost && !isRevealed;

        return (
          <div 
            key={index} 
            className={`
              relative flex items-center justify-center transition-all duration-300
              ${getBoxSize()}
              rounded-md md:rounded-lg border-b-[2px] md:border-b-[3px]
              
              /* Sleek styling: Consistent with the 4-row keyboard */
              ${isRevealed 
                ? 'bg-white dark:bg-gray-800 border-[#75c32c] shadow-sm z-10' 
                : showMissed
                ? 'bg-red-50 dark:bg-red-950/20 border-red-400'
                : 'bg-gray-50/50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-800'
              }
            `}
          >
            {/* The Character */}
            <span className={`
              font-black transition-all duration-200 tracking-tighter
              ${getFontSize()}
              ${isRevealed ? 'text-[#75c32c]' : ''}
              ${showMissed ? 'text-red-500 opacity-70' : ''}
              ${!isRevealed && !showMissed ? 'opacity-0' : 'opacity-100'}
              ${isWon ? 'animate-bounce' : ''}
            `}>
              {isRevealed || isLost ? letter : ''}
            </span>
          </div>
        );
      })}
    </div>
  );
}