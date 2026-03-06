'use client';

export default function VirtualKeyboard({ guessedLetters, wordLetters, onGuess }) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="grid grid-cols-7 md:grid-cols-9 gap-2 w-full max-w-xl animate-in fade-in zoom-in duration-500">
      {letters.map((char) => {
        const isGuessed = guessedLetters.includes(char);
        const isCorrect = isGuessed && wordLetters.includes(char);
        const isWrong = isGuessed && !wordLetters.includes(char);

        return (
          <button
            key={char}
            onClick={() => onGuess(char)}
            disabled={isGuessed}
            className={`
              h-10 md:h-12 text-sm font-black rounded-xl transition-all active:scale-95
              ${isCorrect 
                ? 'bg-[#75c32c] text-white shadow-[0_4px_0_0_#5da124]' 
                : isWrong 
                ? 'bg-gray-100 text-gray-300 dark:bg-gray-800 dark:text-gray-600 opacity-50' 
                : 'bg-gray-50 dark:bg-gray-800 hover:border-[#75c32c] border-2 border-transparent text-gray-700 dark:text-gray-200'
              }
            `}
          >
            {char}
          </button>
        );
      })}
    </div>
  );
}