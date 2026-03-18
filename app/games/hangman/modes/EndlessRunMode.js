"use client";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";

// UI Components
import GameHeader from "../components/GameHeader";
import WordDisplay from "../components/WordDisplay";
import VirtualKeyboard from "../components/VirtualKeyboard";
import GameResults from "../components/GameResults";
import DynamicPapa from "../components/DynamicPapa";
import GameTransitionOverlay from "../components/GameTransitionOverlay";
import MilestoneBanner from "../components/MilestoneBanner";

// Hooks & Logic
import { useGameLogic } from "../hooks/useGameLogic";
import { useAudio } from "../hooks/useAudio";
import { RANKS, ARENAS } from "../constants";

export default function EndlessRunMode({
  profile,
  onQuit,
  syncToDatabase,
  triggerSavePrompt,
  applyEndlessResult,
  deductCoins,
}) {
  // --- Game State ---
  const [globalMistakes, setGlobalMistakes] = useState(0);
  const [totalWordsSolved, setTotalWordsSolved] = useState(0);
  const [totalXPEarned, setTotalXPEarned] = useState(0);
  const [totalCoinsEarned, setTotalCoinsEarned] = useState(0);
  const [hasClaimedResult, setHasClaimedResult] = useState(false);

  // --- Animation/UI States ---
  const [showMilestone, setShowMilestone] = useState(false);
  const [isReviving, setIsReviving] = useState(false);
  const [isRunEnded, setIsRunEnded] = useState(false);
  const [revivesUsed, setRevivesUsed] = useState(0);

  const { playSynth } = useAudio();
  const MAX_GLOBAL_LIVES = 10;
  const REVIVE_COST = 50;
  const TRANSITION_MS = 2000;

  const syncLock = useRef(false);
  const prevWrongCount = useRef(0);
  const transitionLock = useRef(false);

  // Use current profile XP to set word difficulty
  const {
    currentGame,
    guessedLetters,
    setGuessedLetters,
    isTransitioning,
    setIsTransitioning,
    wordLetters,
    wrongGuesses,
    isWon,
    initGameSession,
  } = useGameLogic(null, profile.xp);

  // Derived rank/arena for environmental changes
  const currentRank = useMemo(() => {
    return RANKS.find(r =>
      profile.xp >= r.minXP &&
      profile.xp < (RANKS[RANKS.indexOf(r) + 1]?.minXP || Infinity)
    ) || RANKS[0];
  }, [profile.xp]);

  // 1. Initial Load
  useEffect(() => {
    if (!currentGame && !hasClaimedResult) initGameSession("endless");
  }, [currentGame, initGameSession, hasClaimedResult]);

  // 2. Health & Sound Handling
  useEffect(() => {
    if (wrongGuesses.length > prevWrongCount.current) {
      const delta = wrongGuesses.length - prevWrongCount.current;
      setGlobalMistakes((prev) => prev + delta);
      playSynth("POP");
      prevWrongCount.current = wrongGuesses.length;
    }
  }, [wrongGuesses, playSynth]);

  useEffect(() => { prevWrongCount.current = 0; }, [currentGame]);

  const isGameOver = globalMistakes >= MAX_GLOBAL_LIVES;

  // 3. Transition Logic & Milestone Banner Trigger
  useEffect(() => {
    if (isWon && !isGameOver && !transitionLock.current) {
      transitionLock.current = true;
      setIsTransitioning(true);

      const nextSolvedCount = totalWordsSolved + 1;
      setTotalWordsSolved(nextSolvedCount);
      setTotalXPEarned((x) => x + 100);
      setTotalCoinsEarned((c) => c + 10);

      // Milestone Logic: Every 5 words, show the Banner with XP Preview
      if (nextSolvedCount % 3 === 0) {
        setTimeout(() => {
          setShowMilestone(true);
          playSynth("MILESTONE");
        }, 500);
        setTimeout(() => setShowMilestone(false), 5000); // 5s to see progress
      }

      // Handshake to refresh word
      setTimeout(() => setGuessedLetters([]), 400);
      setTimeout(() => initGameSession("endless"), 800);
      setTimeout(() => {
        setIsTransitioning(false);
        transitionLock.current = false;
      }, TRANSITION_MS);
    }
  }, [isWon, isGameOver, initGameSession, setIsTransitioning, setGuessedLetters, totalWordsSolved, playSynth]);

  // 4. Revive Logic with Refill Animation
  const handleRevive = () => {
    if (profile.papaPoints >= REVIVE_COST) {
      const success = deductCoins(REVIVE_COST);
      if (success) {
        setIsReviving(true);
        playSynth("MILESTONE");
        setTimeout(() => {
          setGlobalMistakes(MAX_GLOBAL_LIVES - 5);
          setRevivesUsed((prev) => prev + 1);
          setIsReviving(false);
        }, 1200);
      }
    } else {
      alert("💰 Not enough Papa Coins!");
    }
  };

  const handleRestart = useCallback(() => {
    setGlobalMistakes(0);
    setTotalWordsSolved(0);
    setTotalXPEarned(0);
    setTotalCoinsEarned(0);
    setHasClaimedResult(false);
    setIsRunEnded(false);
    setRevivesUsed(0);
    setIsReviving(false);
    setShowMilestone(false);
    syncLock.current = false;
    prevWrongCount.current = 0;
    transitionLock.current = false;
    setGuessedLetters([]);
    setIsTransitioning(false);
    initGameSession("endless");
  }, [initGameSession, setGuessedLetters, setIsTransitioning]);

  // 5. Database Syncing
  useEffect(() => {
    const shouldSync = isRunEnded || (isGameOver && revivesUsed >= 1);
    if (shouldSync && !hasClaimedResult && !syncLock.current) {
      syncLock.current = true;
      setIsRunEnded(true);

      applyEndlessResult(totalWordsSolved, totalXPEarned, totalCoinsEarned);

      const finalProfile = {
        ...profile,
        xp: profile.xp + totalXPEarned,
        papaPoints: profile.papaPoints + totalCoinsEarned,
        highestEndlessRun: Math.max(profile.highestEndlessRun || 0, totalWordsSolved),
      };

      if (!profile.isGhost) syncToDatabase(finalProfile);
      setHasClaimedResult(true);
      if (profile.isGhost) setTimeout(() => triggerSavePrompt?.(), 1500);
    }
  }, [isRunEnded, isGameOver, revivesUsed, profile, totalXPEarned, totalCoinsEarned, totalWordsSolved, syncToDatabase, hasClaimedResult, triggerSavePrompt, applyEndlessResult]);

  const handleGuess = (letter) => {
    if (guessedLetters.includes(letter) || isGameOver || isTransitioning || isReviving) return;
    if (wordLetters.includes(letter)) playSynth("CORRECT");
    setGuessedLetters((prev) => [...prev, letter]);
  };

  return (
    <div className="flex flex-col space-y-4 relative">
      <GameHeader
        gameMode="endless"
        category={currentGame?.category || "Loading..."}
        onQuit={onQuit}
        currentArena={ARENAS[currentRank.arenaId]}
        wrongCount={globalMistakes}
        maxTries={MAX_GLOBAL_LIVES}
        streak={totalWordsSolved}
      />

      {showMilestone && (
        <MilestoneBanner
          streak={totalWordsSolved}
          stageName={currentRank.stageName}
          currentXP={profile.xp + totalXPEarned} // For the Progress Preview
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="py-3 flex justify-center bg-zinc-100 dark:bg-zinc-900/40 rounded-2xl min-h-[100px] relative overflow-hidden border-2 border-dashed border-zinc-200 dark:border-zinc-800">
            <WordDisplay
              wordLetters={wordLetters}
              guessedLetters={guessedLetters}
              isLost={isRunEnded || (isGameOver && revivesUsed >= 1)}
              isWon={isWon}
            />
          </div>

          <div className="min-h-[220px]">
            {!isGameOver || isReviving ? (
              <VirtualKeyboard
                guessedLetters={guessedLetters}
                wordLetters={wordLetters}
                onGuess={handleGuess}
                disabled={isTransitioning || isReviving}
              />
            ) : (
              <GameResults
                isWon={false}
                word={isRunEnded ? "Run Ended" : "Out of Lives"}
                mode="endless"
                onRestart={handleRestart}
                streak={totalWordsSolved}
                xpEarned={totalXPEarned}
                coinsEarned={totalCoinsEarned}
                onRevive={handleRevive}
                onEndRun={() => setIsRunEnded(true)}
                isRunEnded={isRunEnded || revivesUsed >= 1}
                revivesUsed={revivesUsed}
                reviveCost={REVIVE_COST}
              />
            )}
          </div>
        </div>

        <div className="lg:col-span-4 flex justify-center">
          <DynamicPapa
            wrongCount={globalMistakes}
            isWon={isWon}
            isLost={isGameOver && !isReviving}
            isReviving={isReviving}
            maxTries={MAX_GLOBAL_LIVES}
            streak={totalWordsSolved}
            arenaId={currentRank.arenaId}
          />
        </div>
      </div>

      {isTransitioning && !isGameOver && (
        <GameTransitionOverlay
          duration={TRANSITION_MS}
          accent={currentRank.color}
        />
      )}
    </div>
  );
}