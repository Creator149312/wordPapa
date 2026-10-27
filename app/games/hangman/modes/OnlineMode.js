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
import ClashArenaHeader from "../components/ClashArenaHeader";
import ClashOpponentStrip from "../components/ClashOpponentStrip";
import ClashElixirBar from "../components/ClashElixirBar";
import ClashSpellCards from "../components/ClashSpellCards";
import ClashCombatFeedback from "../components/ClashCombatFeedback";

// Hooks & Lib
import { useHangmanSocket } from "../hooks/useHangmanSocket";
import { useGameLogic } from "../hooks/useGameLogic";
import { useAudio } from "../hooks/useAudio";
import { getOnlineMatchRewards, calculateLevel, applyTrophyFloor } from "../lib/progression";
import { RANKS, ARENAS } from "../constants";

const RARE_BOUNTY_LETTERS = ["J", "Q", "X", "Z", "K", "V", "W", "B", "P"];

export default function OnlineMode({
  initialMatchData = null,
  profile,
  onQuit,
  onRestartDuel,
  applyOnlineResults,
  syncToDatabase,
}) {
  const { playSynth } = useAudio();
  const [hasClaimedResult, setHasClaimedResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);
  const [isOvertime, setIsOvertime] = useState(false);
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
      setTimeLeft(90);
      setIsOvertime(false);
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

  // --- Initial Match Data Setup (Instant Bot or Socket) ---
  useEffect(() => {
    if (initialMatchData) {
      initGameSession("online", initialMatchData);
      setOpponent({
        name: initialMatchData.opponentName,
        progress: 0,
        wrongCount: 0,
        isShielded: false,
        isFrozen: false,
        roomId: initialMatchData.roomId,
        isBot: Boolean(initialMatchData.isBot),
      });
      setHasClaimedResult(false);
      setOpponentWon(false);
      setTimeLeft(90);
      setIsOvertime(false);
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
    } else if (!currentGame) {
      const fallbackWords = [
        { word: "JUPITER", category: "Space" },
        { word: "PINEAPPLE", category: "Fruits" },
        { word: "COLOSSEUM", category: "Landmarks" },
        { word: "AVOCADO", category: "Food" },
      ];
      const selected = fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
      initGameSession("online", selected);
      setOpponent({
        name: "Scholar Aether",
        progress: 0,
        wrongCount: 0,
        isShielded: false,
        isFrozen: false,
        roomId: `duel_bot_${Date.now()}`,
        isBot: true,
      });
      setElixir(5.0);
    }
  }, [initialMatchData, initGameSession]);

  // --- Win/Loss & Game-Over Logic ---
  // Overtime has expired when in overtime and timeLeft reaches 0
  const isTimeUp = isOvertime && timeLeft <= 0;
  const myScore = correctGuessesCount;
  const oppScore = opponent?.progress || 0;
  const oppLostByErrors = oppWrongCount >= 6;

  const isWon = useMemo(() => {
    // 1. Instant Win: You completed the word!
    if (logicIsWon && !opponentWon) return true;
    // 2. Opponent lost all 6 lives
    if (oppLostByErrors && wrongGuesses.length < 6) return true;
    // 3. Overtime expired: highest score wins
    if (isTimeUp) {
      if (myScore > oppScore) return true;
      if (myScore === oppScore && wrongGuesses.length < oppWrongCount) return true;
    }
    return false;
  }, [logicIsWon, opponentWon, oppLostByErrors, isTimeUp, myScore, oppScore, wrongGuesses.length, oppWrongCount]);

  const isLost = useMemo(() => {
    // 1. Instant Loss: Opponent completed the word!
    if (opponentWon) return true;
    // 2. You lost all 6 lives
    if (wrongGuesses.length >= 6) return true;
    // 3. Overtime expired: opponent has higher score
    if (isTimeUp) {
      if (myScore < oppScore) return true;
      if (myScore === oppScore && wrongGuesses.length > oppWrongCount) return true;
    }
    return false;
  }, [opponentWon, wrongGuesses.length, isTimeUp, myScore, oppScore, oppWrongCount]);

  const isDraw = useMemo(() => {
    return (
      isTimeUp &&
      myScore === oppScore &&
      wrongGuesses.length === oppWrongCount &&
      !logicIsWon &&
      !opponentWon &&
      !oppLostByErrors
    );
  }, [isTimeUp, myScore, oppScore, wrongGuesses.length, oppWrongCount, logicIsWon, opponentWon, oppLostByErrors]);

  const isGameOver = isWon || isLost || isDraw;

  // Sudden Death (2X Elixir) when in Overtime or in the final 30 seconds of regulation
  const isSuddenDeath = isOvertime || (timeLeft <= 30 && timeLeft > 0);

  // --- 1. Real-time Elixir & Spell Tick Loop ---
  // Authentic Clash Royale Elixir Generation Rates:
  // Normal (1x): 1 Elixir every 2.8 seconds = 0.0357 Elixir per 100ms
  // Sudden Death / Overtime (2x): 1 Elixir every 1.4 seconds = 0.0714 Elixir per 100ms
  // Overtime Spell Speed: Cooldowns tick down at 2X speed!
  useEffect(() => {
    if (gameState !== "playing" || isGameOver) return;

    const interval = setInterval(() => {
      const rate = isSuddenDeath ? 0.0714 : 0.0357;
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

      // Decrement spell cooldowns:
      // In Overtime, 2X speed! (recovers twice as fast = 0.2s per 100ms)
      const cooldownDec = isOvertime ? 0.2 : 0.1;
      setSpellCooldowns((prev) => {
        const next = { ...prev };
        let hasChanges = false;
        for (const [key, val] of Object.entries(next)) {
          if (val > 0) {
            next[key] = Math.max(0, val - cooldownDec);
            hasChanges = true;
          }
        }
        return hasChanges ? next : prev;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [gameState, isGameOver, isSuddenDeath, isOvertime, isFrozen, isScrambled, playSynth]);

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
    if (!isOpponentBot || !currentGame || gameState !== "playing" || isGameOver || logicIsWon || opponentWon) return;

    let botElixir = 5.0;
    const botInterval = setInterval(() => {
      // Immediately stop bot if game is concluded
      if (isGameOver || logicIsWon || opponentWon) {
        clearInterval(botInterval);
        return;
      }

      // If bot is frozen, it skips actions
      if (oppFrozen) return;

      // Bot tactical spell casting (more active during overtime)
      const spellChance = isOvertime ? 0.4 : 0.25;
      if (botElixir >= 3 && Math.random() < spellChance) {
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
      const guessChance = isOvertime ? 0.6 : 0.45;
      if (botElixir >= 2 && Math.random() < guessChance) {
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
                return nextW;
              });
              return false;
            }
          });
        }
      }
    }, isOvertime ? 1100 : 1800);

    return () => clearInterval(botInterval);
  }, [isOpponentBot, currentGame, gameState, isGameOver, logicIsWon, opponentWon, oppFrozen, isOvertime, handleOpponentSpell]);

  // --- 4. Letter Guess Handler (Costs 2 Elixir) ---
  const handleGuess = (letter) => {
    const L = letter.toUpperCase();
    if (allGuessedLetters.includes(L) || isGameOver || isTransitioning || isFrozen) return;

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
    if (!resetToMenu && onRestartDuel) {
      onRestartDuel();
    } else {
      onQuit();
    }
  };

  // --- Keyboard Shortcuts (A-Z to guess, 1-4 for Spells) ---
  useEffect(() => {
    if (gameState !== "playing" || isGameOver) return;

    const handleKeyDown = (e) => {
      // Ignore if user is focused on an input element
      if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target?.tagName)) return;

      const key = e.key.toUpperCase();

      // Number keys 1-4 for spells
      if (["1", "2", "3", "4"].includes(e.key)) {
        const spellDeck = profile.activeDeck || ["freeze", "shield", "scramble", "reveal"];
        const index = parseInt(e.key, 10) - 1;
        const spellId = spellDeck[index];
        const costs = { freeze: 3, shield: 3, scramble: 2, reveal: 4 };
        if (spellId && costs[spellId]) {
          handleCastSpell(spellId, costs[spellId]);
        }
        return;
      }

      // Letter keys A-Z for guesses
      if (/^[A-Z]$/.test(key)) {
        handleGuess(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, isGameOver, profile.activeDeck, elixir, isFrozen, allGuessedLetters, wordLetters]);

  // --- Effects: Game End & Cloud Sync ---
  useEffect(() => {
    if (isGameOver && !hasClaimedResult && !syncLock.current) {
      syncLock.current = true;
      if (isWon) {
        playSynth("LEVEL_UP");
      } else if (isLost) {
        playSynth("POP");
      }
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

  // Match Timer with Sudden Death Overtime (+30 seconds)
  useEffect(() => {
    if (isGameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // If we are in regular 90s regulation:
          if (!isOvertime) {
            // Check if someone already won or lost
            if (logicIsWon || opponentWon || wrongGuesses.length >= 6 || oppWrongCount >= 6) {
              return 0;
            }
            // Neither player has solved the word! Enter Sudden Death Overtime (+30 seconds)!
            setIsOvertime(true);
            playSynth("SUDDEN_DEATH");
            showCombatAlert("bounty", "⚡ OVERTIME! +30s • 2X ELIXIR & 2X SPELL SPEED!");
            return 30; // +30s overtime countdown
          } else {
            // Overtime has expired
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    isGameOver,
    isOvertime,
    logicIsWon,
    opponentWon,
    wrongGuesses.length,
    oppWrongCount,
    playSynth,
    showCombatAlert,
  ]);

  return (
    <div className="w-full flex justify-center py-2 px-1 select-none">
      {/* 9:16 Clash Royale Console Container */}
      <div className="w-full max-w-[430px] rounded-[2.5rem] bg-zinc-950/95 border-2 border-zinc-800/80 shadow-2xl p-3 flex flex-col space-y-2.5 relative overflow-hidden backdrop-blur-md">
        
        {/* Arena Atmosphere Background Tint */}
        <div
          className="absolute -top-24 -left-24 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: currentRank.color }}
        />

        {/* 1. Clash Arena Minimal Header (Quit, Category, Timer) */}
        <ClashArenaHeader
          timeLeft={timeLeft}
          onQuit={() => startNewGame(true)}
          isSuddenDeath={isSuddenDeath}
          isOvertime={isOvertime}
          category={currentGame?.category || "Clash Duel"}
          currentArena={activeArena}
        />

        {/* 2. Opponent River Strip (Avatar, Name, Hearts, Progress Dots) */}
        {opponent && (
          <ClashOpponentStrip
            opponent={opponent}
            totalLetters={wordLetters.length}
            oppWrongCount={oppWrongCount}
            maxWrong={6}
            isShielded={oppShield}
            isFrozen={oppFrozen}
            freezeRemaining={oppFrozen ? 3.0 : 0}
          />
        )}

        {/* 3. Floating Combat Alert Banner & Status Effects */}
        <ClashCombatFeedback
          isFrozen={isFrozen}
          freezeSeconds={freezeRemaining}
          hasShield={hasShield}
          isScrambled={isScrambled}
          scrambleSeconds={scrambleRemaining}
          combatAlert={combatAlert}
        />

        {/* 4. Player Word Arena (Hidden Letters Tiles) */}
        <div
          className={`py-3 px-2 flex justify-center bg-zinc-900/60 rounded-2xl relative overflow-hidden transition-all duration-300 border border-zinc-800/80 ${
            hasShield ? "ring-2 ring-amber-400/90 shadow-[0_0_15px_rgba(251,191,36,0.25)]" : ""
          } ${isScrambled ? "filter blur-[1px] rotate-[0.5deg]" : ""}`}
        >
          <WordDisplay
            wordLetters={wordLetters}
            guessedLetters={allGuessedLetters}
            isLost={isLost}
            isWon={isWon}
            showClue={false}
          />
        </div>

        {/* 5. Clash Royale Elixir Bar (0..10 Magenta Bar) */}
        {!hasClaimedResult && (
          <ClashElixirBar
            elixir={elixir}
            maxElixir={10}
            isSuddenDeath={isSuddenDeath}
            isShaking={isElixirShaking}
          />
        )}

        {/* 6. 4-Card Tactical Spell Deck */}
        {!hasClaimedResult && (
          <ClashSpellCards
            deck={profile.activeDeck || ["freeze", "shield", "scramble", "reveal"]}
            currentElixir={elixir}
            onCastSpell={handleCastSpell}
            isFrozen={isFrozen}
            hasShield={hasShield}
            cooldowns={spellCooldowns}
            isOvertime={isOvertime}
            isGameOver={isGameOver}
          />
        )}

        {/* 7. Virtual Keyboard or Match Over Results */}
        <div className="relative pt-0.5">
          {!hasClaimedResult ? (
            <VirtualKeyboard
              guessedLetters={allGuessedLetters}
              wordLetters={wordLetters}
              onGuess={handleGuess}
              disabled={isTransitioning || isFrozen || isGameOver}
              accent={currentRank.color}
            />
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

      {isTransitioning && <GameTransitionOverlay />}
    </div>
  );
}