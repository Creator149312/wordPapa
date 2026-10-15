"use client";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";

// Shared Components
import GameHeader from "../components/GameHeader";
import WordDisplay from "../components/WordDisplay";
import VirtualKeyboard from "../components/VirtualKeyboard";
import GameResults from "../components/GameResults";
import OnlineRaceTracker from "../components/OnlineRaceTracker";
import DynamicPapa from "../components/DynamicPapa";
import GameTransitionOverlay from "../components/GameTransitionOverlay";

// Clash Royale 1v1 Components
import ElixirBar from "../components/ElixirBar";
import SpellDeck from "../components/SpellDeck";
import ClashCombatFeedback from "../components/ClashCombatFeedback";

// Hooks & Lib
import { useHangmanSocket } from "../hooks/useHangmanSocket";
import { useGameLogic } from "../hooks/useGameLogic";
import { useAudio } from "../hooks/useAudio";
import { getOnlineMatchRewards, calculateLevel, applyTrophyFloor } from "../lib/progression";
import { RANKS, ARENAS } from "../constants";

const RARE_BOUNTY_LETTERS = ["J", "Q", "X", "Z", "K", "V", "W", "B", "P"];

export default function OnlineMode({ profile, onQuit, applyOnlineResults, syncToDatabase }) {
  const { playSynth } = useAudio();
  const [hasClaimedResult, setHasClaimedResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [opponent, setOpponent] = useState(null);
  const [opponentWon, setOpponentWon] = useState(false);
  const [gameState, setGameState] = useState("playing");

  // --- Clash Royale Elixir & Combat State ---
  const [elixir, setElixir] = useState(5.0); // Starts at 5, max 10
  const [isElixirShaking, setIsElixirShaking] = useState(false);
  const [hasShield, setHasShield] = useState(false);
  const [shieldedWrongLetters, setShieldedWrongLetters] = useState([]);
  const [isFrozen, setIsFrozen] = useState(false);
  const [freezeRemaining, setFreezeRemaining] = useState(0);
  const [isScrambled, setIsScrambled] = useState(false);
  const [scrambleRemaining, setScrambleRemaining] = useState(0);
  const [combatAlert, setCombatAlert] = useState(null);
  const [spellCooldowns, setSpellCooldowns] = useState({});
  const [spellsCastCount, setSpellsCastCount] = useState(0);

  // Opponent Live Combat State
  const [oppShield, setOppShield] = useState(false);
  const [oppFrozen, setOppFrozen] = useState(false);
  const [oppWrongCount, setOppWrongCount] = useState(0);

  const [sessionSnapshot, setSessionSnapshot] = useState({
    streak: 0,
    totalXP: 0,
    totalCoins: 0,
  });

  const syncLock = useRef(false);
  const alertTimeoutRef = useRef(null);

  // Helper to trigger floating combat alerts
  const showCombatAlert = useCallback((type, text) => {
    if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    setCombatAlert({ type, text });
    alertTimeoutRef.current = setTimeout(() => {
      setCombatAlert(null);
    }, 2200);
  }, []);

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
    wrongGuesses: rawWrongGuesses,
    correctGuessesCount,
    isLost: logicIsLost,
    isWon: logicIsWon,
    initGameSession,
  } = useGameLogic(null, profile.xp);

  // Wrong guesses excluding those absorbed by shield
  const wrongGuesses = useMemo(() => {
    return rawWrongGuesses.filter(l => !shieldedWrongLetters.includes(l));
  }, [rawWrongGuesses, shieldedWrongLetters]);

  // Combined guessed letters for keyboard rendering
  const allGuessedLetters = useMemo(() => {
    return Array.from(new Set([...guessedLetters, ...shieldedWrongLetters]));
  }, [guessedLetters, shieldedWrongLetters]);

  // Handle incoming spells from opponent
  const handleOpponentSpell = useCallback((data) => {
    if (data.spellId === "freeze") {
      setHasShield((currentShield) => {
        if (currentShield) {
          playSynth("SHIELD_BLOCK");
          showCombatAlert("shield_block", "Shield Blocked Opponent's Freeze!");
          return false;
        } else {
          playSynth("FREEZE");
          setIsFrozen(true);
          setFreezeRemaining(3.0);
          showCombatAlert("freeze", "Frozen by Opponent for 3s!");
          return false;
        }
      });
    } else if (data.spellId === "scramble") {
      setHasShield((currentShield) => {
        if (currentShield) {
          playSynth("SHIELD_BLOCK");
          showCombatAlert("shield_block", "Shield Blocked Opponent's Ink!");
          return false;
        } else {
          playSynth("SCRAMBLE");
          setIsScrambled(true);
          setScrambleRemaining(4.0);
          showCombatAlert("scramble", "Opponent Inked Your Board!");
          return false;
        }
      });
    }
  }, [playSynth, showCombatAlert]);

  // --- Socket Integration ---
  const {
    disconnect,
    sendGuess,
    emitFinished,
    castSpell: emitSpell,
    sendShieldState,
    sendWrongCount,
  } = useHangmanSocket({
    profile,
    initGameSession: (mode, data) => {
      initGameSession("online", data);
      setHasClaimedResult(false);
      setOpponentWon(false);
      setTimeLeft(120);
      setElixir(5.0);
      setHasShield(false);
      setShieldedWrongLetters([]);
      setIsFrozen(false);
      setFreezeRemaining(0);
      setIsScrambled(false);
      setScrambleRemaining(0);
      setOppShield(false);
      setOppFrozen(false);
      setOppWrongCount(0);
      syncLock.current = false;
    },
    setOpponent,
    setGameState,
    setOpponentWon,
    applyOnlineResults,
    setHasClaimedResult,
    onOpponentSpell: handleOpponentSpell,
    onOpponentShield: (active) => setOppShield(active),
    onOpponentWrongCount: (count) => setOppWrongCount(count),
  });

  // Sudden Death (2X Elixir) when 30 seconds remain
  const isSuddenDeath = timeLeft <= 30 && timeLeft > 0;

  // --- 1. Real-time Elixir & Spell Tick Loop ---
  useEffect(() => {
    if (gameState !== "playing" || timeLeft <= 0) return;

    const interval = setInterval(() => {
      // Elixir generation rate:
      // Normal: 1 Elixir per 1.5s = 0.0667 per 100ms
      // Sudden Death (2X): 1 Elixir per 0.75s = 0.1333 per 100ms
      const rate = isSuddenDeath ? 0.1333 : 0.0667;
      setElixir((prev) => Math.min(10.0, prev + rate));

      // Decrement freeze duration
      setFreezeRemaining((prev) => {
        if (prev <= 0.1) {
          if (isFrozen) {
            setIsFrozen(false);
            playSynth("POP");
          }
          return 0;
        }
        return prev - 0.1;
      });

      // Decrement scramble duration
      setScrambleRemaining((prev) => {
        if (prev <= 0.1) {
          if (isScrambled) setIsScrambled(false);
          return 0;
        }
        return prev - 0.1;
      });

      // Decrement spell cooldowns
      setSpellCooldowns((prev) => {
        const next = { ...prev };
        let hasChanges = false;
        for (const [key, val] of Object.entries(next)) {
          if (val > 0) {
            next[key] = Math.max(0, val - 0.1);
            hasChanges = true;
          }
        }
        return hasChanges ? next : prev;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [gameState, isSuddenDeath, isFrozen, isScrambled, timeLeft, playSynth]);

  // Sync shield state changes with opponent
  useEffect(() => {
    if (opponent?.roomId) {
      sendShieldState(opponent.roomId, hasShield);
    }
  }, [hasShield, opponent?.roomId, sendShieldState]);

  // Sync wrong guesses count with opponent
  useEffect(() => {
    if (opponent?.roomId) {
      sendWrongCount(opponent.roomId, wrongGuesses.length);
    }
  }, [wrongGuesses.length, opponent?.roomId, sendWrongCount]);

  // --- 2. Smart Bot Simulation (When opponent is AI) ---
  const isOpponentBot = useMemo(() => {
    if (!opponent?.name) return false;
    return (
      opponent.isBot ||
      opponent.roomId?.startsWith("duel_bot_") ||
      ["Scholar", "Student", "Sage", "Rival", "Apprentice", "Bot"].some((prefix) =>
        opponent.name.startsWith(prefix)
      )
    );
  }, [opponent]);

  useEffect(() => {
    if (!isOpponentBot || !currentGame || gameState !== "playing") return;

    let botElixir = 5.0;
    const botInterval = setInterval(() => {
      // Bot regenerates Elixir
      botElixir = Math.min(10.0, botElixir + 0.8);

      // If bot is frozen, it skips actions
      if (oppFrozen) return;

      // Bot tactical spell casting
      if (botElixir >= 3 && Math.random() < 0.25) {
        const spells = ["freeze", "shield", "scramble"];
        const chosen = spells[Math.floor(Math.random() * spells.length)];
        botElixir -= 3;

        if (chosen === "shield") {
          setOppShield(true);
        } else {
          handleOpponentSpell({ spellId: chosen });
        }
        return;
      }

      // Bot letter guessing
      if (botElixir >= 2 && Math.random() < 0.45) {
        botElixir -= 2;
        const targetWord = currentGame.word?.toUpperCase() || "";
        const isHit = Math.random() < 0.72; // 72% accuracy

        if (isHit) {
          botElixir += 1; // Bot Elixir rebate
          setOpponent((prev) => {
            if (!prev) return null;
            const newProgress = Math.min(targetWord.length, (prev.progress || 0) + 1);
            if (newProgress >= targetWord.length) {
              setOpponentWon(true);
            }
            return { ...prev, progress: newProgress };
          });
        } else {
          // Bot made a wrong guess
          setOppShield((currentShield) => {
            if (currentShield) {
              // Shield absorbs bot mistake!
              return false;
            } else {
              setOppWrongCount((w) => {
                const nextW = w + 1;
                if (nextW >= 6) {
                  // Bot loses from errors
                }
                return nextW;
              });
              return false;
            }
          });
        }
      }
    }, 1800);

    return () => clearInterval(botInterval);
  }, [isOpponentBot, currentGame, gameState, oppFrozen, handleOpponentSpell]);

  // --- 3. Win/Loss Logic ---
  const isTimeUp = timeLeft <= 0;
  const myScore = correctGuessesCount;
  const oppScore = opponent?.progress || 0;
  const oppLostByErrors = oppWrongCount >= 6;

  const isWon = useMemo(() => 
    (logicIsWon && !opponentWon) ||
    oppLostByErrors ||
    (isTimeUp && myScore > oppScore), 
  [logicIsWon, opponentWon, oppLostByErrors, isTimeUp, myScore, oppScore]);

  const isLost = useMemo(() => 
    opponentWon ||
    wrongGuesses.length >= 6 ||
    (isTimeUp && myScore < oppScore), 
  [opponentWon, wrongGuesses.length, isTimeUp, myScore, oppScore]);

  const isDraw = isTimeUp && myScore === oppScore && !logicIsWon && !opponentWon && !oppLostByErrors;
  const isGameOver = isWon || isLost || isDraw;

  // --- 4. Letter Guess Handler (Costs 2 Elixir) ---
  const handleGuess = (letter) => {
    const L = letter.toUpperCase();
    if (allGuessedLetters.includes(L) || isGameOver || isTransitioning) return;

    // Check if player is frozen
    if (isFrozen) {
      playSynth("FREEZE");
      showCombatAlert("freeze", "Cannot Guess While Frozen!");
      return;
    }

    // Check Elixir Cost (2 Elixir per guess)
    const GUESS_COST = 2.0;
    if (elixir < GUESS_COST) {
      playSynth("ELIXIR_EMPTY");
      setIsElixirShaking(true);
      setTimeout(() => setIsElixirShaking(false), 400);
      showCombatAlert("insufficient", "Need 2 Elixir to Guess!");
      return;
    }

    // Consume Elixir
    setElixir((prev) => Math.max(0, prev - GUESS_COST));

    const isCorrect = wordLetters.includes(L);

    if (isCorrect) {
      playSynth("CORRECT");
      setGuessedLetters((prev) => [...prev, L]);

      // Vowel vs Bounty Consonant Rebate:
      // High-risk/rare letters award a +2 Elixir bounty! Standard letters return +1.
      const isBounty = RARE_BOUNTY_LETTERS.includes(L);
      if (isBounty) {
        setElixir((prev) => Math.min(10.0, prev + 2.0));
        showCombatAlert("bounty", `Bounty Hit! +2 Elixir!`);
      } else {
        setElixir((prev) => Math.min(10.0, prev + 1.0));
      }

      if (opponent?.roomId) {
        const newScore = wordLetters.filter((l) => [...guessedLetters, L].includes(l)).length;
        sendGuess(opponent.roomId, L, newScore);
      }
    } else {
      // Wrong guess
      if (hasShield) {
        // Shield absorbs the mistake! Papa takes 0 damage!
        playSynth("SHIELD_BLOCK");
        setHasShield(false);
        setShieldedWrongLetters((prev) => [...prev, L]);
        showCombatAlert("shield_block", "Shield Absorbed Wrong Guess!");
      } else {
        // Regular wrong guess penalty
        playSynth("POP");
        setGuessedLetters((prev) => [...prev, L]);
      }
    }
  };

  // --- 5. Clash Royale Spell Casting ---
  const handleCastSpell = (spellId, cost) => {
    if (elixir < cost || isFrozen || isGameOver) return;

    // Deduct Elixir
    setElixir((prev) => Math.max(0, prev - cost));
    setSpellsCastCount((c) => c + 1);

    if (spellId === "freeze") {
      playSynth("FREEZE");
      setSpellCooldowns((prev) => ({ ...prev, freeze: 5 }));
      showCombatAlert("freeze", "Cast Freeze on Opponent!");

      if (opponent?.roomId) {
        emitSpell(opponent.roomId, "freeze");
      }
      if (isOpponentBot) {
        if (oppShield) {
          setOppShield(false);
        } else {
          setOppFrozen(true);
          setTimeout(() => setOppFrozen(false), 3000);
        }
      }
    } else if (spellId === "shield") {
      playSynth("SHIELD");
      setHasShield(true);
      setSpellCooldowns((prev) => ({ ...prev, shield: 6 }));
      showCombatAlert("shield_block", "Papa's Shield Activated!");
    } else if (spellId === "scramble") {
      playSynth("SCRAMBLE");
      setSpellCooldowns((prev) => ({ ...prev, scramble: 4 }));
      showCombatAlert("scramble", "Inked Opponent's Board!");

      if (opponent?.roomId) {
        emitSpell(opponent.roomId, "scramble");
      }
    } else if (spellId === "reveal") {
      playSynth("REVEAL");
      setSpellCooldowns((prev) => ({ ...prev, reveal: 8 }));

      // Find an unguessed correct letter
      const unrevealedLetters = wordLetters.filter((char) => !allGuessedLetters.includes(char));
      if (unrevealedLetters.length > 0) {
        const revealedChar = unrevealedLetters[Math.floor(Math.random() * unrevealedLetters.length)];
        setGuessedLetters((prev) => [...prev, revealedChar]);
        showCombatAlert("bounty", `Insight Revealed '${revealedChar}'!`);

        if (opponent?.roomId) {
          const newScore = wordLetters.filter((l) => [...guessedLetters, revealedChar].includes(l)).length;
          sendGuess(opponent.roomId, revealedChar, newScore);
        }
      }
    }
  };

  const startNewGame = (resetToMenu = false) => {
    disconnect();
    onQuit();
  };

  // --- Effects: Game End & Cloud Sync ---
  useEffect(() => {
    if (isGameOver && !hasClaimedResult && !syncLock.current) {
      syncLock.current = true;
      const onlineOutcome = getOnlineMatchRewards(isWon, profile.onlineWinStreak);
      const earnedXP = onlineOutcome.xpChange;
      const earnedCoins = onlineOutcome.coinChange;
      const newStreak = isWon ? profile.onlineWinStreak + 1 : 0;

      setSessionSnapshot({ streak: newStreak, totalXP: earnedXP, totalCoins: earnedCoins });
      applyOnlineResults(isWon);

      if (isWon && (logicIsWon || oppLostByErrors) && opponent?.roomId) {
        emitFinished(opponent.roomId, profile.name);
      }

      // Trophy Gate calculation
      const currentHighestXP = Math.max(profile.highestXP || 0, profile.xp + earnedXP);
      const adjustedXP = applyTrophyFloor(profile.xp + earnedXP, currentHighestXP);

      const updatedProfile = {
        ...profile,
        xp: adjustedXP,
        highestXP: currentHighestXP,
        papaPoints: profile.papaPoints + earnedCoins,
        onlineWinStreak: newStreak,
        highestWinStreak: Math.max(profile.highestWinStreak || 0, newStreak),
        duelMatchesPlayed: (profile.duelMatchesPlayed || 0) + 1,
        duelSpellsCast: (profile.duelSpellsCast || 0) + spellsCastCount,
      };

      syncToDatabase(updatedProfile);
      setHasClaimedResult(true);
    }
  }, [
    isGameOver,
    isWon,
    hasClaimedResult,
    profile,
    opponent,
    logicIsWon,
    oppLostByErrors,
    spellsCastCount,
    applyOnlineResults,
    emitFinished,
    syncToDatabase,
  ]);

  // Match Timer
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((p) => (p <= 0 ? 0 : p - 1)), 1000);
    return () => clearInterval(timer);
  }, [isGameOver]);

  return (
    <div className="flex flex-col space-y-3 relative">
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

      {/* Main Clash Duel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-5 items-start">
        {/* Left Column: Word Stage, Elixir Bar, Tactical Deck, and Keyboard */}
        <div className="lg:col-span-8 flex flex-col space-y-3 relative">
          
          {/* Floating Combat Notification */}
          <ClashCombatFeedback
            isFrozen={isFrozen}
            freezeSeconds={freezeRemaining}
            hasShield={hasShield}
            isScrambled={isScrambled}
            scrambleSeconds={scrambleRemaining}
            combatAlert={combatAlert}
          />

          {/* Word Display with Inky Scramble Effect */}
          <div
            className={`py-3.5 px-2 flex justify-center bg-zinc-100 dark:bg-zinc-900/40 rounded-2xl relative overflow-hidden transition-all duration-300 ${
              hasShield ? "ring-2 ring-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.25)]" : ""
            } ${isScrambled ? "filter blur-[1px] rotate-[0.5deg]" : ""}`}
          >
            <WordDisplay
              wordLetters={wordLetters}
              guessedLetters={allGuessedLetters}
              isLost={isLost}
              isWon={isWon}
            />
          </div>

          {/* Clash Royale Real-time Elixir Bar */}
          {!hasClaimedResult && (
            <ElixirBar
              elixir={elixir}
              maxElixir={10}
              isSuddenDeath={isSuddenDeath}
              isShaking={isElixirShaking}
            />
          )}

          {/* Tactical Spell Cards Hand */}
          {!hasClaimedResult && (
            <SpellDeck
              deck={profile.activeDeck || ["freeze", "shield", "scramble", "reveal"]}
              currentElixir={elixir}
              onCastSpell={handleCastSpell}
              isFrozen={isFrozen}
              hasShield={hasShield}
              cooldowns={spellCooldowns}
            />
          )}

          {/* Virtual Keyboard or Victory/Defeat Results */}
          <div className="min-h-[180px] md:min-h-[210px] relative">
            {!hasClaimedResult ? (
              <div className="relative">
                <VirtualKeyboard
                  guessedLetters={allGuessedLetters}
                  wordLetters={wordLetters}
                  onGuess={handleGuess}
                  disabled={isTransitioning || isFrozen}
                  accent={currentRank.color}
                />
              </div>
            ) : (
              <GameResults
                isWon={isWon}
                word={currentGame?.word}
                mode="online"
                onRestart={() => startNewGame(false)}
                streak={sessionSnapshot.streak}
                xpEarned={sessionSnapshot.totalXP}
                coinsEarned={sessionSnapshot.totalCoins}
              />
            )}
          </div>
        </div>

        {/* Right Column: Papa Mascot and Enhanced Duel Battle Tracker */}
        <div className="lg:col-span-4 flex flex-col items-center space-y-4">
          <div className={`relative transition-all duration-300 ${hasShield ? "scale-105" : ""}`}>
            <DynamicPapa
              errors={wrongGuesses.length}
              isWinner={isWon}
              isLost={isLost}
              maxErrors={6}
              accent={hasShield ? "#f59e0b" : currentRank.color}
              currentRankName={currentRank.name}
              rankLevel={currentRank.level}
              streak={hasClaimedResult ? sessionSnapshot.streak : profile.onlineWinStreak}
              wordLength={currentGame?.word?.length || 0}
            />
          </div>

          {opponent && (
            <div className="w-full">
              <OnlineRaceTracker
                myCount={correctGuessesCount}
                oppCount={opponent.progress || 0}
                total={wordLetters.length}
                oppName={opponent.name}
                myWrongCount={wrongGuesses.length}
                oppWrongCount={oppWrongCount}
                maxWrong={6}
                myShield={hasShield}
                oppShield={oppShield}
                myFrozen={isFrozen}
                oppFrozen={oppFrozen}
              />
            </div>
          )}
        </div>
      </div>

      {isTransitioning && <GameTransitionOverlay />}
    </div>
  );
}