"use client";

export default function VirtualKeyboard({
  guessedLetters,
  wordLetters,
  onGuess,
  disabled,
  accent = "#75c32c", // Default if not passed
}) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-3 w-full max-w-2xl mx-auto md:px-2 select-none">
      {letters.map((char) => {
        const isGuessed = guessedLetters.includes(char);
        const isCorrect = isGuessed && wordLetters.includes(char);
        const isWrong = isGuessed && !wordLetters.includes(char);

        return (
          <button
            key={char}
            onClick={() => onGuess(char)}
            disabled={disabled || isGuessed}
            style={{
              backgroundColor: isCorrect ? accent : undefined,
              borderColor: isCorrect ? accent : undefined,
              // filter: 'brightness(0.8)' on the border creates that tactile shadow look
            }}
            className={`
              /* Tactile Sketch Style */
              w-10 h-10 md:w-12 md:h-12 flex items-center justify-center
              text-sm md:text-lg font-black rounded-lg
              border-2 border-b-4 transition-all duration-75
              
              ${
                !isGuessed
                  ? "bg-white dark:bg-zinc-900 border-zinc-800 dark:border-zinc-200 text-zinc-800 dark:text-zinc-100 hover:translate-y-[1px] hover:border-b-2 active:translate-y-[3px] active:border-b-0"
                  : ""
              }
              ${
                isCorrect
                  ? "text-white translate-y-[2px] border-b-2 shadow-inner brightness-100 [border-bottom-color:rgba(0,0,0,0.3)]"
                  : ""
              }
              ${
                isWrong
                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 border-zinc-300 dark:border-zinc-700 opacity-40 translate-y-[3px] border-b-0 shadow-none"
                  : ""
              }
              ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            {char}
          </button>
        );
      })}
    </div>
  );
}
