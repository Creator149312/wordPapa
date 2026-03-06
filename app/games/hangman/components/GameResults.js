'use client';
import { Button } from "@/components/ui/button";
import { RefreshCw, Trophy, XCircle, Users } from "lucide-react";
import ShareResult from './ShareResult';
import WordCard from './WordCard';

export default function GameResults({ 
  isWon, 
  word, 
  category, 
  guessedLetters, 
  mode, 
  onRestart,
  myScore,   // correctGuessesCount
  oppScore,  // opponent.progress
  oppName    // opponent.name
}) {
  const isOnline = mode === 'online';
  
  // Logic: In Online, you "Win" if you found more letters than the opponent
  const didIWinDuel = isOnline ? (myScore >= oppScore && isWon) || (myScore > oppScore) : isWon;

  return (
    <div className="w-full pt-8 border-t-2 border-dashed border-gray-100 dark:border-gray-800 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4">
      
      {/* 1. Header Section */}
      <div className="flex flex-col items-center gap-3">
        <div className={`p-3 rounded-2xl ${didIWinDuel ? 'bg-[#75c32c]/10' : 'bg-red-50'}`}>
          {didIWinDuel ? (
            <Trophy className="text-[#75c32c]" size={40} />
          ) : (
            <XCircle className="text-red-500" size={40} />
          )}
        </div>
        
        <h2 className={`text-4xl font-black uppercase tracking-tighter ${didIWinDuel ? 'text-[#75c32c]' : 'text-red-500'}`}>
          {isOnline 
            ? (didIWinDuel ? "Duel Victory!" : "Duel Defeat") 
            : (isWon ? "Victory!" : "Game Over")}
        </h2>

        {/* Reward Pills */}
        <div className="flex justify-center gap-4 animate-in zoom-in duration-500 delay-300">
          <div className="flex items-center gap-1 bg-gray-900 dark:bg-white px-3 py-1 rounded-lg">
            <span className="text-white dark:text-gray-900 font-black text-[10px] uppercase">
              +{isOnline ? (didIWinDuel ? 100 : 30) : (mode === 'blitz' ? 50 : 20)} XP
            </span>
          </div>
          <div className="flex items-center gap-1 bg-amber-100 px-3 py-1 rounded-lg">
            <span className="text-amber-600 font-black text-[10px] uppercase">
              +🪙 {isOnline ? (didIWinDuel ? 25 : 5) : (mode === 'blitz' ? 10 : 5)}
            </span>
          </div>
        </div>

        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
          The word was: <span className="text-gray-900 dark:text-white font-mono">{word}</span>
        </p>
      </div>

      {/* 2. Scoreboard (Only for Online Mode) */}
      {isOnline && (
        <div className="max-w-md mx-auto grid grid-cols-2 gap-0 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className={`p-4 ${didIWinDuel ? 'bg-[#75c32c]/5' : ''}`}>
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1">You</p>
            <p className={`text-3xl font-black ${didIWinDuel ? 'text-[#75c32c]' : 'text-gray-900 dark:text-white'}`}>{myScore}</p>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Found</p>
          </div>
          <div className="p-4 border-l border-gray-100 dark:border-gray-700">
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1">{oppName || 'Rival'}</p>
            <p className={`text-3xl font-black ${!didIWinDuel ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>{oppScore}</p>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Found</p>
          </div>
        </div>
      )}

      {/* 3. Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <ShareResult
          word={word}
          category={category}
          guessedLetters={guessedLetters}
          isWon={isWon}
        />

        <Button
          onClick={onRestart}
          className="bg-[#75c32c] hover:bg-[#64a825] text-white font-black px-8 h-12 rounded-full uppercase text-[10px] shadow-[0_4px_0_0_#5da124] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
        >
          {isOnline ? <Users size={14} /> : <RefreshCw size={14} />}
          {isOnline ? "New Match" : "Play Again"}
        </Button>
      </div>

      {/* Optional: Show the WordCard at the bottom for learning */}
      {/* <div className="max-w-xs mx-auto opacity-60 hover:opacity-100 transition-opacity">
         <WordCard word={word} />
      </div> */}
    </div>
  );
}