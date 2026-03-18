'use client';

export default function WordDisplay({ wordLetters, guessedLetters, isLost, isWon }) {
  const len = wordLetters.length;

  const getBoxSize = () => {
    if (len > 12) return 'w-7 h-10 md:w-9 md:h-12';
    if (len > 8) return 'w-9 h-12 md:w-11 md:h-14';
    return 'w-10 h-14 md:w-14 md:h-18';
  };

  const getFontSize = () => {
    if (len > 12) return 'text-base md:text-xl';
    if (len > 8) return 'text-xl md:text-3xl';
    return 'text-3xl md:text-5xl';
  };

  return (
    <div className="flex flex-wrap gap-2 md:gap-3 justify-center items-center py-6 w-full max-w-full mx-auto select-none">
      {wordLetters.map((letter, index) => {
        if (letter === ' ') {
          return <div key={index} className="w-4 md:w-8 h-1" />;
        }

        const isRevealed = guessedLetters.includes(letter);
        const showMissed = isLost && !isRevealed;

        return (
          <div
            key={index}
            className={`
              relative flex items-center justify-center transition-all duration-300
              ${getBoxSize()} 
              border-b-[3px] md:border-b-[4px]
              ${isRevealed
                ? 'border-[#75c32c]'
                : showMissed
                  ? 'border-red-500'
                  : 'border-zinc-800 dark:border-zinc-200'
              }
            `}
          >
            <span className={`
              font-black transition-all duration-300 uppercase
              ${getFontSize()}
              ${isRevealed ? 'text-[#75c32c]' : 'text-zinc-800 dark:text-zinc-100'}
              ${showMissed ? 'text-red-500 animate-pulse' : ''}
              ${!isRevealed && !showMissed ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}
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