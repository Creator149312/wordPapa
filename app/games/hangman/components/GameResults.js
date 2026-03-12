'use client';
import { Button } from "@/components/ui/button";
import {
  RefreshCw, Trophy, XCircle, Users, Coins,
  TrendingUp, TrendingDown, Flame, Star
} from "lucide-react";
import ShareResult from './ShareResult';
import { GAME_STAKES } from '../lib/progression';

export default function GameResults({
  isWon,
  word,
  category,
  guessedLetters,
  mode,
  onRestart,
  myScore,
  oppScore,
  oppName,
  streak = 0,
  xpEarned = 0,
  coinsEarned = 0
}) {
  const isOnline = mode === 'online';
  const isClassic = mode === 'classic';
  
  const didIWinDuel = isOnline 
    ? (myScore >= oppScore && isWon) || (myScore > oppScore) 
    : isWon;

  const finalXP = isOnline
    ? (didIWinDuel ? xpEarned : -GAME_STAKES.ONLINE_1V1.XP_LOSS)
    : (isWon ? xpEarned : -2);

  const finalCoins = isOnline
    ? (didIWinDuel ? coinsEarned : 0)
    : coinsEarned;

  return (
    <div className="w-full pt-4 text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. STATUS HEADER */}
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/40 p-3 rounded-2xl border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${didIWinDuel ? 'bg-[#75c32c]/20' : 'bg-red-100'}`}>
            {isOnline ? (
              didIWinDuel ? <Trophy className="text-[#75c32c]" size={20} /> : <XCircle className="text-red-500" size={20} />
            ) : (
              isWon ? <Trophy className="text-[#75c32c]" size={20} /> : <XCircle className="text-red-500" size={20} />
            )}
          </div>
          <div className="text-left">
            <h2 className={`text-lg font-black uppercase tracking-tighter leading-none ${didIWinDuel ? 'text-[#75c32c]' : 'text-red-500'}`}>
              {isOnline ? (didIWinDuel ? "Victory!" : "Defeat") : (isWon ? "Word Cleared!" : "Papa Fainted")}
            </h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
              Word: <span className="text-gray-900 dark:text-white font-mono">{word}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex gap-2">
            <div className={`flex items-center gap-1 px-3 py-1 rounded-lg shadow-sm ${finalXP >= 0 ? 'bg-gray-900 dark:bg-white' : 'bg-red-500'}`}>
              {finalXP >= 0 ? <TrendingUp size={10} className="text-[#75c32c]" /> : <TrendingDown size={10} className="text-white" />}
              <span className={`font-black text-[10px] ${finalXP >= 0 ? 'text-white dark:text-gray-900' : 'text-white'}`}>
                {finalXP >= 0 ? `+${finalXP}` : finalXP} XP
              </span>
            </div>
            {finalCoins > 0 && (
              <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50">
                <Coins size={10} className="text-amber-600" />
                <span className="text-amber-700 dark:text-amber-400 font-black text-[10px]">+{finalCoins}</span>
              </div>
            )}
          </div>
          {(isClassic || (isOnline && didIWinDuel)) && (
            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tight">
              {isOnline ? "Including Streak Bonus" : "Run Total Earnings"}
            </span>
          )}
        </div>
      </div>

      {/* 2. STATS & MULTIPLAYER WIN STREAK FEEDBACK */}
      <div className="w-full space-y-2">
        {isOnline ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div className={`p-4 rounded-2xl border ${didIWinDuel ? 'bg-[#75c32c]/5 border-[#75c32c]/20' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800'}`}>
                <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Your Hits</p>
                <p className={`text-3xl font-black ${didIWinDuel ? 'text-[#75c32c]' : 'text-gray-900 dark:text-white'}`}>{myScore}</p>
              </div>
              <div className={`p-4 rounded-2xl border ${!didIWinDuel ? 'bg-red-50 dark:bg-red-950/10 border-red-100 dark:border-red-900/50' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800'}`}>
                <p className="text-[9px] font-black text-gray-400 uppercase mb-1">{oppName || 'Rival'}</p>
                <p className={`text-3xl font-black ${!didIWinDuel ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>{oppScore}</p>
              </div>
            </div>

            {/* NEW: Online Win Streak Visual Feedback */}
            {didIWinDuel && streak > 0 && (
              <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 rounded-2xl p-3 flex items-center justify-center gap-3 animate-bounce shadow-sm">
                <Flame className="text-orange-500" fill="currentColor" size={20} />
                <div className="text-left">
                  <p className="text-orange-600 dark:text-orange-400 font-black text-xs uppercase italic">
                    {streak} MATCH WIN STREAK!
                  </p>
                  <p className="text-[9px] text-orange-400 font-bold uppercase">
                    Large Bonus Applied
                  </p>
                </div>
                <Flame className="text-orange-500" fill="currentColor" size={20} />
              </div>
            )}
          </>
        ) : (
          /* CLASSIC STATS - UNTOUCHED */
          <div className={`${isWon ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900/30' : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'} rounded-2xl p-4 border flex items-center justify-between transition-colors`}>
            <div className="flex items-center gap-4">
               <div className="relative">
                  <h3 className={`text-4xl font-black tracking-tighter ${isWon ? 'text-orange-600' : 'text-gray-400'}`}>{streak}</h3>
                  {streak >= 5 && isWon && <Star className="absolute -top-1 -right-3 text-yellow-400 fill-yellow-400 animate-pulse" size={14} />}
                  {isWon && <Flame className="absolute -bottom-1 -right-2 text-orange-500" size={16} />}
               </div>
               <div className="text-left">
                  <p className={`text-[10px] font-black uppercase leading-none ${isWon ? 'text-orange-400' : 'text-gray-400'}`}>
                    {isWon ? "Current Streak" : "Streak Ended"}
                  </p>
                  <p className="text-[9px] font-medium text-gray-400 uppercase mt-1">
                    Efficiency: {streak >= 10 ? 'Elite' : streak >= 5 ? 'Pro' : 'Starter'}
                  </p>
               </div>
            </div>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full transition-colors ${
                    isWon && i < (streak >= 5 ? 3 : streak >= 2 ? 2 : streak >= 1 ? 1 : 0) 
                    ? 'bg-[#75c32c]' 
                    : 'bg-gray-200 dark:bg-gray-700'
                  }`} 
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. ACTIONS */}
      <div className="flex gap-2">
        <div className="flex-1">
          <ShareResult
            word={word}
            category={category}
            guessedLetters={guessedLetters}
            isWon={isWon}
            streak={streak}
            mode={mode}
            opponentName={oppName}
            myScore={myScore}
            oppScore={oppScore}
            compact={true}
          />
        </div>
        <Button
          onClick={onRestart}
          className={`flex-[2] text-white font-black h-12 rounded-xl uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg ${
            isWon ? 'bg-[#75c32c] hover:bg-[#5da124] shadow-[#75c32c]/20' : 'bg-gray-900 hover:bg-black shadow-black/20'
          }`}
        >
          {isOnline ? <Users size={14} /> : (isWon ? <RefreshCw size={14} /> : <RefreshCw size={14} />)}
          {isOnline ? "Next Match" : (isWon ? "Continue Run" : "Try Again")}
        </Button>
      </div>
    </div>
  );
}