export default function WordDisplay({ wordLetters, guessedLetters, isLost, isWon }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center py-4">
      {wordLetters.map((letter, index) => (
        <div key={index} className="flex flex-col items-center gap-1">
          <span className={`text-3xl md:text-5xl font-black font-mono transition-all duration-500 
            ${isWon ? 'text-[#75c32c] scale-110' : 
              isLost && !guessedLetters.includes(letter) ? 'text-red-500 scale-100' : 
              'text-gray-900 dark:text-white'}`}>
            {guessedLetters.includes(letter) || isLost ? letter : ''}
          </span>
          <div className={`h-1.5 w-8 rounded-full transition-colors duration-500 
            ${isLost && !guessedLetters.includes(letter) ? 'bg-red-200' : 
              isWon ? 'bg-[#75c32c]/30' : 'bg-gray-200 dark:bg-gray-800'}`} 
          />
        </div>
      ))}
    </div>
  );
}