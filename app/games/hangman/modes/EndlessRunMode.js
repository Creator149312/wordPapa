"use client";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Lightbulb, Eraser, Activity } from "lucide-react";

// UI Components
import GameHeader from "../components/GameHeader";
import WordDisplay from "../components/WordDisplay";
import VirtualKeyboard from "../components/VirtualKeyboard";
import GameResults from "../components/GameResults";
import DynamicPapa from "../components/DynamicPapa";
import GameTransitionOverlay from "../components/GameTransitionOverlay";
import MilestoneBanner from "../components/MilestoneBanner";
import SessionProgress from "../components/SessionProgress";

// Hooks, Constants
import { useGameLogic } from "../hooks/useGameLogic";
import { useAudio } from "../hooks/useAudio";
import { RANKS } from "../constants";

export default function EndlessRunMode({
  profile,
  onQuit,
  syncToDatabase,
  triggerSavePrompt,
  applyEndlessResult,
  deductCoins,
  getWord,
}) {
  // --- Game State ---
  const [globalMistakes, setGlobalMistakes] = useState(0);
  const [totalWordsSolved, setTotalWordsSolved] = useState(0);
  const [totalXPEarned, setTotalXPEarned] = useState(0);
  const [totalCoinsEarned, setTotalCoinsEarned] = useState(0);
  const [usedWordTexts, setUsedWordTexts] = useState([]);
  const [hasClaimedResult, setHasClaimedResult] = useState(false);

  // --- Hill Climb Refill State ---
  const [isRefilling, setIsRefilling] = useState(false);

  // --- Mentor & Hint States ---
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [showMentorMsg, setShowMentorMsg] = useState(false);
  const [hintRevealed, setHintRevealed] = useState(false);

  // --- Animation/UI States ---
  const [showMilestone, setShowMilestone] = useState(false);
  const [isReviving, setIsReviving] = useState(false);
  const [isRunEnded, setIsRunEnded] = useState(false);
  const [revivesUsed, setRevivesUsed] = useState(0);

  // --- NEW: Block Blast Style Revive Timer ---
  const [reviveCountdown, setReviveCountdown] = useState(null);

  const { playSynth } = useAudio();
  const MAX_GLOBAL_LIVES = 5;
  const REVIVE_COST = 50;
  const SHATTER_COST = 15;
  const TRANSITION_MS = 2000;
  const REVIVE_WINDOW_SECONDS = 6;

  const syncLock = useRef(false);
  const prevWrongCount = useRef(0);
  const transitionLock = useRef(false);
  const isShatteringInternal = useRef(false);

  // --- 1. RANK & PROGRESS LOGIC ---
  const playerRank = useMemo(() => {
    return (
      [...RANKS]
        .reverse()
        .find((r) => (profile.highestEndlessXP || 0) >= r.minXP) || RANKS[0]
    );
  }, [profile.highestEndlessXP]);

  const currentLevel = Math.min(
    (playerRank.level || 1) + Math.floor(totalWordsSolved / 5),
    10,
  );

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

  // --- 2. SESSION PROGRESS CALCULATIONS ---
  const isBreakingXPRecord = useMemo(() => {
    const previousBest = profile.highestEndlessXP || 0;
    return totalXPEarned > previousBest && totalXPEarned > 0;
  }, [totalXPEarned, profile.highestEndlessXP]);

  const xpPercent = useMemo(() => {
    const previousBest = profile.highestEndlessXP || 0;
    if (previousBest === 0) return totalXPEarned > 0 ? 100 : 0;
    return Math.min((totalXPEarned / previousBest) * 100, 100);
  }, [totalXPEarned, profile.highestEndlessXP]);

  // --- 3. SESSION TIMERS & INIT ---
  useEffect(() => {
    if (!currentGame && !hasClaimedResult) {
      const firstWord = getWord(currentLevel, []);
      setUsedWordTexts([firstWord.word]);
      initGameSession("endless", firstWord);
    }
    setSecondsElapsed(0);
    setHintRevealed(false);
    setShowMentorMsg(false);

    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentGame, initGameSession, hasClaimedResult, currentLevel, getWord]);

  // --- 4. REVIVE COUNTDOWN LOGIC (The "Block Blast" heart) ---
  useEffect(() => {
    let timer;
    const isGameOver = globalMistakes >= MAX_GLOBAL_LIVES;

    if (isGameOver && !isReviving && !isRunEnded && !hasClaimedResult) {
      // Start countdown if it's null
      if (reviveCountdown === null) {
        setReviveCountdown(REVIVE_WINDOW_SECONDS);
      }

      if (reviveCountdown > 0) {
        timer = setInterval(() => {
          setReviveCountdown((prev) => prev - 1);
        }, 1000);
      } else if (reviveCountdown === 0) {
        // TIME EXPIRED
        setIsRunEnded(true);
        setReviveCountdown(null);
      }
    } else {
      // Reset if game state changes
      if (reviveCountdown !== null) setReviveCountdown(null);
    }

    return () => clearInterval(timer);
  }, [
    globalMistakes,
    isReviving,
    isRunEnded,
    reviveCountdown,
    hasClaimedResult,
  ]);

  // --- 5. REFILL LOGIC ---
  useEffect(() => {
    if (totalWordsSolved > 0) {
      const isInitialStation = totalWordsSolved === 5;
      const isRecurringStation = (totalWordsSolved - 5) % 6 === 0;

      if (isInitialStation || isRecurringStation) {
        setIsRefilling(true);
        setGlobalMistakes(0);
        playSynth("REFILL");
        setTimeout(() => setIsRefilling(false), 3000);
      }
    }
  }, [totalWordsSolved, playSynth]);

  // --- 6. MISTAKE TRACKING ---
  useEffect(() => {
    if (wrongGuesses.length > prevWrongCount.current) {
      const delta = wrongGuesses.length - prevWrongCount.current;
      if (!isShatteringInternal.current) {
        setGlobalMistakes((prev) => prev + delta);
        playSynth("POP");
      }
      prevWrongCount.current = wrongGuesses.length;
    }
  }, [wrongGuesses, playSynth]);

  useEffect(() => {
    prevWrongCount.current = 0;
  }, [currentGame]);

  const isGameOver = globalMistakes >= MAX_GLOBAL_LIVES;

  // --- 7. POWER-UPS & REVIVES ---
  const handleShatter = () => {
    if (profile.papaPoints < SHATTER_COST) return;
    const wrongOptions = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      .split("")
      .filter((l) => !wordLetters.includes(l) && !guessedLetters.includes(l));
    if (wrongOptions.length === 0) return;

    isShatteringInternal.current = true;
    deductCoins(SHATTER_COST);
    playSynth("CORRECT");
    const toRemove = wrongOptions.sort(() => 0.5 - Math.random()).slice(0, 3);
    setGuessedLetters((prev) => [...prev, ...toRemove]);
    setTimeout(() => {
      isShatteringInternal.current = false;
    }, 100);
  };

  const handleRevealHint = () => {
    setHintRevealed(true);
    playSynth("CORRECT");
  };

  const handleRevive = () => {
    if (profile.papaPoints >= REVIVE_COST) {
      const success = deductCoins(REVIVE_COST);
      if (success) {
        setReviveCountdown(null); // Stop the clock immediately
        setIsReviving(true);
        playSynth("MILESTONE");
        setHasClaimedResult(false);
        syncLock.current = false;

        setTimeout(() => {
          setGlobalMistakes(0);
          setRevivesUsed((prev) => prev + 1);
          setIsReviving(false);
        }, 1200);
      }
    }
  };

  // --- 8. WIN LOGIC ---
  useEffect(() => {
    if (isWon && !isGameOver && !transitionLock.current) {
      transitionLock.current = true;
      setIsTransitioning(true);

      const nextSolvedCount = totalWordsSolved + 1;
      setTotalWordsSolved(nextSolvedCount);

      const wordLevel = currentGame?.wordLevel || 1;
      const xpGain = currentGame.word.length * 10 + wordLevel * 15;
      const coinGain = Math.ceil(xpGain / 10);

      setTotalXPEarned((x) => x + xpGain);
      setTotalCoinsEarned((c) => c + coinGain);

      if (nextSolvedCount % 5 === 0) {
        setTimeout(() => {
          setShowMilestone(true);
          playSynth("MILESTONE");
        }, 500);
        setTimeout(() => setShowMilestone(false), 7000);
      }

      const nextWordEntry = getWord(currentLevel, usedWordTexts);
      setUsedWordTexts((prev) => [...prev, nextWordEntry.word]);

      setTimeout(() => setGuessedLetters([]), 400);
      setTimeout(() => initGameSession("endless", nextWordEntry), 800);
      setTimeout(() => {
        setIsTransitioning(false);
        transitionLock.current = false;
      }, TRANSITION_MS);
    }
  }, [
    isWon,
    isGameOver,
    initGameSession,
    setIsTransitioning,
    setGuessedLetters,
    totalWordsSolved,
    playSynth,
    currentLevel,
    usedWordTexts,
    getWord,
    currentGame,
  ]);

  // --- 9. DATABASE SYNC ---
  useEffect(() => {
    const shouldSync =
      isRunEnded || (isGameOver && !isReviving && reviveCountdown === 0);

    if (shouldSync && !hasClaimedResult && !syncLock.current) {
      syncLock.current = true;

      const profileSnapshot = {
        xp: (profile.xp || 0) + totalXPEarned,
        totalWordsSolved: (profile.totalWordsSolved || 0) + totalWordsSolved,
        papaPoints: (profile.papaPoints || 0) + totalCoinsEarned,
        highestEndlessRun: Math.max(
          profile.highestEndlessRun || 0,
          totalWordsSolved,
        ),
        highestEndlessXP: Math.max(
          profile.highestEndlessXP || 0,
          totalXPEarned,
        ),
      };

      applyEndlessResult(profileSnapshot);

      if (!profile.isGhost && syncToDatabase) {
        syncToDatabase(profileSnapshot);
      }

      setHasClaimedResult(true);

      if (profile.isGhost && triggerSavePrompt) {
        setTimeout(() => triggerSavePrompt(), 1500);
      }
    }
  }, [
    isRunEnded,
    isGameOver,
    isReviving,
    reviveCountdown,
    hasClaimedResult,
    totalXPEarned,
    totalCoinsEarned,
    totalWordsSolved,
    profile,
    syncToDatabase,
    applyEndlessResult,
    triggerSavePrompt,
  ]);

  const handleGuess = (letter) => {
    if (
      guessedLetters.includes(letter) ||
      isGameOver ||
      isTransitioning ||
      isReviving
    )
      return;
    if (wordLetters.includes(letter)) playSynth("CORRECT");
    setGuessedLetters((prev) => [...prev, letter]);
  };

  const handleRestart = useCallback(() => {
    setGlobalMistakes(0);
    setTotalWordsSolved(0);
    setTotalXPEarned(0);
    setTotalCoinsEarned(0);
    setUsedWordTexts([]);
    setHasClaimedResult(false);
    setIsRunEnded(false);
    setRevivesUsed(0);
    setGuessedLetters([]);
    setReviveCountdown(null);
    syncLock.current = false;
    transitionLock.current = false;
    initGameSession("endless");
  }, [initGameSession, setGuessedLetters]);

  return (
    <div className="flex flex-col space-y-2 md:space-y-4 relative w-full max-w-5xl mx-auto px-2 md:px-0 pb-10">
      <SessionProgress
        totalXPEarned={totalXPEarned}
        xpPercent={xpPercent}
        isBreakingXPRecord={isBreakingXPRecord}
        isRefilling={isRefilling}
        highestXP={profile.highestEndlessXP}
        accent={playerRank.color}
      />

      <GameHeader
        gameMode="endless"
        category={currentGame?.category || "Loading..."}
        onQuit={onQuit}
        playerRank={playerRank}
        wrongCount={globalMistakes}
        maxTries={MAX_GLOBAL_LIVES}
        streak={totalWordsSolved}
      />

      {showMilestone && (
        <MilestoneBanner
          streak={totalWordsSolved}
          stageName={playerRank.name}
          currentXP={profile.xp + totalXPEarned}
        />
      )}

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-center lg:items-start justify-center">
        <div className="w-full lg:w-1/3 flex justify-center order-1">
          <DynamicPapa
            errors={globalMistakes}
            maxErrors={MAX_GLOBAL_LIVES}
            isWinner={isWon}
            accent={playerRank.color}
            secondsElapsed={secondsElapsed}
            showMentorMsg={showMentorMsg}
            currentRankName={playerRank.name}
            streak={totalWordsSolved}
          />
        </div>

        <div className="w-full lg:w-2/3 flex flex-col space-y-3 md:space-y-6 order-2">
          <div className="py-4 md:py-8 flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-900/40 rounded-2xl md:rounded-3xl min-h-[140px] md:min-h-[180px] relative overflow-hidden border-2 border-dashed border-zinc-200 dark:border-zinc-800">
            <div className="absolute top-2 left-3 flex items-center gap-1 opacity-40">
              <Activity size={10} style={{ color: playerRank.color }} />
              <span className="text-[9px] font-bold uppercase tracking-widest">
                Stage {currentLevel}
              </span>
            </div>

            <WordDisplay
              wordLetters={wordLetters}
              guessedLetters={guessedLetters}
              isLost={isRunEnded || (isGameOver && !isReviving)}
              isWon={isWon}
            />

            {(wrongGuesses.length >= 2 || secondsElapsed >= 10) &&
              currentGame?.hint && (
                <div className="mt-4 flex flex-col items-center">
                  {!hintRevealed ? (
                    <button
                      onClick={handleRevealHint}
                      className="flex items-center gap-2 px-4 py-1.5 bg-yellow-400 text-black rounded-full font-black text-[10px] uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all"
                    >
                      <Lightbulb size={12} fill="currentColor" /> Free Hint
                    </button>
                  ) : (
                    <div className="bg-white dark:bg-zinc-800 px-4 py-2 rounded-xl border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] max-w-[280px]">
                      <p className="text-[11px] font-bold italic text-zinc-600 dark:text-zinc-300 text-center">
                        “{currentGame.hint}”
                      </p>
                    </div>
                  )}
                </div>
              )}
          </div>

          <div className="min-h-[220px]">
            {!isGameOver || isReviving ? (
              <div className="space-y-3 md:space-y-6">
                <VirtualKeyboard
                  guessedLetters={guessedLetters}
                  wordLetters={wordLetters}
                  onGuess={handleGuess}
                  disabled={isTransitioning || isReviving}
                />
                <div className="flex justify-center">
                  <button
                    onClick={handleShatter}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-zinc-900 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all group"
                  >
                    <Eraser
                      size={16}
                      className="text-zinc-400 group-hover:text-red-500 transition-colors"
                    />
                    <span className="text-[10px] font-black uppercase italic">
                      Shatter ({SHATTER_COST})
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <GameResults
                isWon={false}
                word={isRunEnded ? "Run Ended" : "Out of Fuel"}
                mode="endless"
                onRestart={handleRestart}
                streak={totalWordsSolved}
                xpEarned={totalXPEarned}
                coinsEarned={totalCoinsEarned}
                onRevive={handleRevive}
                onEndRun={() => setIsRunEnded(true)}
                isRunEnded={isRunEnded}
                revivesUsed={revivesUsed}
                reviveCost={REVIVE_COST}
                countdown={reviveCountdown}
              />
            )}
          </div>
        </div>
      </div>
      {isTransitioning && !isGameOver && (
        <GameTransitionOverlay
          duration={TRANSITION_MS}
          accent={playerRank.color}
        />
      )}
    </div>
  );
}
