"use client";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Bomb, Activity, Trophy } from "lucide-react";
import { motion } from "framer-motion";

// UI Components
import GameHeader from "../components/GameHeader";
import WordDisplay from "../components/WordDisplay";
import VirtualKeyboard from "../components/VirtualKeyboard";
import GameResults from "../components/GameResults";
import DynamicPapa from "../components/DynamicPapa";
import SessionProgress from "../components/SessionProgress";
import LevelUpModal from "../components/LevelUpModal";
import JourneyMilestoneBanner from "../components/JourneyMilestoneBanner";

// Hooks & Constants
import { useGameLogic } from "../hooks/useGameLogic";
import { useAudio } from "../hooks/useAudio";
import {
  calculateLevel,
  getArenaUnlockBonus,
  getBlastCost,
  getReviveCost,
  applyWrongGuessPenalty,
} from "../lib/progression";
import { RANKS, ARENAS } from "../constants";

export default function JourneyMode({
  profile,
  onQuit,
  syncToDatabase,
  triggerSavePrompt,
  applyEndlessResult,
  journeyNode = null,       // { nodeId: "2-3", rankId: 2 } — journey node mode
  listId = null,            // direct list practice mode (from /lists/[slugId])
  listWords = null,         // pre-fetched words array [{ word, wordData }] for list mode
  listTitle = null,         // title to display in list mode
}) {
  const [activeJourneyNode, setActiveJourneyNode] = useState(journeyNode);
  // --- 1. WORD POOL (from journey node OR from direct list) ---
  const [nodeWordPool, setNodeWordPool] = useState([]);
  const [nodeTitle, setNodeTitle] = useState("Loading...");
  const [nodeWordsLoaded, setNodeWordsLoaded] = useState(false);

  useEffect(() => {
    // Priority 1: direct list words passed as prop (no fetch needed)
    if (listWords?.length) {
      setNodeWordPool(
        listWords.map((w) => ({
          word: w.word,
          hint: w.wordData || "",
          category: listTitle || "List Practice",
        }))
      );
      setNodeTitle(listTitle || "List Practice");
      setNodeWordsLoaded(true);
      return;
    }

    // Priority 2: fetch from journey node
    if (!activeJourneyNode?.nodeId) return;
    const fetchWords = async () => {
      try {
        setNodeWordsLoaded(false);
        const res = await fetch(`/api/journey/node-words?nodeId=${activeJourneyNode.nodeId}`);
        const data = await res.json();
        if (data.success && data.words?.length) {
          setNodeWordPool(data.words);
          setNodeTitle(data.title || activeJourneyNode.nodeId);
        }
      } catch (e) {
        console.error("Failed to fetch node words:", e);
      } finally {
        setNodeWordsLoaded(true);
      }
    };
    fetchWords();

    // Fetch Tough Nut words for spaced repetition injection (only for logged-in users)
    if (!profile.isGhost) {
      fetch("/api/journey/tough-nuts")
        .then((r) => r.json())
        .then((data) => { if (data.success) setToughNutWords(data.words || []); })
        .catch(() => {});
    }
  }, [activeJourneyNode, listWords, listTitle, profile.isGhost]);

  const isListMode = !!listId || !!listWords;

  // --- 2. GAME STATE (mirrors EndlessRunMode) ---
  const [globalMistakes, setGlobalMistakes] = useState(0);
  const [totalWordsSolved, setTotalWordsSolved] = useState(0);
  const [nodeWordsSolved, setNodeWordsSolved] = useState(0);
  const [totalXPEarned, setTotalXPEarned] = useState(0);
  const [totalCoinsEarned, setTotalCoinsEarned] = useState(0);
  const [totalCoinsSpent, setTotalCoinsSpent] = useState(0);
  // Tough nut words injected from the user's mistake history
  const [toughNutWords, setToughNutWords] = useState([]);
  const [injectedToughNutWords, setInjectedToughNutWords] = useState([]);
  const [usedWordTexts, setUsedWordTexts] = useState([]);
  const [hasClaimedResult, setHasClaimedResult] = useState(false);
  const [nodeProgress, setNodeProgress] = useState(null);

  const [currentWordXP, setCurrentWordXP] = useState(0);
  const [currentWordCoins, setCurrentWordCoins] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [journeyBanner, setJourneyBanner] = useState(null);

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [queuedLevelUp, setQueuedLevelUp] = useState(false);
  const [pendingLevelReward, setPendingLevelReward] = useState(0);
  const [blastsUsed, setBlastsUsed] = useState(0);
  const [sessionMaxRankLevel, setSessionMaxRankLevel] = useState(
    calculateLevel(profile.xp || 0).level,
  );
  const [arenaCompleted, setArenaCompleted] = useState(false);
  const [arenaBonusXP, setArenaBonusXP] = useState(0);
  const [nextJourneyNode, setNextJourneyNode] = useState(null);

  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isReviving, setIsReviving] = useState(false);
  const [isRunEnded, setIsRunEnded] = useState(false);
  const [revivesUsed, setRevivesUsed] = useState(0);
  const [reviveCountdown, setReviveCountdown] = useState(null);
  const [finalSyncAttempt, setFinalSyncAttempt] = useState(0);

  const { playSynth } = useAudio();
  const MAX_GLOBAL_LIVES = 5;
  const TRANSITION_MS = 1500;
  const REVIVE_WINDOW_SECONDS = 6;

  const syncLock = useRef(false);
  const prevWrongGuessesRef = useRef([]);
  const transitionLock = useRef(false);
  const shatterIgnoredLettersRef = useRef(new Set());

  // Refs that always hold the latest value — used in cleanup to avoid stale closures
  const totalWordsSolvedRef = useRef(0);
  const nodeWordsSolvedRef = useRef(0);
  const totalXPEarnedRef = useRef(0);
  const totalCoinsEarnedRef = useRef(0);
  const totalCoinsSpentRef = useRef(0);
  const activeJourneyNodeRef = useRef(activeJourneyNode);
  const hasClaimedResultRef = useRef(false);
  const isListModeRef = useRef(false);
  // Tracks wrong-guess count per word for spaced repetition (Tough Nuts)
  const wordMistakesRef = useRef({});
  // Tracks total node pool size for keepalive unmount — can't read state in cleanup
  const nodeWordPoolRef = useRef([]);
  const toughNutQueueRef = useRef([]);
  const flushInFlightRef = useRef(false);
  const pendingFlushRef = useRef(null);
  const lastRemoteSyncedXPRef = useRef(0);
  const lastLocalAppliedXPRef = useRef(0);
  const lastRemoteSyncedCoinsRef = useRef(0);
  const sessionBaseRef = useRef({
    xp: profile.xp || 0,
    journeyXP: profile.journeyXP || 0,
    papaPoints: profile.papaPoints || 0,
    totalWordsSolved: profile.totalWordsSolved || 0,
  });

  // Periodic sync tracking (30s debounce for logged-in users)
  const lastSyncedState = useRef({
    wordsSolved: sessionBaseRef.current.totalWordsSolved,
  });
  const lastLocalCheckpointStateRef = useRef({
    papaPoints: sessionBaseRef.current.papaPoints,
    wordsSolved: sessionBaseRef.current.totalWordsSolved,
  });
  const periodicSyncTimer = useRef(null);

  useEffect(() => {
    setActiveJourneyNode(journeyNode);
  }, [journeyNode]);

  // Keep refs in sync so cleanup effect can read latest values without stale closures
  useEffect(() => { totalWordsSolvedRef.current = totalWordsSolved; }, [totalWordsSolved]);
  useEffect(() => { nodeWordsSolvedRef.current = nodeWordsSolved; }, [nodeWordsSolved]);
  useEffect(() => { totalXPEarnedRef.current = totalXPEarned; }, [totalXPEarned]);
  useEffect(() => { totalCoinsEarnedRef.current = totalCoinsEarned; }, [totalCoinsEarned]);
  useEffect(() => { totalCoinsSpentRef.current = totalCoinsSpent; }, [totalCoinsSpent]);
  useEffect(() => { activeJourneyNodeRef.current = activeJourneyNode; }, [activeJourneyNode]);
  useEffect(() => { hasClaimedResultRef.current = hasClaimedResult; }, [hasClaimedResult]);
  useEffect(() => { isListModeRef.current = isListMode; }, [isListMode]);
  useEffect(() => { nodeWordPoolRef.current = nodeWordPool; }, [nodeWordPool]);

  // --- 3. RANK LOGIC ---
  const combinedXP = useMemo(
    () => sessionBaseRef.current.xp + totalXPEarned,
    [totalXPEarned],
  );

  const sessionRank = useMemo(() => {
    return calculateLevel(combinedXP);
  }, [combinedXP]);

  const arenaTier = useMemo(() => {
    if (isListMode) {
      return sessionRank;
    }

    return RANKS.find((rank) => rank.level === (activeJourneyNode?.rankId || 1)) || RANKS[0];
  }, [isListMode, activeJourneyNode?.rankId, sessionRank]);

  const livePapaPoints = useMemo(
    () => sessionBaseRef.current.papaPoints + totalCoinsEarned - totalCoinsSpent,
    [totalCoinsEarned, totalCoinsSpent],
  );

  const currentJourneyXP = useMemo(
    () => sessionBaseRef.current.journeyXP + totalXPEarned,
    [totalXPEarned],
  );

  const xpPercent = useMemo(() => {
    const currentRank = [...RANKS].reverse().find((r) => currentJourneyXP >= r.minXP) || RANKS[0];
    const nextRank = RANKS.find((r) => r.minXP > currentJourneyXP);
    if (!nextRank) return 100;
    const base = currentRank.minXP;
    const needed = nextRank.minXP - base;
    return Math.min(Math.floor(((currentJourneyXP - base) / needed) * 100), 100);
  }, [currentJourneyXP]);

  const buildAbsoluteProgressSnapshot = useCallback(() => {
    return {
      totalWordsSolved:
        sessionBaseRef.current.totalWordsSolved + totalWordsSolvedRef.current,
      papaPoints:
        sessionBaseRef.current.papaPoints +
        totalCoinsEarnedRef.current -
        totalCoinsSpentRef.current,
    };
  }, []);

  const recordEarnedProgress = useCallback((xpGain = 0, coinGain = 0, wordsGain = 0) => {
    if (wordsGain) {
      totalWordsSolvedRef.current += wordsGain;
      setTotalWordsSolved((prev) => prev + wordsGain);
    }
    if (xpGain) {
      totalXPEarnedRef.current += xpGain;
      setTotalXPEarned((prev) => prev + xpGain);
    }
    if (coinGain) {
      totalCoinsEarnedRef.current += coinGain;
      setTotalCoinsEarned((prev) => prev + coinGain);
    }
  }, []);

  const recordNodeWordSolved = useCallback((wordsGain = 0) => {
    if (!wordsGain) return;
    nodeWordsSolvedRef.current += wordsGain;
    setNodeWordsSolved((prev) => prev + wordsGain);
  }, []);

  const recordSpentCoins = useCallback((coinCost = 0) => {
    if (!coinCost) return;
    totalCoinsSpentRef.current += coinCost;
    setTotalCoinsSpent((prev) => prev + coinCost);
  }, []);

  const queueToughNutWord = useCallback((word, wordData = "") => {
    if (!word) return;
    const normalizedWord = word.toLowerCase();
    const alreadyQueued = toughNutQueueRef.current.some(
      (entry) => entry.word === normalizedWord,
    );
    if (!alreadyQueued) {
      toughNutQueueRef.current.push({ word: normalizedWord, wordData });
    }
  }, []);

  const isSyncDebugEnabled = useCallback(() => {
    return (
      typeof window !== "undefined" &&
      window.localStorage.getItem("journey-sync-debug") === "1"
    );
  }, []);

  const getSyncDebugHeaders = useCallback(() => {
    return isSyncDebugEnabled() ? { "x-journey-sync-debug": "1" } : {};
  }, [isSyncDebugEnabled]);

  const logSyncEvent = useCallback((event, payload = {}) => {
    if (!isSyncDebugEnabled()) return;
    console.debug(`[JourneySync] ${event}`, payload);
  }, [isSyncDebugEnabled]);

  const removeToughNutWord = useCallback(async (word) => {
    if (profile.isGhost || !word) {
      return true;
    }

    const normalizedWord = word.toLowerCase();

    setToughNutWords((prev) =>
      prev.filter((entry) => entry.word.toLowerCase() !== normalizedWord),
    );

    try {
      logSyncEvent("tough-nuts.remove.start", {
        word: normalizedWord,
      });
      const response = await fetch("/api/journey/tough-nuts", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...getSyncDebugHeaders(),
        },
        body: JSON.stringify({ word: normalizedWord }),
      });

      if (!response.ok) {
        logSyncEvent("tough-nuts.remove.failed", {
          word: normalizedWord,
          status: response.status,
        });
        return false;
      }

      logSyncEvent("tough-nuts.remove.success", {
        word: normalizedWord,
      });
      return true;
    } catch (error) {
      console.warn("Tough Nut removal failed:", error);
      logSyncEvent("tough-nuts.remove.error", {
        word: normalizedWord,
        error: error?.message || "unknown",
      });
      return false;
    }
  }, [getSyncDebugHeaders, logSyncEvent, profile.isGhost]);

  const applyLocalCheckpoint = useCallback(() => {
    const snapshot = buildAbsoluteProgressSnapshot();
    const unsyncedLocalXP = Math.max(
      0,
      totalXPEarnedRef.current - lastLocalAppliedXPRef.current,
    );
    const hasAbsoluteChange =
      snapshot.papaPoints !== lastLocalCheckpointStateRef.current.papaPoints ||
      snapshot.totalWordsSolved !== lastLocalCheckpointStateRef.current.wordsSolved;

    if (unsyncedLocalXP <= 0 && !hasAbsoluteChange) return;

    logSyncEvent("local.checkpoint", {
      snapshot,
      unsyncedLocalXP,
      hasAbsoluteChange,
    });

    applyEndlessResult({
      ...snapshot,
      ...(unsyncedLocalXP > 0 ? { journeyXPDelta: unsyncedLocalXP } : {}),
    });
    lastLocalAppliedXPRef.current = totalXPEarnedRef.current;
    lastLocalCheckpointStateRef.current = {
      papaPoints: snapshot.papaPoints,
      wordsSolved: snapshot.totalWordsSolved,
    };
  }, [applyEndlessResult, buildAbsoluteProgressSnapshot, logSyncEvent]);

  const flushQueuedToughNuts = useCallback(async () => {
    if (profile.isGhost || toughNutQueueRef.current.length === 0) {
      return true;
    }

    try {
      logSyncEvent("tough-nuts.flush.start", {
        count: toughNutQueueRef.current.length,
      });
      const response = await fetch("/api/journey/tough-nuts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getSyncDebugHeaders(),
        },
        body: JSON.stringify({ words: toughNutQueueRef.current }),
      });

      if (!response.ok) {
        logSyncEvent("tough-nuts.flush.failed", {
          status: response.status,
        });
        return false;
      }

      toughNutQueueRef.current = [];
      logSyncEvent("tough-nuts.flush.success", {});
      return true;
    } catch (error) {
      console.warn("Tough Nuts batch flush failed:", error);
      logSyncEvent("tough-nuts.flush.error", {
        error: error?.message || "unknown",
      });
      return false;
    }
  }, [getSyncDebugHeaders, logSyncEvent, profile.isGhost]);

  const flushProfileProgress = useCallback(async ({ force = false } = {}) => {
    const snapshot = buildAbsoluteProgressSnapshot();
    const unsyncedRemoteXP = Math.max(
      0,
      totalXPEarnedRef.current - lastRemoteSyncedXPRef.current,
    );
    const currentNetCoins = totalCoinsEarnedRef.current - totalCoinsSpentRef.current;
    const unsyncedRemoteCoins = currentNetCoins - lastRemoteSyncedCoinsRef.current;
    const hasChange =
      unsyncedRemoteXP > 0 ||
      unsyncedRemoteCoins !== 0 ||
      snapshot.totalWordsSolved !== lastSyncedState.current.wordsSolved;

    applyLocalCheckpoint();

    if (profile.isGhost || !syncToDatabase) {
      return true;
    }

    if (!force && !hasChange) {
      logSyncEvent("profile.flush.skipped", {
        force,
        unsyncedRemoteXP,
        unsyncedRemoteCoins,
      });
      return true;
    }

    // Server receives delta-based fields only — absolute papaPoints is stripped
    const { papaPoints: _absPP, ...cleanSnapshot } = snapshot;
    const remoteSnapshot = {
      ...cleanSnapshot,
      ...(unsyncedRemoteXP > 0 ? { journeyXPDelta: unsyncedRemoteXP } : {}),
      ...(unsyncedRemoteCoins !== 0 ? { papaPointsDelta: unsyncedRemoteCoins } : {}),
    };
    logSyncEvent("profile.flush.start", {
      force,
      remoteSnapshot,
    });
    const success = await syncToDatabase(remoteSnapshot);

    if (success !== false) {
      lastRemoteSyncedXPRef.current = totalXPEarnedRef.current;
      lastRemoteSyncedCoinsRef.current = currentNetCoins;
      lastSyncedState.current = {
        wordsSolved: snapshot.totalWordsSolved,
      };
      logSyncEvent("profile.flush.success", {
        remoteSnapshot,
      });
      return true;
    }

    logSyncEvent("profile.flush.failed", {
      remoteSnapshot,
    });
    return false;
  }, [applyLocalCheckpoint, buildAbsoluteProgressSnapshot, logSyncEvent, profile.isGhost, syncToDatabase]);

  const requestProfileFlush = useCallback(async (options = {}) => {
    if (flushInFlightRef.current) {
      logSyncEvent("profile.flush.queued", options);
      pendingFlushRef.current = {
        ...pendingFlushRef.current,
        ...options,
        force: pendingFlushRef.current?.force || options.force || false,
      };
      return true;
    }

    flushInFlightRef.current = true;
    logSyncEvent("profile.flush.requested", options);
    try {
      return await flushProfileProgress(options);
    } finally {
      flushInFlightRef.current = false;
      if (pendingFlushRef.current) {
        const queuedOptions = pendingFlushRef.current;
        pendingFlushRef.current = null;
        void requestProfileFlush(queuedOptions);
      }
    }
  }, [flushProfileProgress, logSyncEvent]);

  const rebaseSessionProgress = useCallback(() => {
    const snapshot = buildAbsoluteProgressSnapshot();

    sessionBaseRef.current = {
      xp: sessionBaseRef.current.xp + totalXPEarnedRef.current,
      journeyXP: sessionBaseRef.current.journeyXP + totalXPEarnedRef.current,
      papaPoints: snapshot.papaPoints,
      totalWordsSolved: snapshot.totalWordsSolved,
    };

    totalWordsSolvedRef.current = 0;
    nodeWordsSolvedRef.current = 0;
    totalXPEarnedRef.current = 0;
    totalCoinsEarnedRef.current = 0;
    totalCoinsSpentRef.current = 0;
    lastRemoteSyncedXPRef.current = 0;
    lastLocalAppliedXPRef.current = 0;
    lastRemoteSyncedCoinsRef.current = 0;
    lastSyncedState.current = {
      wordsSolved: snapshot.totalWordsSolved,
    };
    lastLocalCheckpointStateRef.current = {
      papaPoints: snapshot.papaPoints,
      wordsSolved: snapshot.totalWordsSolved,
    };

    setTotalWordsSolved(0);
    setNodeWordsSolved(0);
    setTotalXPEarned(0);
    setTotalCoinsEarned(0);
    setTotalCoinsSpent(0);
  }, [buildAbsoluteProgressSnapshot]);

  const getSessionBaseRankLevel = useCallback(() => {
    return calculateLevel(sessionBaseRef.current.xp).level;
  }, []);

  const totalSessionWordsPlanned = useMemo(() => {
    return nodeWordPool.length + injectedToughNutWords.length;
  }, [injectedToughNutWords.length, nodeWordPool.length]);

  const currentBlastCost = useMemo(() => getBlastCost(blastsUsed), [blastsUsed]);
  const currentReviveCost = useMemo(() => getReviveCost(revivesUsed), [revivesUsed]);

  // On unmount: save partial node progress so leaving mid-game is not lost.
  // Uses keepalive:true so the request survives tab close / navigation.
  useEffect(() => {
    return () => {
      const wordsCompleted = nodeWordsSolvedRef.current;
      const nodeId = activeJourneyNodeRef.current?.nodeId;
      const alreadyClaimed = hasClaimedResultRef.current;
      const listMode = isListModeRef.current;
      const currentPapaPoints =
        sessionBaseRef.current.papaPoints +
        totalCoinsEarnedRef.current -
        totalCoinsSpentRef.current;
      const currentWordsSolved =
        sessionBaseRef.current.totalWordsSolved + totalWordsSolvedRef.current;
      const unsyncedXP = Math.max(
        0,
        totalXPEarnedRef.current - lastRemoteSyncedXPRef.current,
      );

      if (wordsCompleted > 0 && nodeId && !alreadyClaimed && !listMode) {
        logSyncEvent("unmount.node-progress", {
          nodeId,
          wordsCompleted,
          totalWords: nodeWordPoolRef.current.length,
        });
        fetch("/api/journey/node-progress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getSyncDebugHeaders(),
          },
          body: JSON.stringify({ nodeId, wordsCompleted, totalWords: nodeWordPoolRef.current.length }),
          keepalive: true,
        }).catch(() => {});
      }

      if (!alreadyClaimed && (unsyncedXP > 0 || currentWordsSolved !== lastSyncedState.current.wordsSolved || currentPapaPoints !== lastSyncedState.current.papaPoints)) {
        logSyncEvent("unmount.profile-sync", {
          journeyXPDelta: unsyncedXP,
          totalWordsSolved: currentWordsSolved,
          papaPoints: currentPapaPoints,
        });
        fetch("/api/games/hangman/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getSyncDebugHeaders(),
          },
          body: JSON.stringify({
            ...(unsyncedXP > 0 ? { journeyXPDelta: unsyncedXP } : {}),
            totalWordsSolved: currentWordsSolved,
            papaPoints: currentPapaPoints,
          }),
          keepalive: true,
        }).catch(() => {});
      }
    };
  }, [getSyncDebugHeaders, logSyncEvent]);

  // --- 4. WORD SELECTION FROM NODE POOL ---
  const getNextNodeWord = useCallback(
    (usedWords = []) => {
      if (nodeWordPool.length === 0) return null;
      const available = nodeWordPool.filter((w) => !usedWords.includes(w.word));
      // Return null when all words have been practiced — this ends the session
      if (available.length === 0) return null;
      return available[Math.floor(Math.random() * available.length)];
    },
    [nodeWordPool],
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
  } = useGameLogic(null, sessionBaseRef.current.xp, sessionBaseRef.current.xp);

  // --- 5. INIT FIRST WORD (once node words are loaded) ---
  useEffect(() => {
    if (!nodeWordsLoaded || nodeWordPool.length === 0) return;
    if (hasClaimedResult || usedWordTexts.length > 0) return;
    const firstWord = getNextNodeWord([]);
    if (firstWord) {
      setUsedWordTexts([firstWord.word]);
      initGameSession("endless", firstWord);
    }
    setSecondsElapsed(0);
    const timer = setInterval(() => setSecondsElapsed((p) => p + 1), 1000);
    return () => clearInterval(timer);
  }, [nodeWordsLoaded, nodeWordPool, hasClaimedResult, usedWordTexts, getNextNodeWord, initGameSession]);

  // Keep timer running across words
  useEffect(() => {
    if (!currentGame) return;
    setSecondsElapsed(0);
    const timer = setInterval(() => setSecondsElapsed((p) => p + 1), 1000);
    return () => clearInterval(timer);
  }, [currentGame]);

  // --- 6. GLOBAL LEVEL-UP + JOURNEY COMPLETION POPUPS ---
  useEffect(() => {
    if (sessionRank.level > sessionMaxRankLevel) {
      if (sessionRank.level > 1) {
        let reward = 0;
        for (let level = sessionMaxRankLevel + 1; level <= sessionRank.level; level += 1) {
          reward += getArenaUnlockBonus(level);
        }
        setPendingLevelReward((prev) => prev + reward);
        if (journeyBanner) {
          setQueuedLevelUp(true);
        } else {
          setShowLevelUp(true);
          playSynth("MILESTONE");
        }
      }
      setSessionMaxRankLevel(sessionRank.level);
    }
  }, [journeyBanner, playSynth, sessionMaxRankLevel, sessionRank.level]);

  useEffect(() => {
    if (!journeyBanner && queuedLevelUp) {
      setShowLevelUp(true);
      playSynth("MILESTONE");
      setQueuedLevelUp(false);
    }
  }, [journeyBanner, playSynth, queuedLevelUp]);

  const handleLevelUpClose = useCallback(async () => {
    if (pendingLevelReward > 0) {
      recordEarnedProgress(0, pendingLevelReward, 0);
      setPendingLevelReward(0);
      await requestProfileFlush({ force: true });
    }
    setShowLevelUp(false);
  }, [pendingLevelReward, recordEarnedProgress, requestProfileFlush]);

  useEffect(() => {
    if (!journeyBanner) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setJourneyBanner(null);
    }, 3400);

    return () => clearTimeout(timer);
  }, [journeyBanner]);

  // --- 7. MISTAKES ---
  useEffect(() => {
    const previousWrongGuesses = prevWrongGuessesRef.current;
    const newWrongGuesses = wrongGuesses.filter(
      (letter) => !previousWrongGuesses.includes(letter),
    );

    if (newWrongGuesses.length > 0) {
      const countedWrongGuesses = newWrongGuesses.filter((letter) => {
        if (shatterIgnoredLettersRef.current.has(letter)) {
          shatterIgnoredLettersRef.current.delete(letter);
          return false;
        }
        return true;
      });

      if (countedWrongGuesses.length > 0) {
        setGlobalMistakes((p) => p + countedWrongGuesses.length);
        playSynth("POP");
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 400);
      }
    }

    prevWrongGuessesRef.current = wrongGuesses;
  }, [wrongGuesses, playSynth]);

  useEffect(() => {
    prevWrongGuessesRef.current = [];
    shatterIgnoredLettersRef.current.clear();
    setGlobalMistakes(0);
  }, [currentGame]);

  const isGameOver = globalMistakes >= MAX_GLOBAL_LIVES;

  // --- 8. REVIVE COUNTDOWN ---
  useEffect(() => {
    let timer;
    if (isGameOver && !isReviving && !isRunEnded && !hasClaimedResult) {
      if (reviveCountdown === null) setReviveCountdown(REVIVE_WINDOW_SECONDS);
      if (reviveCountdown > 0) {
        timer = setInterval(() => setReviveCountdown((p) => p - 1), 1000);
      } else if (reviveCountdown === 0) {
        setIsRunEnded(true);
        setReviveCountdown(null);
      }
    } else {
      if (reviveCountdown !== null) setReviveCountdown(null);
    }
    return () => clearInterval(timer);
  }, [isGameOver, isReviving, isRunEnded, reviveCountdown, hasClaimedResult]);

  // --- 9. ACTIONS ---
  const handleShatter = () => {
    if (livePapaPoints < currentBlastCost) return;
    const wrongOptions = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      .split("")
      .filter((l) => !wordLetters.includes(l) && !guessedLetters.includes(l));
    if (wrongOptions.length === 0) return;
    recordSpentCoins(currentBlastCost);
    setBlastsUsed((prev) => prev + 1);
    playSynth("CORRECT");
    const toRemove = wrongOptions.sort(() => 0.5 - Math.random()).slice(0, 3);
    shatterIgnoredLettersRef.current = new Set([
      ...shatterIgnoredLettersRef.current,
      ...toRemove,
    ]);
    setGuessedLetters((p) => [...p, ...toRemove]);
  };


  const handleRevive = () => {
    if (livePapaPoints >= currentReviveCost) {
      recordSpentCoins(currentReviveCost);
      logSyncEvent("revive.flush", { cost: currentReviveCost });
      setReviveCountdown(null);
      setIsReviving(true);
      playSynth("MILESTONE");
      setHasClaimedResult(false);
      syncLock.current = false;
      void requestProfileFlush({ force: true });
      setTimeout(() => {
        setGlobalMistakes(0);
        setRevivesUsed((p) => p + 1);
        setIsReviving(false);
      }, 1200);
    }
  };

  const handleGuess = (letter) => {
    if (guessedLetters.includes(letter) || isGameOver || isTransitioning || isReviving) return;
    if (wordLetters.includes(letter)) playSynth("CORRECT");
    setGuessedLetters((p) => [...p, letter]);
  };

  // --- 10. WIN LOGIC + NODE PROGRESS ---
  useEffect(() => {
    if (isWon && !isGameOver && !transitionLock.current) {
      transitionLock.current = true;

      // XP formula: word length * 8 + rankId * 12 (list-practice defaults to rank 1)
      const rankId = isListMode ? 1 : (activeJourneyNode?.rankId || 1);
      const baseXP = (currentGame?.word?.length || 0) * 8 + rankId * 12;
      const xpGain = applyWrongGuessPenalty(baseXP, wrongGuesses.length);
      const coinGain = Math.max(5, Math.ceil(applyWrongGuessPenalty(baseXP, wrongGuesses.length) / 15));
      logSyncEvent("word.completed", {
        nodeId: activeJourneyNode?.nodeId || null,
        word: currentGame?.word || null,
        xpGain,
        coinGain,
        wrongGuesses: wrongGuesses.length,
      });

      setCurrentWordXP(xpGain);
      setCurrentWordCoins(coinGain);
      recordEarnedProgress(xpGain, coinGain, 1);

      if (currentGame?.isToughNutInjected && wrongGuesses.length === 0) {
        void removeToughNutWord(currentGame.word);
      }

      const isNodePoolWord = nodeWordPool.some((entry) => entry.word === currentGame?.word);
      if (isNodePoolWord) {
        recordNodeWordSolved(1);
      }

      // Queue Tough Nuts in memory and flush them at checkpoints.
      if (wrongGuesses.length >= 3 && currentGame?.word && !profile.isGhost) {
        queueToughNutWord(currentGame.word, currentGame.hint || "");
      }

      setIsTransitioning(true);
      // Tough Nut injection: every 4th word, try to inject a tough nut word
      // This is decoupled from pool exhaustion — if a tough nut is available and it's injection time, offer it
      let nextWord = null;
      if (!isListMode && usedWordTexts.length > 0 && usedWordTexts.length % 4 === 0 && toughNutWords.length > 0) {
        const usedSet = new Set(usedWordTexts.map((w) => w.toLowerCase()));
        const availableToughNuts = toughNutWords.filter((tn) => !usedSet.has(tn.word.toLowerCase()));
        if (availableToughNuts.length > 0) {
          const tn = availableToughNuts[Math.floor(Math.random() * availableToughNuts.length)];
          const normalizedToughNutWord = tn.word.toLowerCase();
          const existsInNodePool = nodeWordPool.some(
            (entry) => entry.word.toLowerCase() === normalizedToughNutWord,
          );

          if (!existsInNodePool) {
            setInjectedToughNutWords((prev) => {
              if (prev.includes(normalizedToughNutWord)) {
                return prev;
              }
              return [...prev, normalizedToughNutWord];
            });
          }

          nextWord = {
            word: tn.word,
            hint: tn.wordData || "",
            category: "🔥 Tough Nut",
            isToughNutInjected: true,
          };
        }
      }
      // If injection didn't happen, get the next regular word from the pool
      if (!nextWord) {
        nextWord = getNextNodeWord(usedWordTexts);
      }

      if (nextWord) {
        setUsedWordTexts((p) => [...p, nextWord.word]);
        setTimeout(() => setGuessedLetters([]), 500);
        setTimeout(() => initGameSession("endless", nextWord), 900);
      } else {
        // All words exhausted — this is the actual node clear moment.
        const bonusXP = 50 * rankId;
        const bonusCoins = 10 * rankId;
        recordEarnedProgress(bonusXP, bonusCoins, 0);
        setCurrentWordXP(bonusXP);
        setCurrentWordCoins(bonusCoins);

        let nodeCompletionRequest = Promise.resolve();

        if (activeJourneyNode?.nodeId) {
          logSyncEvent("node.complete.pending", {
            nodeId: activeJourneyNode.nodeId,
            wordsCompleted: nodeWordsSolvedRef.current,
            totalWords: nodeWordPool.length,
          });
          nodeCompletionRequest = fetch("/api/journey/node-progress", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...getSyncDebugHeaders(),
            },
            body: JSON.stringify({
              nodeId: activeJourneyNode.nodeId,
              wordsCompleted: nodeWordsSolvedRef.current,
              totalWords: nodeWordPool.length,
            }),
          })
            .then((r) => r.json())
            .then(async (data) => {
              if (data.success) {
                setNodeProgress(data.nodeProgress);
                setNextJourneyNode(
                  data.nextNodeId
                    ? {
                        nodeId: data.nextNodeId,
                        rankId: parseInt(data.nextNodeId.split("-")[0], 10),
                      }
                    : null,
                );
                if (data.arenaCompleted && data.arenaBonusXP) {
                  setArenaCompleted(true);
                  setArenaBonusXP(data.arenaBonusXP);
                  recordEarnedProgress(
                    data.arenaBonusXP,
                    data.arenaBonusCoins || 0,
                    0,
                  );
                  setJourneyBanner({
                    type: "arena",
                    title: `Arena ${activeJourneyNode?.rankId} Cleared`,
                    subtitle: `All five nodes mastered. Bonus +${data.arenaBonusXP} XP secured.`,
                  });
                } else {
                  setJourneyBanner({
                    type: "node",
                    title: `Node ${activeJourneyNode?.nodeId} Cleared`,
                    subtitle: data.nextNodeId
                      ? `Next stop unlocked: ${data.nextNodeId}`
                      : "This route is fully completed.",
                  });
                }
              }
            })
            .catch(() => {});
        }

        void nodeCompletionRequest.finally(() => {
          setIsRunEnded(true);
        });
      }
      setTimeout(() => {
        setIsTransitioning(false);
        transitionLock.current = false;
      }, TRANSITION_MS);
    }
  }, [activeJourneyNode, currentGame, getNextNodeWord, getSyncDebugHeaders, initGameSession, isGameOver, isListMode, isWon, logSyncEvent, nodeWordPool, profile.isGhost, queueToughNutWord, recordEarnedProgress, recordNodeWordSolved, removeToughNutWord, requestProfileFlush, setGuessedLetters, setIsTransitioning, toughNutWords, usedWordTexts, wrongGuesses]);

  // --- 11. FINAL SYNC ---
  useEffect(() => {
    let retryTimer;
    const shouldSync = isRunEnded || (isGameOver && !isReviving && reviveCountdown === 0);
    if (shouldSync && !hasClaimedResult && !syncLock.current) {
      syncLock.current = true;
      logSyncEvent("final-sync.triggered", {
        isRunEnded,
        isGameOver,
        reviveCountdown,
      });
      Promise.all([
        requestProfileFlush({ force: true }),
        flushQueuedToughNuts(),
      ]).then(([didSync]) => {
        if (didSync) {
          setHasClaimedResult(true);
          if (profile.isGhost && triggerSavePrompt) {
            setTimeout(() => triggerSavePrompt(), 1500);
          }
          return;
        }

        syncLock.current = false;
        retryTimer = setTimeout(() => {
          setFinalSyncAttempt((attempt) => attempt + 1);
        }, 4000);
      });
    }
    return () => clearTimeout(retryTimer);
  }, [finalSyncAttempt, flushQueuedToughNuts, hasClaimedResult, isGameOver, isReviving, isRunEnded, logSyncEvent, profile.isGhost, requestProfileFlush, reviveCountdown, triggerSavePrompt]);

  // --- 11. PERIODIC SYNC (75s fallback for logged-in users) ---
  // Prevents progress loss if browser closes unexpectedly, while debouncing to avoid DB hammering
  useEffect(() => {
    if (profile.isGhost || !syncToDatabase || isRunEnded) {
      if (periodicSyncTimer.current) {
        clearInterval(periodicSyncTimer.current);
        periodicSyncTimer.current = null;
      }
      return;
    }

    periodicSyncTimer.current = setInterval(() => {
      if (!hasClaimedResultRef.current) {
        logSyncEvent("periodic-sync.tick", {});
        void requestProfileFlush();
      }
    }, 75000);

    return () => {
      if (periodicSyncTimer.current) {
        clearInterval(periodicSyncTimer.current);
        periodicSyncTimer.current = null;
      }
    };
  }, [isRunEnded, logSyncEvent, profile.isGhost, requestProfileFlush, syncToDatabase]);

  // --- 12. CLEANUP on unmount ---
  useEffect(() => {
    return () => {
      if (periodicSyncTimer.current) {
        clearInterval(periodicSyncTimer.current);
        periodicSyncTimer.current = null;
      }
    };
  }, []);

  const handleRestart = useCallback(() => {
    rebaseSessionProgress();
    setGlobalMistakes(0);
    setUsedWordTexts([]);
    setHasClaimedResult(false);
    setIsRunEnded(false);
    setBlastsUsed(0);
    setRevivesUsed(0);
    setGuessedLetters([]);
    setReviveCountdown(null);
    setNodeProgress(null);
    setArenaCompleted(false);
    setArenaBonusXP(0);
    setInjectedToughNutWords([]);
    setPendingLevelReward(0);
    setNextJourneyNode(null);
    setJourneyBanner(null);
    setSessionMaxRankLevel(getSessionBaseRankLevel());
    syncLock.current = false;
    transitionLock.current = false;
    const firstWord = getNextNodeWord([]);
    if (firstWord) {
      setUsedWordTexts([firstWord.word]);
      initGameSession("endless", firstWord);
    }
  }, [getNextNodeWord, getSessionBaseRankLevel, initGameSession, rebaseSessionProgress, setGuessedLetters]);

  const handleContinueJourney = useCallback(() => {
    if (!nextJourneyNode) return;

    rebaseSessionProgress();
    setActiveJourneyNode(nextJourneyNode);
    setNodeWordPool([]);
    setNodeTitle("Loading...");
    setNodeWordsLoaded(false);
    setGlobalMistakes(0);
    setUsedWordTexts([]);
    setHasClaimedResult(false);
    setNodeProgress(null);
    setArenaCompleted(false);
    setArenaBonusXP(0);
    setInjectedToughNutWords([]);
    setPendingLevelReward(0);
    setNextJourneyNode(null);
    setJourneyBanner(null);
    setIsRunEnded(false);
    setBlastsUsed(0);
    setRevivesUsed(0);
    setReviveCountdown(null);
    setCurrentWordXP(0);
    setCurrentWordCoins(0);
    setQueuedLevelUp(false);
    setSessionMaxRankLevel(getSessionBaseRankLevel());
    syncLock.current = false;
    transitionLock.current = false;
  }, [getSessionBaseRankLevel, nextJourneyNode, rebaseSessionProgress]);

  // --- LOADING STATE ---
  if (!nodeWordsLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto" />
          <p className="text-sm font-black uppercase tracking-widest text-zinc-400">
            Loading Node Words...
          </p>
        </div>
      </div>
    );
  }

  if (nodeWordPool.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4 p-8">
          <p className="text-4xl">📭</p>
          <p className="font-black text-xl text-zinc-700 dark:text-zinc-300">
            No words in this node yet
          </p>
          <button
            onClick={onQuit}
            className="px-6 py-3 rounded-2xl bg-zinc-900 text-white font-black text-sm"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-1 md:space-y-2 relative w-full max-w-5xl mx-auto md:px-0 pb-5 md:pb-10">
      {/* Node Progress Bar (replaces XP progress bar) */}
      <SessionProgress
        totalXPEarned={totalXPEarned}
        xpPercent={xpPercent}
        isBreakingXPRecord={false}
        isRefilling={false}
        highestXP={currentJourneyXP}
        accent={sessionRank.color}
        customLabel={isListMode ? "List Progress" : "Journey XP"}
        footerLabel={`Journey XP: ${currentJourneyXP.toLocaleString()}`}
      />

      <GameHeader
        gameMode="endless"
        category={nodeTitle}
        onQuit={onQuit}
        playerRank={sessionRank}
        wrongCount={globalMistakes}
        maxTries={MAX_GLOBAL_LIVES}
        streak={totalWordsSolved}
        papaPoints={livePapaPoints}
        journeyXP={currentJourneyXP}
      />

      {/* Journey node / list badge — responsive and compact on mobile */}
      <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-2xl bg-purple-500/10 border border-purple-500/20 self-start text-xs md:text-sm">
        <Trophy size={12} className="md:size-[14px] text-purple-600 dark:text-purple-400 flex-shrink-0" />
        {isListMode ? (
          <span className="font-black uppercase tracking-wider text-purple-700 dark:text-purple-400 truncate">
            List · <span className="hidden xs:inline">{nodeTitle}</span>
          </span>
        ) : (
          <span className="font-black uppercase tracking-wider text-purple-700 dark:text-purple-400 truncate">
            <span className="hidden sm:inline">{ARENAS[activeJourneyNode?.rankId]?.name || `Arena ${activeJourneyNode?.rankId}`}</span>
            <span className="sm:hidden">{ARENAS[activeJourneyNode?.rankId]?.name?.charAt(0) || `A${activeJourneyNode?.rankId}`}</span>
            {' · '}Node {activeJourneyNode?.nodeId}
            {!isListMode && nodeProgress && (
              <span className="ml-2 text-purple-600 dark:text-purple-300">
                {nodeProgress.percent}%{nodeProgress.completed ? ' ✓' : ''}
              </span>
            )}
          </span>
        )}
      </div>

      {journeyBanner && (
        <JourneyMilestoneBanner
          type={journeyBanner.type}
          title={journeyBanner.title}
          subtitle={journeyBanner.subtitle}
          accent={arenaTier.color}
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
            showMentorMsg={false}
            currentRankName={sessionRank.name}
            rankLevel={sessionRank.level}
            streak={totalWordsSolved}
            wordLength={currentGame?.word?.length || 0}
            enableRefillFX={false}
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
                Word {Math.min(totalWordsSolved + 1, totalSessionWordsPlanned)} / {totalSessionWordsPlanned}
              </span>
            </div>

            <WordDisplay
              wordLetters={wordLetters}
              guessedLetters={guessedLetters}
              isLost={isRunEnded || (isGameOver && !isReviving)}
              isWon={isWon}
              wrongCount={globalMistakes}
              xpGained={currentWordXP}
              coinsGained={currentWordCoins}
              accent={sessionRank.color}
            />

            {currentGame?.hint && (
                <div className="mt-1 md:mt-2 flex flex-col items-center">
                  <div className="bg-white dark:bg-zinc-800 px-4 py-2 rounded-xl border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] max-w-[280px]">
                    <p className="text-[11px] font-bold italic text-zinc-600 dark:text-zinc-300 text-center">
                      &ldquo;{currentGame.hint}&rdquo;
                    </p>
                  </div>
                </div>
              )}
          </div>

          <div className="min-h-[220px]">
            {(!isGameOver && !isRunEnded) || isReviving ? (
              <div className="space-y-3 md:space-y-6">
                <VirtualKeyboard
                  guessedLetters={guessedLetters}
                  wordLetters={wordLetters}
                  onGuess={handleGuess}
                  disabled={isTransitioning || isReviving}
                  accent={sessionRank.color}
                />
                <div className="flex justify-center">
                  <button
                    onClick={handleShatter}
                    disabled={livePapaPoints < currentBlastCost}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-50 border-2 border-zinc-900 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all group disabled:opacity-50 disabled:grayscale"
                  >
                    <Bomb size={16} className="text-red-400 group-hover:text-red-600 transition-colors" />
                    <span className="text-[10px] font-black uppercase italic text-red-600">
                      Blast ({currentBlastCost})
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <GameResults
                isWon={isRunEnded && nodeWordsSolved === nodeWordPool.length}
                word={isRunEnded && nodeWordsSolved === nodeWordPool.length ? "Node Complete!" : "Out of Fuel"}
                mode="journey"
                onRestart={handleRestart}
                onContinueJourney={handleContinueJourney}
                onBackToJourney={onQuit}
                streak={totalWordsSolved}
                xpEarned={totalXPEarned}
                coinsEarned={totalCoinsEarned}
                onRevive={handleRevive}
                onEndRun={() => setIsRunEnded(true)}
                isRunEnded={isRunEnded}
                revivesUsed={revivesUsed}
                reviveCost={currentReviveCost}
                countdown={reviveCountdown}
                journeyProgress={nodeProgress}
                journeyNode={activeJourneyNode}
                arenaCompleted={arenaCompleted}
                arenaBonusXP={arenaBonusXP}
                nextNodeId={nextJourneyNode?.nodeId || null}
              />
            )}
          </div>
        </motion.div>
      </div>

      <LevelUpModal
        isOpen={showLevelUp}
        rank={sessionRank}
        onClose={handleLevelUpClose}
      />
    </div>
  );
}
