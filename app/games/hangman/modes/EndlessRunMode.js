"use client";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Lightbulb, Eraser, Activity } from "lucide-react";
import { motion } from "framer-motion";

// UI Components
import GameHeader from "../components/GameHeader";
import WordDisplay from "../components/WordDisplay";
import VirtualKeyboard from "../components/VirtualKeyboard";
import GameResults from "../components/GameResults";
import DynamicPapa from "../components/DynamicPapa";
import MilestoneBanner from "../components/MilestoneBanner";
import SessionProgress from "../components/SessionProgress";
import LevelUpModal from "../components/LevelUpModal";

// Hooks, Constants
import { useGameLogic } from "../hooks/useGameLogic";
import { useAudio } from "../hooks/useAudio";
import { RANKS, WORDS_POOL } from "../constants";
import { calculateLevel } from "../lib/progression";

export default function EndlessRunMode({
  profile,
  onQuit,
  syncToDatabase,
  triggerSavePrompt,
  applyEndlessResult,
  deductCoins,
}) {
  // --- 1. GAME STATE ---
  const [globalMistakes, setGlobalMistakes] = useState(0);
  const [totalWordsSolved, setTotalWordsSolved] = useState(0);
  const [totalXPEarned, setTotalXPEarned] = useState(0);
  const [totalCoinsEarned, setTotalCoinsEarned] = useState(0);
  const [usedWordTexts, setUsedWordTexts] = useState([]);
  const [hasClaimedResult, setHasClaimedResult] = useState(false);

  const [nextMilestone, setNextMilestone] = useState(5);
  const [milestoneStep, setMilestoneStep] = useState(6);

  // Juice States
  const [currentWordXP, setCurrentWordXP] = useState(0);
  // NEW: Track the coin gain for the specific word animation
  const [currentWordCoins, setCurrentWordCoins] = useState(0);
  const [isShaking, setIsShaking] = useState(false);

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [sessionMaxRankLevel, setSessionMaxRankLevel] = useState(
    calculateLevel(profile.highestEndlessXP || 0).level,
  );

  // --- 2. LIVE CURRENCY CALCULATION ---
  // This ensures the GameHeader shows: (Original Points - Spent) + Earned
  const livePapaPoints = useMemo(() => {
    return (profile.papaPoints || 0) + totalCoinsEarned;
  }, [profile.papaPoints, totalCoinsEarned]);

  // --- 3. WORD SELECTION LOGIC ---
  const getNextWeightedWord = useCallback(
    (userLevel, usedWords = []) => {
      const effectiveXP = Math.max(
        profile.highestEndlessXP || 0,
        totalXPEarned,
      );
      const maxUnlockedRank =
        [...RANKS].reverse().find((r) => effectiveXP >= r.minXP) || RANKS[0];
      const safeLevel = Math.max(1, Math.min(userLevel, maxUnlockedRank.level));

      let levelPickerPool = [];
      for (let lvl = 1; lvl <= safeLevel; lvl++) {
        for (let i = 0; i < lvl; i++) {
          levelPickerPool.push(lvl);
        }
      }

      const selectedLevel =
        levelPickerPool[Math.floor(Math.random() * levelPickerPool.length)];
      let levelWords = WORDS_POOL[selectedLevel] || WORDS_POOL[1];

      let availableWords = levelWords.filter(
        (item) => !usedWords.includes(item.word),
      );
      if (availableWords.length === 0) availableWords = levelWords;

      const chosenEntry =
        availableWords[Math.floor(Math.random() * availableWords.length)];
      return { ...chosenEntry, wordLevel: selectedLevel };
    },
    [profile.highestEndlessXP, totalXPEarned],
  );

  const initialRank = useMemo(() => {
    return calculateLevel(profile.highestEndlessXP || 0);
  }, [profile.highestEndlessXP]);

  // --- 4. PROGRESSIVE SYNC ---
  const syncProgressToLocal = useCallback(() => {
    const snapshot = {
      xp: (profile.xp || 0) + totalXPEarned,
      totalWordsSolved: (profile.totalWordsSolved || 0) + totalWordsSolved,
      papaPoints: livePapaPoints, // Use the live calculated value
      highestEndlessRun: Math.max(
        profile.highestEndlessRun || 0,
        totalWordsSolved,
      ),
      highestEndlessXP: Math.max(profile.highestEndlessXP || 0, totalXPEarned),
    };
    applyEndlessResult(snapshot);
  }, [
    totalWordsSolved,
    totalXPEarned,
    livePapaPoints,
    profile,
    applyEndlessResult,
  ]);

  // --- 5. CONSTANTS & UI STATES ---
  const [isRefilling, setIsRefilling] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [showMentorMsg, setShowMentorMsg] = useState(false);
  const [hintRevealed, setHintRevealed] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [isReviving, setIsReviving] = useState(false);
  const [isRunEnded, setIsRunEnded] = useState(false);
  const [revivesUsed, setRevivesUsed] = useState(0);
  const [reviveCountdown, setReviveCountdown] = useState(null);

  const { playSynth } = useAudio();
  const MAX_GLOBAL_LIVES = 5;
  const REVIVE_COST = 50;
  const SHATTER_COST = 15;
  const TRANSITION_MS = 1500;
  const REVIVE_WINDOW_SECONDS = 6;

  const syncLock = useRef(false);
  const prevWrongCount = useRef(0);
  const transitionLock = useRef(false);
  const isShatteringInternal = useRef(false);

  // --- 6. RANK LOGIC ---
  const sessionRank = useMemo(() => {
    return (
      [...RANKS].reverse().find((r) => totalXPEarned >= r.minXP) || RANKS[0]
    );
  }, [totalXPEarned]);

  const currentLevel = Math.min(
    (initialRank.level || 1) + Math.floor(totalWordsSolved / 5),
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
  } = useGameLogic(null, profile.xp || 0, profile.highestEndlessXP || 0);

  const xpPercent = useMemo(() => {
    const previousBest = profile.highestEndlessXP || 0;
    if (previousBest === 0) return totalXPEarned > 0 ? 100 : 0;
    return Math.min((totalXPEarned / previousBest) * 100, 100);
  }, [totalXPEarned, profile.highestEndlessXP]);

  const isBreakingXPRecord = useMemo(() => {
    return totalXPEarned > (profile.highestEndlessXP || 0) && totalXPEarned > 0;
  }, [totalXPEarned, profile.highestEndlessXP]);

  // --- 7. TIMERS & INIT ---
  useEffect(() => {
    if (!currentGame && !hasClaimedResult) {
      const firstWord = getNextWeightedWord(currentLevel, []);
      setUsedWordTexts([firstWord.word]);
      initGameSession("endless", firstWord);
    }
    setSecondsElapsed(0);
    setHintRevealed(false);

    const timer = setInterval(
      () => setSecondsElapsed((prev) => prev + 1),
      1000,
    );
    return () => clearInterval(timer);
  }, [
    currentGame,
    initGameSession,
    hasClaimedResult,
    currentLevel,
    getNextWeightedWord,
  ]);

  // --- 8. MILESTONE & LEVEL UP ---
  useEffect(() => {
    if (totalWordsSolved > 0 && totalWordsSolved === nextMilestone) {
      setIsRefilling(true);
      setGlobalMistakes(0);
      playSynth("REFILL");
      syncProgressToLocal();
      setNextMilestone((prev) => prev + milestoneStep);
      setMilestoneStep((prev) => prev + 1);
      setShowMilestone(true);
      setTimeout(() => setShowMilestone(false), 5000);
      setTimeout(() => setIsRefilling(false), 3000);
    }

    if (sessionRank.level > sessionMaxRankLevel) {
      if (sessionRank.level > 1) {
        setShowLevelUp(true);
        playSynth("MILESTONE");
        syncProgressToLocal();
      }
      setSessionMaxRankLevel(sessionRank.level);
    }
  }, [
    totalWordsSolved,
    sessionRank.level,
    sessionMaxRankLevel,
    syncProgressToLocal,
    playSynth,
    nextMilestone,
    milestoneStep,
  ]);

  // --- 9. MISTAKES ---
  useEffect(() => {
    if (wrongGuesses.length > prevWrongCount.current) {
      const delta = wrongGuesses.length - prevWrongCount.current;
      if (!isShatteringInternal.current) {
        setGlobalMistakes((prev) => prev + delta);
        playSynth("POP");
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 400);
      }
      prevWrongCount.current = wrongGuesses.length;
    }
  }, [wrongGuesses, playSynth]);

  useEffect(() => {
    prevWrongCount.current = 0;
  }, [currentGame]);

  const isGameOver = globalMistakes >= MAX_GLOBAL_LIVES;

  useEffect(() => {
    let timer;
    if (isGameOver && !isReviving && !isRunEnded && !hasClaimedResult) {
      if (reviveCountdown === null) setReviveCountdown(REVIVE_WINDOW_SECONDS);
      if (reviveCountdown > 0) {
        timer = setInterval(() => setReviveCountdown((prev) => prev - 1), 1000);
      } else if (reviveCountdown === 0) {
        setIsRunEnded(true);
        setReviveCountdown(null);
      }
    } else {
      if (reviveCountdown !== null) setReviveCountdown(null);
    }
    return () => clearInterval(timer);
  }, [isGameOver, isReviving, isRunEnded, reviveCountdown, hasClaimedResult]);

  // --- 10. ACTIONS ---
  const handleShatter = () => {
    if (livePapaPoints < SHATTER_COST) return; // Use live points check
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
    if (livePapaPoints >= REVIVE_COST) {
      const success = deductCoins(REVIVE_COST);
      if (success) {
        setReviveCountdown(null);
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

  // --- 11. WIN & JUICE LOGIC ---
  useEffect(() => {
    if (isWon && !isGameOver && !transitionLock.current) {
      transitionLock.current = true;

      const wordLevel = currentGame?.wordLevel || 1;
      const xpGain = (currentGame?.word?.length || 0) * 10 + wordLevel * 15;
      const coinGain = Math.ceil(xpGain / 10);

      // Trigger animations
      setCurrentWordXP(xpGain);
      setCurrentWordCoins(coinGain);

      setTotalWordsSolved((prev) => prev + 1);
      setTotalXPEarned((x) => x + xpGain);
      setTotalCoinsEarned((c) => c + coinGain);

      setIsTransitioning(true);
      const nextWordEntry = getNextWeightedWord(currentLevel, usedWordTexts);
      setUsedWordTexts((prev) => [...prev, nextWordEntry.word]);

      setTimeout(() => setGuessedLetters([]), 500);
      setTimeout(() => initGameSession("endless", nextWordEntry), 900);
      setTimeout(() => {
        setIsTransitioning(false);
        transitionLock.current = false;
      }, TRANSITION_MS);
    }
  }, [
    isWon,
    isGameOver,
    currentGame,
    currentLevel,
    usedWordTexts,
    getNextWeightedWord,
    initGameSession,
    setIsTransitioning,
    setGuessedLetters,
  ]);

  // --- 12. FINAL SYNC ---
  useEffect(() => {
    const shouldSync =
      isRunEnded || (isGameOver && !isReviving && reviveCountdown === 0);
    if (shouldSync && !hasClaimedResult && !syncLock.current) {
      syncLock.current = true;
      const snapshot = {
        xp: (profile.xp || 0) + totalXPEarned,
        totalWordsSolved: (profile.totalWordsSolved || 0) + totalWordsSolved,
        papaPoints: livePapaPoints,
        highestEndlessRun: Math.max(
          profile.highestEndlessRun || 0,
          totalWordsSolved,
        ),
        highestEndlessXP: Math.max(
          profile.highestEndlessXP || 0,
          totalXPEarned,
        ),
      };
      applyEndlessResult(snapshot);
      if (!profile.isGhost && syncToDatabase) syncToDatabase(snapshot);
      setHasClaimedResult(true);
      if (profile.isGhost && triggerSavePrompt)
        setTimeout(() => triggerSavePrompt(), 1500);
    }
  }, [
    isRunEnded,
    isGameOver,
    isReviving,
    reviveCountdown,
    hasClaimedResult,
    totalXPEarned,
    livePapaPoints,
    totalWordsSolved,
    profile,
    syncToDatabase,
    applyEndlessResult,
    triggerSavePrompt,
  ]);

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
    setSessionMaxRankLevel(initialRank.level);
    setNextMilestone(5);
    setMilestoneStep(6);
    syncLock.current = false;
    transitionLock.current = false;
    initGameSession("endless");
  }, [initGameSession, setGuessedLetters, initialRank.level]);

  return (
    <div className="flex flex-col space-y-1 md:space-y-2 relative w-full max-w-5xl mx-auto px-2 md:px-0 pb-5 md:pb-10">
      <SessionProgress
        totalXPEarned={totalXPEarned}
        xpPercent={xpPercent}
        isBreakingXPRecord={isBreakingXPRecord}
        isRefilling={isRefilling}
        highestXP={profile.highestEndlessXP}
        accent={sessionRank.color}
      />

      <GameHeader
        gameMode="endless"
        category={currentGame?.category || "Loading..."}
        onQuit={onQuit}
        playerRank={sessionRank}
        wrongCount={globalMistakes}
        maxTries={MAX_GLOBAL_LIVES}
        streak={totalWordsSolved}
        papaPoints={livePapaPoints} // LIVE UPDATE PASSED HERE
      />

      {showMilestone && (
        <MilestoneBanner
          streak={totalWordsSolved}
          stageName={sessionRank.name}
          currentXP={totalXPEarned}
        />
      )}

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-center lg:items-start justify-center">
        <div className="w-full lg:w-1/3 flex justify-center order-1">
          <DynamicPapa
            errors={globalMistakes}
            maxErrors={MAX_GLOBAL_LIVES}
            isWinner={isWon}
            accent={sessionRank.color}
            secondsElapsed={secondsElapsed}
            showMentorMsg={showMentorMsg}
            currentRankName={sessionRank.name}
            streak={totalWordsSolved}
          />
        </div>

        <motion.div
          animate={
            isShaking
              ? {
                  x: [-6, 6, -6, 6, 0],
                  backgroundColor: [
                    "rgba(239, 68, 68, 0)",
                    "rgba(239, 68, 68, 0.2)",
                    "rgba(239, 68, 68, 0)",
                  ],
                }
              : {}
          }
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="w-full lg:w-2/3 flex flex-col space-y-3 md:space-y-6 order-2 rounded-3xl"
        >
          <div className="py-1 md:py-2 flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-900/40 rounded-2xl md:rounded-3xl min-h-[140px] md:min-h-[180px] relative overflow-visible border-2 border-dashed border-zinc-200 dark:border-zinc-800">
            <div className="absolute top-2 left-3 flex items-center gap-1 opacity-40">
              <Activity size={10} style={{ color: sessionRank.color }} />
              <span className="text-[9px] font-bold uppercase tracking-widest">
                Stage {currentLevel}
              </span>
            </div>

            <WordDisplay
              wordLetters={wordLetters}
              guessedLetters={guessedLetters}
              isLost={isRunEnded || (isGameOver && !isReviving)}
              isWon={isWon}
              wrongCount={globalMistakes}
              xpGained={currentWordXP}
              coinsGained={currentWordCoins} // PASSED PROP FOR ANIMATION
              accent={sessionRank.color}
            />

            {(wrongGuesses.length >= 2 || secondsElapsed >= 10) &&
              currentGame?.hint && (
                <div className="mt-1 md:mt-2 flex flex-col items-center">
                  {!hintRevealed ? (
                    <button
                      onClick={handleRevealHint}
                      className="flex items-center gap-2 px-4 py-1 bg-yellow-400 text-black rounded-full font-black text-[10px] uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all"
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
                    disabled={livePapaPoints < SHATTER_COST}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-zinc-900 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all group disabled:opacity-50 disabled:grayscale"
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
        </motion.div>
      </div>

      <LevelUpModal
        isOpen={showLevelUp}
        rank={sessionRank}
        onClose={() => setShowLevelUp(false)}
      />
    </div>
  );
}
