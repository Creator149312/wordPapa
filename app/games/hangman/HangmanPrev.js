"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Card } from "@/components/ui/card";

// Components
import LevelUpModal from "./components/LevelUpModal";
import SaveProgressModal from "./components/SaveProgressModal";
import DynamicPapa from "./components/DynamicPapa";
import GameResults from "./components/GameResults";
import VirtualKeyboard from "./components/VirtualKeyboard";
import LevelBar from "./components/LevelBar";
import GameHeader from "./components/GameHeader";
import WordDisplay from "./components/WordDisplay";
import OnlineRaceTracker from "./components/OnlineRaceTracker";
import GameLobbyView from "./components/GameLobbyView";
import GameTransitionOverlay from "./components/GameTransitionOverlay";

// Hooks & Lib
import { useProfile } from "./../../ProfileContext";
import { useHangmanSocket } from "./hooks/useHangmanSocket";
import { useGameLogic } from "./hooks/useGameLogic";
import {
  calculateLevel,
  getClassicRewards,
  getOnlineMatchRewards,
  getArenaUnlockBonus,
} from "./lib/progression";

// Constants
import { RANKS, ARENAS } from "./constants";

const ONLINE_REQUIREMENTS = { MIN_XP: 0, MIN_COINS: 10 };
const LOSS_PENALTY_XP = -5;

export default function Hangman({
  initialMode = null,
  dailyWord = null,
  onDailyComplete = null,
}) {
  const {
    profile,
    applyClassicResult,
    showLevelUp,
    setShowLevelUp,
    deductCoins,
    applyOnlineResults,
    addDailyRewards,
    updateLocalProfile,
  } = useProfile();

  // --- UI & Game State ---
  const [gameMode, setGameMode] = useState(initialMode);
  const [gameState, setGameState] = useState(initialMode ? "playing" : "menu");
  const [hasClaimedResult, setHasClaimedResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [opponent, setOpponent] = useState(null);
  const [opponentWon, setOpponentWon] = useState(false);

  // sessionSnapshot persists accumulated gains for the current active streak
  const [sessionSnapshot, setSessionSnapshot] = useState({
    streak: 0,
    totalXP: 0,
    totalCoins: 0,
  });

  // --- Refs ---
  const syncLock = useRef(false);

  // --- Progression Helpers ---
  const currentRank = useMemo(() => {
    return (
      RANKS.find(
        (r) =>
          profile.xp >= r.minXP &&
          profile.xp < (RANKS[RANKS.indexOf(r) + 1]?.minXP || Infinity),
      ) || RANKS[0]
    );
  }, [profile.xp]);

  const activeArena = useMemo(
    () => ARENAS[currentRank.arenaId] || ARENAS[1],
    [currentRank],
  );

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
  } = useGameLogic(dailyWord, profile.xp);

  // --- Sync Logic ---
  const syncToDatabase = useCallback(
    async (updatedProfile) => {
      if (profile.isGhost) return;
      try {
        const response = await fetch("/api/game/hangman/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProfile),
        });
        const data = await response.json();
        if (data.success && updateLocalProfile) {
          updateLocalProfile(data.profile);
        }
      } catch (error) {
        console.error("DB Sync failed:", error);
      }
    },
    [profile.isGhost, updateLocalProfile],
  );

  // --- Socket Integration ---
  const { joinQueue, disconnect, sendGuess, emitFinished, socket } =
    useHangmanSocket({
      profile,
      initGameSession: (mode, data) => {
        initGameSession(mode, data);
        setHasClaimedResult(false);
        setOpponentWon(false);
        setTimeLeft(120);
        syncLock.current = false;
      },
      deductCoins,
      setOpponent,
      setGameState,
      setOpponentWon,
      applyOnlineResults,
      setHasClaimedResult,
    });

  // --- Win/Loss Conditionals ---
  const isTimeUp = gameMode === "online" && timeLeft <= 0;
  const myScore = correctGuessesCount;
  const oppScore = opponent?.progress || 0;

  const isWon = useMemo(() => {
    if (gameMode === "online") {
      return (logicIsWon && !opponentWon) || (isTimeUp && myScore > oppScore);
    }
    return logicIsWon;
  }, [gameMode, logicIsWon, opponentWon, isTimeUp, myScore, oppScore]);

  const isLost = useMemo(() => {
    const maxAllowed = currentRank.maxTries;
    if (gameMode === "online") {
      return (
        opponentWon ||
        wrongGuesses.length >= 6 ||
        (isTimeUp && myScore < oppScore)
      );
    }
    return wrongGuesses.length >= maxAllowed;
  }, [
    gameMode,
    opponentWon,
    wrongGuesses.length,
    currentRank.maxTries,
    isTimeUp,
    myScore,
    oppScore,
  ]);

  const isDraw =
    gameMode === "online" &&
    isTimeUp &&
    myScore === oppScore &&
    !logicIsWon &&
    !opponentWon;
  const isGameOver = isWon || isLost || isDraw;

  // --- Game Flow Handlers ---
  const startNewGame = useCallback(
    (resetToMenu = false) => {
      // Loophole fix: if user quits active classic game, it counts as a loss
      if (
        resetToMenu &&
        gameState === "playing" &&
        gameMode === "classic" &&
        !isGameOver
      ) {
        applyClassicResult(false);
      }

      if (resetToMenu) {
        disconnect();
        setGameMode(null);
        setGameState("menu");
        setOpponent(null);
        setSessionSnapshot({ streak: 0, totalXP: 0, totalCoins: 0 });
      } else {
        initGameSession(gameMode);
        setGameState("playing");
        setGuessedLetters([]);
        // Reset rewards snapshot if losing streak
        if (isLost && profile.currentStreak === 0) {
          setSessionSnapshot({ streak: 0, totalXP: 0, totalCoins: 0 });
        }
      }
      setHasClaimedResult(false);
      setShowSavePrompt(false);
      syncLock.current = false;
    },
    [
      gameMode,
      gameState,
      isGameOver,
      isLost,
      profile.currentStreak,
      initGameSession,
      disconnect,
      applyClassicResult,
      setGuessedLetters,
    ],
  );

  const handleModeSelect = (mode) => {
    if (mode === "classic" && profile.lives <= 0)
      return alert(`❤️ Out of lives!`);
    if (mode === "online") {
      if (profile.papaPoints < ONLINE_REQUIREMENTS.MIN_COINS)
        return alert(`💰 Not enough coins!`);
      setGameMode(mode);
      joinQueue();
      setGameState("lobby");
    } else {
      setGameMode(mode);
      initGameSession(mode);
      setGameState("playing");
    }
  };

  const handleGuess = useCallback(
    (letter) => {
      const L = letter.toUpperCase();
      if (
        guessedLetters.includes(L) ||
        isGameOver ||
        gameState !== "playing" ||
        isTransitioning
      )
        return;

      setGuessedLetters((prev) => [...prev, L]);

      if (gameMode === "online" && opponent?.roomId) {
        const tempGuesses = [...guessedLetters, L];
        const newScore = wordLetters.filter((l) =>
          tempGuesses.includes(l),
        ).length;
        sendGuess(opponent.roomId, L, newScore);
      }
    },
    [
      guessedLetters,
      isGameOver,
      gameState,
      wordLetters,
      gameMode,
      opponent,
      isTransitioning,
      setGuessedLetters,
      sendGuess,
    ],
  );

  // --- Outcome & Rewards Processor ---
  useEffect(() => {
    if (isGameOver && !hasClaimedResult && !syncLock.current) {
      syncLock.current = true;
      let updatedProfile = { ...profile };
      let earnedXP = 0;
      let earnedCoins = 0;
      let levelUpBonus = 0;
      let newStreak = 0;

      if (gameMode === "classic") {
        if (isWon) {
          const rewards = getClassicRewards(profile.currentStreak + 1);
          const streakBonus = Math.floor((profile.currentStreak + 1) / 5) * 2;
          earnedXP = rewards.xpGain + streakBonus;
          earnedCoins = rewards.coinGain;
          newStreak = profile.currentStreak + 1;
          setSessionSnapshot((prev) => ({
            streak: newStreak,
            totalXP: prev.totalXP + earnedXP,
            totalCoins: prev.totalCoins + earnedCoins,
          }));
          applyClassicResult(true);
        } else {
          earnedXP = profile.currentStreak > 0 ? 0 : LOSS_PENALTY_XP;
          newStreak = 0;
          setSessionSnapshot({ streak: 0, totalXP: earnedXP, totalCoins: 0 });
          updatedProfile.lives = Math.max(0, profile.lives - 1);
          updatedProfile.lastLifeLost = new Date();
          applyClassicResult(false);
          if (profile.isGhost) setTimeout(() => setShowSavePrompt(true), 1200);
        }
      } else if (gameMode === "online") {
        const onlineOutcome = getOnlineMatchRewards(
          isWon,
          profile.onlineWinStreak,
        );
        earnedXP = onlineOutcome.xpChange;
        earnedCoins = onlineOutcome.coinChange;
        newStreak = isWon ? profile.onlineWinStreak + 1 : 0;
        setSessionSnapshot({
          streak: newStreak,
          totalXP: earnedXP,
          totalCoins: earnedCoins,
        });
        applyOnlineResults(isWon);
        if (isWon && logicIsWon && opponent?.roomId)
          emitFinished(opponent.roomId, profile.name);
      } else if (gameMode === "daily" && isWon) {
        earnedXP = 50;
        earnedCoins = 20;
        newStreak = (profile.dailyStreak || 0) + 1;
        setSessionSnapshot({
          streak: newStreak,
          totalXP: earnedXP,
          totalCoins: earnedCoins,
        });
        updatedProfile.dailyStreak = newStreak;
        addDailyRewards(50, 20);
        onDailyComplete?.();
      }

      // Check for level up
      const oldLevel = calculateLevel(profile.xp).level;
      const newXPTotal = Math.max(0, profile.xp + earnedXP);
      const newLevel = calculateLevel(newXPTotal).level;

      if (newLevel > oldLevel) {
        for (let i = oldLevel + 1; i <= newLevel; i++)
          levelUpBonus += getArenaUnlockBonus(i);
        setSessionSnapshot((prev) => ({
          ...prev,
          totalCoins: prev.totalCoins + levelUpBonus,
        }));
      }

      updatedProfile = {
        ...updatedProfile,
        xp: newXPTotal,
        papaPoints: profile.papaPoints + earnedCoins + levelUpBonus,
        currentStreak:
          gameMode === "classic" ? newStreak : profile.currentStreak,
        highestStreak:
          gameMode === "classic"
            ? Math.max(profile.highestStreak, newStreak)
            : profile.highestStreak,
        onlineWinStreak:
          gameMode === "online" ? newStreak : profile.onlineWinStreak,
      };

      if (!profile.isGhost) syncToDatabase(updatedProfile);
      setHasClaimedResult(true);
    }
  }, [
    isGameOver,
    isWon,
    gameMode,
    hasClaimedResult,
    profile,
    applyClassicResult,
    applyOnlineResults,
    addDailyRewards,
    onDailyComplete,
    opponent,
    emitFinished,
    logicIsWon,
    syncToDatabase,
  ]);

  // --- Global Listeners ---
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key.match(/^[a-zA-Z]$/)) handleGuess(e.key);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleGuess]);

  useEffect(() => {
    if (gameMode !== "online" || isGameOver || gameState !== "playing") return;
    const timer = setInterval(
      () => setTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1)),
      1000,
    );
    return () => clearInterval(timer);
  }, [gameMode, isGameOver, gameState]);

  if (gameState === "menu" || gameState === "lobby") {
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
    <div className="min-h-screen p-1 md:p-4 bg-white dark:bg-zinc-950 transition-colors duration-500">
      <div className="max-w-5xl mx-auto mb-1 md:mb-2">
        <LevelBar />
      </div>

      <Card
        className={`max-w-5xl w-full mx-auto p-3 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-zinc-50/50 dark:bg-zinc-900/40 relative overflow-hidden transition-opacity duration-300 ${
          isTransitioning ? "opacity-40" : "opacity-100"
        }`}
      >
        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full -mr-24 -mt-24 blur-[80px] opacity-10 pointer-events-none"
          style={{ backgroundColor: currentRank.color }}
        />

        <div className="relative z-10 flex flex-col space-y-4 md:space-y-6">
          <GameHeader
            gameMode={gameMode}
            category={currentGame?.category}
            timeLeft={timeLeft}
            onQuit={() => startNewGame(true)}
            currentArena={activeArena}
            wrongCount={wrongGuesses.length}
            maxTries={currentRank.maxTries}
            streak={
              hasClaimedResult
                ? sessionSnapshot.streak
                : gameMode === "online"
                  ? profile.onlineWinStreak
                  : profile.currentStreak
            }
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">
            <div className="lg:col-span-8 flex flex-col space-y-4">
              <div className="py-3 flex justify-center bg-white/40 dark:bg-zinc-900/40 rounded-2xl">
                <WordDisplay
                  wordLetters={wordLetters}
                  guessedLetters={guessedLetters}
                  isLost={isLost}
                  isWon={isWon}
                />
              </div>

              <div className="min-h-[180px] md:min-h-[220px] flex flex-col justify-start">
                {!hasClaimedResult ? (
                  <VirtualKeyboard
                    guessedLetters={guessedLetters}
                    wordLetters={wordLetters}
                    onGuess={handleGuess}
                    disabled={isTransitioning}
                    rankColor={currentRank.color}
                    accentColor={activeArena.accent}
                  />
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
                    streak={
                      gameMode === "classic" &&
                      isLost &&
                      profile.currentStreak > 0
                        ? profile.currentStreak
                        : sessionSnapshot.streak
                    }
                    xpEarned={sessionSnapshot.totalXP}
                    coinsEarned={sessionSnapshot.totalCoins}
                    maxTries={currentRank.maxTries}
                  />
                )}
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center space-y-4">
              <div className="w-full max-w-[200px] lg:max-w-full">
                <DynamicPapa
                  wrongCount={wrongGuesses.length}
                  isWon={isWon}
                  isLost={isLost}
                  maxTries={currentRank.maxTries}
                  arenaId={currentRank.arenaId}
                  streak={
                    hasClaimedResult
                      ? sessionSnapshot.streak
                      : gameMode === "online"
                        ? profile.onlineWinStreak
                        : profile.currentStreak
                  }
                />
              </div>

              {gameMode === "online" && opponent && (
                <div className="w-full px-4 py-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-2xl backdrop-blur-sm">
                  <OnlineRaceTracker
                    myCount={correctGuessesCount}
                    oppCount={opponent.progress}
                    total={wordLetters.length}
                    oppName={opponent.name}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        {isTransitioning && <GameTransitionOverlay />}
      </Card>

      <LevelUpModal
        isOpen={showLevelUp}
        rank={currentRank}
        onClose={() => setShowLevelUp(false)}
      />
      <SaveProgressModal
        isOpen={showSavePrompt}
        onClose={() => setShowSavePrompt(false)}
        xp={profile.xp}
        points={profile.papaPoints}
      />
    </div>
  );
}

// "use client";
// import { useState, useEffect, useCallback, useMemo, useRef } from "react";
// import { Card } from "@/components/ui/card";

// // Components
// import LevelUpModal from "./components/LevelUpModal";
// import SaveProgressModal from "./components/SaveProgressModal";
// import DynamicPapa from "./components/DynamicPapa";
// import GameResults from "./components/GameResults";
// import VirtualKeyboard from "./components/VirtualKeyboard";
// import LevelBar from "./components/LevelBar";
// import GameHeader from "./components/GameHeader";
// import WordDisplay from "./components/WordDisplay";
// import OnlineRaceTracker from "./components/OnlineRaceTracker";
// import GameLobbyView from "./components/GameLobbyView";
// import GameTransitionOverlay from "./components/GameTransitionOverlay";

// // Hooks & Lib
// import { useProfile } from "./../../ProfileContext";
// import { useHangmanSocket } from "./hooks/useHangmanSocket";
// import { useGameLogic } from "./hooks/useGameLogic";
// import {
//   calculateLevel,
//   getClassicRewards,
//   getOnlineMatchRewards,
//   getArenaUnlockBonus,
// } from "./lib/progression";

// // Constants
// import { RANKS, ARENAS } from "./constants";

// const ONLINE_REQUIREMENTS = { MIN_XP: 0, MIN_COINS: 10 };
// const LOSS_PENALTY_XP = -5;

// export default function Hangman({
//   initialMode = null,
//   dailyWord = null,
//   onDailyComplete = null,
// }) {
//   const {
//     profile,
//     applyClassicResult,
//     showLevelUp,
//     setShowLevelUp,
//     deductCoins,
//     applyOnlineResults,
//     addDailyRewards,
//     updateLocalProfile,
//   } = useProfile();

//   const [gameMode, setGameMode] = useState(initialMode);
//   const [gameState, setGameState] = useState(initialMode ? "playing" : "menu");
//   const [hasClaimedResult, setHasClaimedResult] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(120);

//   const [sessionSnapshot, setSessionSnapshot] = useState({
//     streak: 0,
//     totalXP: 0,
//     totalCoins: 0,
//   });

//   const [showSavePrompt, setShowSavePrompt] = useState(false);
//   const [opponent, setOpponent] = useState(null);
//   const [opponentWon, setOpponentWon] = useState(false);
//   const syncLock = useRef(false);

//   const currentRank = useMemo(() => {
//     return (
//       RANKS.find(
//         (r) =>
//           profile.xp >= r.minXP &&
//           profile.xp < (RANKS[RANKS.indexOf(r) + 1]?.minXP || Infinity),
//       ) || RANKS[0]
//     );
//   }, [profile.xp]);

//   const activeArena = useMemo(
//     () => ARENAS[currentRank.arenaId] || ARENAS[1],
//     [currentRank],
//   );

//   const {
//     currentGame,
//     guessedLetters,
//     setGuessedLetters,
//     isTransitioning,
//     setIsTransitioning,
//     wordLetters,
//     wrongGuesses,
//     correctGuessesCount,
//     isLost: logicIsLost,
//     isWon: logicIsWon,
//     initGameSession,
//   } = useGameLogic(dailyWord, profile.xp);

//   const syncToDatabase = useCallback(
//     async (updatedProfile) => {
//       if (profile.isGhost) return;
//       try {
//         const response = await fetch("/api/game/hangman/sync", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(updatedProfile),
//         });
//         const data = await response.json();
//         if (data.success && updateLocalProfile) {
//           updateLocalProfile(data.profile);
//         }
//       } catch (error) {
//         console.error("DB Sync failed:", error);
//       }
//     },
//     [profile.isGhost, updateLocalProfile],
//   );

//   const { joinQueue, disconnect, sendGuess, emitFinished, socket } =
//     useHangmanSocket({
//       profile,
//       initGameSession: (mode, data) => {
//         initGameSession(mode, data);
//         setHasClaimedResult(false);
//         setOpponentWon(false);
//         setTimeLeft(120);
//         syncLock.current = false;
//       },
//       deductCoins,
//       setOpponent,
//       setGameState,
//       setOpponentWon,
//       applyOnlineResults,
//       setHasClaimedResult,
//     });

//   const isTimeUp = gameMode === "online" && timeLeft <= 0;
//   const myScore = correctGuessesCount;
//   const oppScore = opponent?.progress || 0;

//   const isWon = useMemo(() => {
//     if (gameMode === "online") {
//       return (logicIsWon && !opponentWon) || (isTimeUp && myScore > oppScore);
//     }
//     return logicIsWon;
//   }, [gameMode, logicIsWon, opponentWon, isTimeUp, myScore, oppScore]);

//   const isLost = useMemo(() => {
//     const maxAllowed = currentRank.maxTries;
//     if (gameMode === "online") {
//       return (
//         opponentWon ||
//         wrongGuesses.length >= 6 ||
//         (isTimeUp && myScore < oppScore)
//       );
//     }
//     return wrongGuesses.length >= maxAllowed;
//   }, [
//     gameMode,
//     opponentWon,
//     wrongGuesses.length,
//     currentRank.maxTries,
//     isTimeUp,
//     myScore,
//     oppScore,
//   ]);

//   const isDraw =
//     gameMode === "online" &&
//     isTimeUp &&
//     myScore === oppScore &&
//     !logicIsWon &&
//     !opponentWon;
//   const isGameOver = isWon || isLost || isDraw;

//   const startNewGame = useCallback(
//     (resetToMenu = false) => {
//       if (
//         resetToMenu &&
//         gameState === "playing" &&
//         gameMode === "classic" &&
//         !isGameOver
//       ) {
//         applyClassicResult(false);
//       }

//       if (resetToMenu) {
//         disconnect();
//         setGameMode(null);
//         setGameState("menu");
//         setOpponent(null);
//         setSessionSnapshot({ streak: 0, totalXP: 0, totalCoins: 0 });
//       } else {
//         initGameSession(gameMode);
//         setGameState("playing");
//         setGuessedLetters([]);
//         if (isLost && profile.currentStreak === 0) {
//           setSessionSnapshot({ streak: 0, totalXP: 0, totalCoins: 0 });
//         }
//       }
//       setHasClaimedResult(false);
//       setShowSavePrompt(false);
//       syncLock.current = false;
//     },
//     [
//       gameMode,
//       gameState,
//       isGameOver,
//       isLost,
//       profile.currentStreak,
//       initGameSession,
//       disconnect,
//       applyClassicResult,
//       setGuessedLetters,
//     ],
//   );

//   const handleModeSelect = (mode) => {
//     if (mode === "classic" && profile.lives <= 0)
//       return alert(`❤️ Out of lives!`);
//     if (mode === "online") {
//       if (profile.papaPoints < ONLINE_REQUIREMENTS.MIN_COINS)
//         return alert(`💰 Not enough coins!`);
//       setGameMode(mode);
//       joinQueue();
//       setGameState("lobby");
//     } else {
//       setGameMode(mode);
//       initGameSession(mode);
//       setGameState("playing");
//     }
//   };

//   const handleGuess = useCallback(
//     (letter) => {
//       const L = letter.toUpperCase();
//       if (
//         guessedLetters.includes(L) ||
//         isGameOver ||
//         gameState !== "playing" ||
//         isTransitioning
//       )
//         return;

//       setGuessedLetters((prev) => [...prev, L]);

//       if (gameMode === "online" && opponent?.roomId) {
//         const tempGuesses = [...guessedLetters, L];
//         const newScore = wordLetters.filter((l) =>
//           tempGuesses.includes(l),
//         ).length;
//         sendGuess(opponent.roomId, L, newScore);
//       }
//     },
//     [
//       guessedLetters,
//       isGameOver,
//       gameState,
//       wordLetters,
//       gameMode,
//       opponent,
//       isTransitioning,
//       setGuessedLetters,
//       sendGuess,
//     ],
//   );

//   useEffect(() => {
//     if (isGameOver && !hasClaimedResult && !syncLock.current) {
//       syncLock.current = true;
//       let updatedProfile = { ...profile };
//       let earnedXP = 0;
//       let earnedCoins = 0;
//       let levelUpBonus = 0;
//       let newStreak = 0;

//       if (gameMode === "classic") {
//         if (isWon) {
//           const rewards = getClassicRewards(profile.currentStreak + 1);
//           const streakBonus = Math.floor((profile.currentStreak + 1) / 5) * 2;
//           earnedXP = rewards.xpGain + streakBonus;
//           earnedCoins = rewards.coinGain;
//           newStreak = profile.currentStreak + 1;
//           setSessionSnapshot((prev) => ({
//             streak: newStreak,
//             totalXP: prev.totalXP + earnedXP,
//             totalCoins: prev.totalCoins + earnedCoins,
//           }));
//           applyClassicResult(true);
//         } else {
//           if (profile.currentStreak > 0) {
//             earnedXP = 0;
//             earnedCoins = 0;
//             newStreak = 0;
//           } else {
//             earnedXP = LOSS_PENALTY_XP;
//             earnedCoins = 0;
//             newStreak = 0;
//             setSessionSnapshot({ streak: 0, totalXP: earnedXP, totalCoins: 0 });
//           }
//           updatedProfile.lives = Math.max(0, profile.lives - 1);
//           updatedProfile.lastLifeLost = new Date();
//           applyClassicResult(false);
//           if (profile.isGhost) setTimeout(() => setShowSavePrompt(true), 1200);
//         }
//       } else if (gameMode === "online") {
//         const onlineOutcome = getOnlineMatchRewards(
//           isWon,
//           profile.onlineWinStreak,
//         );
//         earnedXP = onlineOutcome.xpChange;
//         earnedCoins = onlineOutcome.coinChange;
//         newStreak = isWon ? profile.onlineWinStreak + 1 : 0;
//         setSessionSnapshot({
//           streak: newStreak,
//           totalXP: earnedXP,
//           totalCoins: earnedCoins,
//         });
//         applyOnlineResults(isWon);
//         if (isWon && logicIsWon && opponent?.roomId)
//           emitFinished(opponent.roomId, profile.name);
//       } else if (gameMode === "daily" && isWon) {
//         earnedXP = 50;
//         earnedCoins = 20;
//         newStreak = (profile.dailyStreak || 0) + 1;
//         setSessionSnapshot({
//           streak: newStreak,
//           totalXP: earnedXP,
//           totalCoins: earnedCoins,
//         });
//         updatedProfile.dailyStreak = newStreak;
//         addDailyRewards(50, 20);
//         onDailyComplete?.();
//       }

//       const oldLevel = calculateLevel(profile.xp).level;
//       const newXPTotal = Math.max(0, profile.xp + earnedXP);
//       const newLevel = calculateLevel(newXPTotal).level;

//       if (newLevel > oldLevel) {
//         for (let i = oldLevel + 1; i <= newLevel; i++)
//           levelUpBonus += getArenaUnlockBonus(i);
//         setSessionSnapshot((prev) => ({
//           ...prev,
//           totalCoins: prev.totalCoins + levelUpBonus,
//         }));
//       }

//       updatedProfile = {
//         ...updatedProfile,
//         xp: newXPTotal,
//         papaPoints: profile.papaPoints + earnedCoins + levelUpBonus,
//         currentStreak:
//           gameMode === "classic" ? newStreak : profile.currentStreak,
//         highestStreak:
//           gameMode === "classic"
//             ? Math.max(profile.highestStreak, newStreak)
//             : profile.highestStreak,
//         onlineWinStreak:
//           gameMode === "online" ? newStreak : profile.onlineWinStreak,
//       };

//       if (!profile.isGhost) syncToDatabase(updatedProfile);
//       setHasClaimedResult(true);
//     }
//   }, [
//     isGameOver,
//     isWon,
//     gameMode,
//     hasClaimedResult,
//     profile,
//     applyClassicResult,
//     applyOnlineResults,
//     addDailyRewards,
//     onDailyComplete,
//     opponent,
//     emitFinished,
//     logicIsWon,
//     syncToDatabase,
//   ]);

//   useEffect(() => {
//     const onKeyDown = (e) => {
//       if (e.key.match(/^[a-zA-Z]$/)) handleGuess(e.key);
//     };
//     window.addEventListener("keydown", onKeyDown);
//     return () => window.removeEventListener("keydown", onKeyDown);
//   }, [handleGuess]);

//   useEffect(() => {
//     if (gameMode !== "online" || isGameOver || gameState !== "playing") return;
//     const timer = setInterval(
//       () => setTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1)),
//       1000,
//     );
//     return () => clearInterval(timer);
//   }, [gameMode, isGameOver, gameState]);

//   if (gameState === "menu" || gameState === "lobby") {
//     return (
//       <GameLobbyView
//         gameState={gameState}
//         handleModeSelect={handleModeSelect}
//         profile={profile}
//         requirements={ONLINE_REQUIREMENTS}
//         socket={socket}
//         startNewGame={startNewGame}
//       />
//     );
//   }

//   return (
//     <div className="min-h-screen p-1 md:p-4 bg-white dark:bg-zinc-950 transition-colors duration-500">
//       <div className="max-w-5xl mx-auto mb-1 md:mb-2">
//         <LevelBar />
//       </div>

//       <Card
//         className={`max-w-5xl w-full mx-auto p-3 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-zinc-50/50 dark:bg-zinc-900/40 relative overflow-hidden transition-opacity duration-300 ${
//           isTransitioning ? "opacity-40" : "opacity-100"
//         }`}
//       >
//         {/* Glow Effect */}
//         <div
//           className="absolute top-0 right-0 w-48 h-48 rounded-full -mr-24 -mt-24 blur-[80px] opacity-10 pointer-events-none"
//           style={{ backgroundColor: currentRank.color }}
//         />

//         <div className="relative z-10 flex flex-col space-y-4 md:space-y-6">
//           <GameHeader
//             gameMode={gameMode}
//             category={currentGame?.category}
//             timeLeft={timeLeft}
//             onQuit={() => startNewGame(true)}
//             currentArena={activeArena}
//             wrongCount={wrongGuesses.length}
//             maxTries={currentRank.maxTries}
//             streak={
//               hasClaimedResult
//                 ? sessionSnapshot.streak
//                 : gameMode === "online"
//                   ? profile.onlineWinStreak
//                   : profile.currentStreak
//             }
//           />

//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">
//             <div className="lg:col-span-8 flex flex-col space-y-4">
//               {/* Word Display Area */}
//               <div className="py-3 flex justify-center bg-white/40 dark:bg-zinc-900/40 rounded-2xl">
//                 <WordDisplay
//                   wordLetters={wordLetters}
//                   guessedLetters={guessedLetters}
//                   isLost={isLost}
//                   isWon={isWon}
//                 />
//               </div>

//               {/* Input/Result Area - Height optimized */}
//               <div className="min-h-[180px] md:min-h-[220px] flex flex-col justify-start">
//                 {!hasClaimedResult ? (
//                   <VirtualKeyboard
//                     guessedLetters={guessedLetters}
//                     wordLetters={wordLetters}
//                     onGuess={handleGuess}
//                     disabled={isTransitioning}
//                     rankColor={currentRank.color}
//                     accentColor={activeArena.accent}
//                   />
//                 ) : (
//                   <GameResults
//                     isWon={isWon}
//                     word={currentGame?.word}
//                     category={currentGame?.category}
//                     guessedLetters={guessedLetters}
//                     mode={gameMode}
//                     onRestart={() => startNewGame(false)}
//                     myScore={correctGuessesCount}
//                     oppScore={opponent?.progress || 0}
//                     oppName={opponent?.name}
//                     streak={
//                       gameMode === "classic" &&
//                       isLost &&
//                       profile.currentStreak > 0
//                         ? profile.currentStreak
//                         : sessionSnapshot.streak
//                     }
//                     xpEarned={sessionSnapshot.totalXP}
//                     coinsEarned={sessionSnapshot.totalCoins}
//                     maxTries={currentRank.maxTries}
//                   />
//                 )}
//               </div>
//             </div>

//             {/* Sidebar/Character Area */}
//             <div className="lg:col-span-4 flex flex-col items-center space-y-4">
//               <div className="w-full max-w-[200px] lg:max-w-full">
//                 <DynamicPapa
//                   wrongCount={wrongGuesses.length}
//                   isWon={isWon}
//                   isLost={isLost}
//                   maxTries={currentRank.maxTries}
//                   arenaId={currentRank.arenaId}
//                   streak={
//                     hasClaimedResult
//                       ? sessionSnapshot.streak
//                       : gameMode === "online"
//                         ? profile.onlineWinStreak
//                         : profile.currentStreak
//                   }
//                 />
//               </div>

//               {gameMode === "online" && opponent && (
//                 <div className="w-full px-4 py-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-2xl backdrop-blur-sm">
//                   <OnlineRaceTracker
//                     myCount={correctGuessesCount}
//                     oppCount={opponent.progress}
//                     total={wordLetters.length}
//                     oppName={opponent.name}
//                   />
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//         {isTransitioning && <GameTransitionOverlay />}
//       </Card>

//       {/* Modals */}
//       <LevelUpModal
//         isOpen={showLevelUp}
//         rank={currentRank}
//         onClose={() => setShowLevelUp(false)}
//       />
//       <SaveProgressModal
//         isOpen={showSavePrompt}
//         onClose={() => setShowSavePrompt(false)}
//         xp={profile.xp}
//         points={profile.papaPoints}
//       />
//     </div>
//   );
// }
