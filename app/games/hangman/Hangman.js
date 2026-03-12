'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card } from "@/components/ui/card";

// Components
import LevelUpModal from './components/LevelUpModal';
import SaveProgressModal from './components/SaveProgressModal';
import DynamicPapa from './components/DynamicPapa';
import GameResults from './components/GameResults';
import VirtualKeyboard from './components/VirtualKeyboard';
import LevelBar from './components/LevelBar';
import GameHeader from './components/GameHeader';
import WordDisplay from './components/WordDisplay';
import OnlineRaceTracker from './components/OnlineRaceTracker';
import GameLobbyView from './components/GameLobbyView';
import GameTransitionOverlay from './components/GameTransitionOverlay';

// Hooks & Lib
import { useProfile } from './../../ProfileContext';
import { useHangmanSocket } from './hooks/useHangmanSocket';
import { useGameLogic } from './hooks/useGameLogic';
import { calculateLevel, getClassicRewards, getOnlineMatchRewards } from './lib/progression';

const ONLINE_REQUIREMENTS = { MIN_XP: 0, MIN_COINS: 10 };

export default function Hangman({ initialMode = null, dailyWord = null, onDailyComplete = null }) {
  // --- Global State ---
  const {
    profile,
    applyClassicResult,
    showLevelUp,
    setShowLevelUp,
    deductCoins,
    applyOnlineResults,
    addDailyRewards
  } = useProfile();

  // --- Local State ---
  const [gameMode, setGameMode] = useState(initialMode);
  const [gameState, setGameState] = useState(initialMode ? 'playing' : 'menu');
  const [hasClaimedResult, setHasClaimedResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // Matched to Rule #3
  const [sessionSnapshot, setSessionSnapshot] = useState({ streak: 0, totalXP: 0, totalCoins: 0 });
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [opponent, setOpponent] = useState(null);
  const [opponentWon, setOpponentWon] = useState(false);

  // --- Game Logic Hook ---
  const {
    currentGame,
    guessedLetters,
    setGuessedLetters,
    isTransitioning,
    setIsTransitioning,
    wordLetters,
    wrongGuesses,
    correctGuessesCount,
    isLost: logicIsLost,
    isWon: logicIsWon,
    initGameSession,
    currentArena
  } = useGameLogic(dailyWord, profile.xp);

  const currentRank = useMemo(() => calculateLevel(profile.xp), [profile.xp]);

  // --- Socket Hook ---
  const { joinQueue, disconnect, sendGuess, emitFinished, socket } = useHangmanSocket({
    profile,
    initGameSession: (mode, data) => {
      initGameSession(mode, data);
      setHasClaimedResult(false);
      setOpponentWon(false);
      setTimeLeft(120); // Ensure 120s timer
    },
    deductCoins,
    setOpponent,
    setGameState,
    setOpponentWon,
    applyOnlineResults,
    setHasClaimedResult, 
  });

  // --- NEW RULES LOGIC: WIN/LOSS DETERMINATION ---
  
  // Rule #3: Timer Logic
  const isTimeUp = gameMode === 'online' && timeLeft <= 0;
  const myScore = correctGuessesCount;
  const oppScore = opponent?.progress || 0;

  // Rule #2 & #3 Implementation
  const isWon = useMemo(() => {
    if (gameMode === 'online') {
      return (logicIsWon && !opponentWon) || (isTimeUp && myScore > oppScore);
    }
    return logicIsWon;
  }, [gameMode, logicIsWon, opponentWon, isTimeUp, myScore, oppScore]);

  const isLost = useMemo(() => {
    if (gameMode === 'online') {
      return opponentWon || logicIsLost || (isTimeUp && myScore < oppScore);
    }
    return logicIsLost;
  }, [gameMode, opponentWon, logicIsLost, isTimeUp, myScore, oppScore]);

  // Handle Tie-Breaker
  const isDraw = gameMode === 'online' && isTimeUp && myScore === oppScore && !logicIsWon && !opponentWon;
  
  const isGameOver = isWon || isLost || isDraw;

  // --- Actions ---
  const startNewGame = useCallback((resetToMenu = false) => {
    if (resetToMenu && gameState === 'playing' && gameMode === 'classic' && !isGameOver) {
        applyClassicResult(false);
    }

    if (resetToMenu) {
      disconnect();
      setGameMode(null);
      setGameState('menu');
      setOpponent(null);
      setSessionSnapshot({ streak: 0, totalXP: 0, totalCoins: 0 });
    } else {
      initGameSession(gameMode);
      setGameState('playing');
    }
    setHasClaimedResult(false);
    setShowSavePrompt(false);
  }, [gameMode, gameState, isGameOver, initGameSession, disconnect, applyClassicResult]);

  const handleModeSelect = (mode) => {
    if (mode === 'classic' && profile.lives <= 0) {
      return alert(`❤️ You are out of lives! Wait for recovery.`);
    }

    if (mode === 'online') {
      if (profile.papaPoints < ONLINE_REQUIREMENTS.MIN_COINS) return alert(`💰 Not enough coins!`);
      setGameMode(mode);
      joinQueue();
      setGameState('lobby');
    } else {
      setGameMode(mode);
      initGameSession(mode);
      setGameState('playing');
    }
  };

  const handleGuess = useCallback((letter) => {
    const L = letter.toUpperCase();
    if (guessedLetters.includes(L) || isGameOver || gameState !== 'playing' || isTransitioning) return;

    setGuessedLetters(prev => [...prev, L]);

    if (gameMode === 'online' && opponent?.roomId) {
      // Calculate how many letters are revealed after this guess
      const tempGuesses = [...guessedLetters, L];
      const newScore = wordLetters.filter(l => tempGuesses.includes(l)).length;
      sendGuess(opponent.roomId, L, newScore);
    }
  }, [guessedLetters, isGameOver, gameState, wordLetters, gameMode, opponent, isTransitioning, setGuessedLetters, sendGuess]);

  // --- Unified Results Effect ---
  useEffect(() => {
    if (isGameOver && !hasClaimedResult) {
      setHasClaimedResult(true);

      // --- 1. CLASSIC MODE LOGIC (UNTOUCHED) ---
      if (gameMode === 'classic') {
        if (isWon) {
          const rewards = getClassicRewards(profile.currentStreak + 1);
          setSessionSnapshot(prev => ({
            streak: prev.streak + 1,
            totalXP: prev.totalXP + rewards.xpGain,
            totalCoins: prev.totalCoins + rewards.coinGain
          }));
          applyClassicResult(true);
          setIsTransitioning(true);
          setTimeout(() => {
            initGameSession('classic');
            setGuessedLetters([]);
            setIsTransitioning(false);
            setHasClaimedResult(false);
          }, 2000);
        } else {
          applyClassicResult(false);
          if (profile.isGhost) {
            setTimeout(() => setShowSavePrompt(true), 1200);
          }
        }
      }
      
      // --- 2. ONLINE 1v1 LOGIC (FULLY UPDATED) ---
      else if (gameMode === 'online') {
        // If tied, streak is maintained but no reward
        if (isDraw) {
          setSessionSnapshot({ streak: profile.onlineWinStreak, totalXP: 0, totalCoins: 0 });
        } else {
          // Rule #5: Apply rewards and update Multiplayer Streak
          const onlineOutcome = getOnlineMatchRewards(isWon, profile.onlineWinStreak);
          
          setSessionSnapshot({
            streak: isWon ? profile.onlineWinStreak + 1 : 0,
            totalXP: onlineOutcome.xpChange,
            totalCoins: onlineOutcome.coinChange
          });

          // Apply results to global profile (Boolean only, local context handles math)
          applyOnlineResults(isWon);

          // Rule #2: If I won by finishing, tell the server so opponent gets "Defeat"
          if (isWon && logicIsWon && opponent?.roomId) {
            emitFinished(opponent.roomId, profile.name);
          }
        }
      }

      // --- 3. DAILY LOGIC (UNTOUCHED) ---
      else if (gameMode === 'daily' && isWon) {
        addDailyRewards(50, 20);
        onDailyComplete?.();
      }
    }
  }, [isGameOver, isWon, isDraw, gameMode, hasClaimedResult, profile, applyClassicResult, applyOnlineResults, initGameSession, addDailyRewards, onDailyComplete, opponent, emitFinished, setIsTransitioning, setGuessedLetters, logicIsWon]);

  // --- Listeners & Timer ---
  useEffect(() => {
    const onKeyDown = (e) => { if (e.key.match(/^[a-zA-Z]$/)) handleGuess(e.key); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleGuess]);

  useEffect(() => {
    if (gameMode !== 'online' || isGameOver || gameState !== 'playing') return;
    const timer = setInterval(() => setTimeLeft(prev => prev <= 1 ? 0 : prev - 1), 1000);
    return () => clearInterval(timer);
  }, [gameMode, isGameOver, gameState]);

  // --- Render ---
  if (gameState === 'menu' || gameState === 'lobby') {
    return (
      <GameLobbyView
        gameState={gameState}
        handleModeSelect={handleModeSelect}
        profile={profile}
        requirements={ONLINE_REQUIREMENTS}
        socket={socket}
        startNewGame={startNewGame}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-2 md:p-4 transition-all duration-700">
      <div className="max-w-4xl mx-auto mb-2">
        <LevelBar />
      </div>

      <Card className={`max-w-4xl mx-auto p-4 md:p-6 rounded-[2rem] border-none shadow-2xl bg-white dark:bg-gray-900 transition-all duration-500 relative overflow-hidden ${isTransitioning ? 'opacity-40 scale-[0.97]' : 'opacity-100'}`}>
        
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 blur-[100px] opacity-20 transition-colors duration-1000 ${
          currentArena?.id === 'laboratory' ? 'bg-purple-500' : 
          currentArena?.id === 'library' ? 'bg-blue-500' : 'bg-[#75c32c]'
        }`} />

        <div className="relative z-10">
          <GameHeader
            gameMode={gameMode}
            category={currentGame?.category}
            timeLeft={timeLeft}
            onQuit={() => startNewGame(true)}
            currentArena={currentArena}
            streak={gameMode === 'online' ? (isWon ? sessionSnapshot.streak : profile.onlineWinStreak) : 
                    gameMode === 'daily' ? profile.dailyStreak : 
                    (isTransitioning ? sessionSnapshot.streak : profile.currentStreak)}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-4">
            <div className="lg:col-span-8 flex flex-col space-y-6">
              <div className="py-10 bg-gray-50 dark:bg-gray-800/40 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 flex justify-center shadow-inner relative overflow-hidden">
                <WordDisplay wordLetters={wordLetters} guessedLetters={guessedLetters} isLost={isLost} isWon={isWon} />
              </div>

              <div className="min-h-[220px] flex flex-col justify-center">
                {(!hasClaimedResult || isTransitioning) ? (
                  <VirtualKeyboard guessedLetters={guessedLetters} wordLetters={wordLetters} onGuess={handleGuess} disabled={isTransitioning} />
                ) : (
                  <GameResults
                    isWon={isWon}
                    word={currentGame?.word}
                    category={currentGame?.category}
                    guessedLetters={guessedLetters}
                    mode={gameMode}
                    onRestart={() => startNewGame(false)}
                    myScore={correctGuessesCount}
                    oppScore={opponent?.progress || 0}
                    oppName={opponent?.name}
                    streak={sessionSnapshot.streak}
                    xpEarned={sessionSnapshot.totalXP}
                    coinsEarned={sessionSnapshot.totalCoins}
                  />
                )}
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-6">
              <div className="w-full max-w-[280px] lg:max-w-full">
                <DynamicPapa
                  wrongCount={wrongGuesses.length}
                  isWon={isWon}
                  isLost={isLost}
                  streak={gameMode === 'online' ? (isWon ? sessionSnapshot.streak : profile.onlineWinStreak) : 
                          (isTransitioning ? sessionSnapshot.streak : profile.currentStreak)}
                />
              </div>

              {gameMode === 'online' && opponent && (
                <div className="w-full px-4 py-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 shadow-sm">
                  <OnlineRaceTracker myCount={correctGuessesCount} oppCount={opponent.progress} total={wordLetters.length} oppName={opponent.name} />
                </div>
              )}
            </div>
          </div>
        </div>

        {isTransitioning && <GameTransitionOverlay />}
      </Card>

      <LevelUpModal isOpen={showLevelUp} rank={currentRank} onClose={() => setShowLevelUp(false)} />

      {/* <SaveProgressModal
        isOpen={showSavePrompt}
        onClose={() => setShowSavePrompt(false)}
        xp={profile.xp}
        points={profile.papaPoints}
      /> */}
    </div>
  );
}