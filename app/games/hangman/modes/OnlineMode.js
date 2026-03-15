"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { Card } from "@/components/ui/card";

// Shared Components
import GameHeader from "../components/GameHeader";
import WordDisplay from "../components/WordDisplay";
import VirtualKeyboard from "../components/VirtualKeyboard";
import GameResults from "../components/GameResults";
import OnlineRaceTracker from "../components/OnlineRaceTracker";
import DynamicPapa from "../components/DynamicPapa";
import GameTransitionOverlay from "../components/GameTransitionOverlay";

// Hooks & Lib
import { useHangmanSocket } from "../hooks/useHangmanSocket";
import { useGameLogic } from "../hooks/useGameLogic";
import { getOnlineMatchRewards, calculateLevel } from "../lib/progression";
import { RANKS, ARENAS } from "../constants";

export default function OnlineMode({ profile, onQuit, applyOnlineResults, syncToDatabase }) {
  const [hasClaimedResult, setHasClaimedResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [opponent, setOpponent] = useState(null);
  const [opponentWon, setOpponentWon] = useState(false);
  const [gameState, setGameState] = useState("playing");
  
  const [sessionSnapshot, setSessionSnapshot] = useState({
    streak: 0,
    totalXP: 0,
    totalCoins: 0,
  });

  const syncLock = useRef(false);

  // --- Logic Helpers ---
  const currentRank = useMemo(() => {
    return RANKS.find(r => profile.xp >= r.minXP && profile.xp < (RANKS[RANKS.indexOf(r) + 1]?.minXP || Infinity)) || RANKS[0];
  }, [profile.xp]);

  const activeArena = useMemo(() => ARENAS[currentRank.arenaId] || ARENAS[1], [currentRank]);

  const {
    currentGame,
    guessedLetters,
    setGuessedLetters,
    isTransitioning,
    wordLetters,
    wrongGuesses,
    correctGuessesCount,
    isLost: logicIsLost,
    isWon: logicIsWon,
    initGameSession,
  } = useGameLogic(null, profile.xp);

  // --- Socket Integration ---
  const { disconnect, sendGuess, emitFinished } = useHangmanSocket({
    profile,
    initGameSession: (mode, data) => {
      initGameSession("online", data);
      setHasClaimedResult(false);
      setOpponentWon(false);
      setTimeLeft(120);
      syncLock.current = false;
    },
    setOpponent,
    setGameState,
    setOpponentWon,
    applyOnlineResults,
    setHasClaimedResult,
  });

  // --- Win/Loss Logic ---
  const isTimeUp = timeLeft <= 0;
  const myScore = correctGuessesCount;
  const oppScore = opponent?.progress || 0;

  const isWon = useMemo(() => 
    (logicIsWon && !opponentWon) || (isTimeUp && myScore > oppScore), 
  [logicIsWon, opponentWon, isTimeUp, myScore, oppScore]);

  const isLost = useMemo(() => 
    opponentWon || wrongGuesses.length >= 6 || (isTimeUp && myScore < oppScore), 
  [opponentWon, wrongGuesses.length, isTimeUp, myScore, oppScore]);

  const isDraw = isTimeUp && myScore === oppScore && !logicIsWon && !opponentWon;
  const isGameOver = isWon || isLost || isDraw;

  // --- Handlers ---
  const handleGuess = (letter) => {
    const L = letter.toUpperCase();
    if (guessedLetters.includes(L) || isGameOver || isTransitioning) return;

    setGuessedLetters((prev) => [...prev, L]);
    if (opponent?.roomId) {
      const newScore = wordLetters.filter(l => [...guessedLetters, L].includes(l)).length;
      sendGuess(opponent.roomId, L, newScore);
    }
  };

  const startNewGame = (resetToMenu = false) => {
    if (resetToMenu) {
      disconnect();
      onQuit();
    } else {
      // Typically Online Mode requires re-entering the lobby
      disconnect();
      onQuit(); 
    }
  };

  // --- Effects ---
  useEffect(() => {
    if (isGameOver && !hasClaimedResult && !syncLock.current) {
      syncLock.current = true;
      const onlineOutcome = getOnlineMatchRewards(isWon, profile.onlineWinStreak);
      const earnedXP = onlineOutcome.xpChange;
      const earnedCoins = onlineOutcome.coinChange;
      const newStreak = isWon ? profile.onlineWinStreak + 1 : 0;

      setSessionSnapshot({ streak: newStreak, totalXP: earnedXP, totalCoins: earnedCoins });
      applyOnlineResults(isWon);
      
      if (isWon && logicIsWon && opponent?.roomId) {
        emitFinished(opponent.roomId, profile.name);
      }

      const updatedProfile = {
        ...profile,
        xp: Math.max(0, profile.xp + earnedXP),
        papaPoints: profile.papaPoints + earnedCoins,
        onlineWinStreak: newStreak,
      };
      syncToDatabase(updatedProfile);
      setHasClaimedResult(true);
    }
  }, [isGameOver, isWon, hasClaimedResult, profile, opponent, logicIsWon]);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(p => p <= 0 ? 0 : p - 1), 1000);
    return () => clearInterval(timer);
  }, [isGameOver]);

  return (
    <div className="flex flex-col space-y-4">
      <GameHeader
        gameMode="online"
        category={currentGame?.category}
        timeLeft={timeLeft}
        onQuit={() => startNewGame(true)}
        currentArena={activeArena}
        wrongCount={wrongGuesses.length}
        maxTries={6}
        streak={hasClaimedResult ? sessionSnapshot.streak : profile.onlineWinStreak}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="py-3 flex justify-center bg-zinc-100 dark:bg-zinc-900/40 rounded-2xl">
            <WordDisplay wordLetters={wordLetters} guessedLetters={guessedLetters} isLost={isLost} isWon={isWon} />
          </div>

          <div className="min-h-[180px] md:min-h-[220px]">
            {!hasClaimedResult ? (
              <VirtualKeyboard guessedLetters={guessedLetters} wordLetters={wordLetters} onGuess={handleGuess} disabled={isTransitioning} />
            ) : (
              <GameResults isWon={isWon} word={currentGame?.word} mode="online" onRestart={() => startNewGame(false)} streak={sessionSnapshot.streak} xpEarned={sessionSnapshot.totalXP} coinsEarned={sessionSnapshot.totalCoins} />
            )}
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col items-center space-y-4">
          <DynamicPapa wrongCount={wrongGuesses.length} isWon={isWon} isLost={isLost} maxTries={6} arenaId={currentRank.arenaId} streak={hasClaimedResult ? sessionSnapshot.streak : profile.onlineWinStreak} />
          {opponent && (
            <div className="w-full px-4 py-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-2xl backdrop-blur-sm">
              <OnlineRaceTracker myCount={correctGuessesCount} oppCount={opponent.progress} total={wordLetters.length} oppName={opponent.name} />
            </div>
          )}
        </div>
      </div>
      {isTransitioning && <GameTransitionOverlay />}
    </div>
  );
}