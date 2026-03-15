'use client';

export default function WordDisplay({ wordLetters, guessedLetters, isLost, isWon }) {
  const len = wordLetters.length;
  
  // Mobile-first sizing logic (reverted to original scales)
  const getBoxSize = () => {
    if (len > 12) return 'w-6 h-9 md:w-8 md:h-11';
    if (len > 8)  return 'w-8 h-11 md:w-10 md:h-13';
    return 'w-9 h-12 md:w-12 md:h-15';
  };

  const getFontSize = () => {
    if (len > 12) return 'text-sm md:text-lg';
    if (len > 8)  return 'text-lg md:text-2xl';
    return 'text-xl md:text-3xl';
  };

  return (
    <div className="flex flex-wrap gap-1.5 md:gap-2 justify-center items-center py-3 w-full max-w-full mx-auto select-none">
      {wordLetters.map((letter, index) => {
        // Space Handling
        if (letter === ' ') {
          return (
            <div 
              key={index} 
              className="w-3 md:w-6 h-1" 
            />
          );
        }

        const isRevealed = guessedLetters.includes(letter);
        const showMissed = isLost && !isRevealed;

        return (
          <div 
            key={index} 
            className={`
              relative flex items-center justify-center transition-all duration-300
              ${getBoxSize()} rounded-lg border-b-2
              ${isRevealed 
                ? 'bg-transparent' 
                : showMissed
                ? 'bg-red-500/10'
                : 'bg-zinc-100 dark:bg-zinc-800/50'
              }
            `}
          >
            <span className={`
              font-black transition-all duration-200 uppercase
              ${getFontSize()}
              ${isRevealed ? 'text-[#75c32c]' : ''}
              ${showMissed ? 'text-red-500 opacity-70' : ''}
              ${!isRevealed && !showMissed ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}
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