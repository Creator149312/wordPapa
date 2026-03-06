'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { io } from 'socket.io-client';

// Components
import ModeSelector from './components/ModeSelector';
import LevelUpModal from './components/LevelUpModal';
import HangmanDrawing from './components/HangmanDrawing';
import GameResults from './components/GameResults';
import VirtualKeyboard from './components/VirtualKeyboard';
import LevelBar from './components/LevelBar';
import GameHeader from './components/GameHeader';
import WordDisplay from './components/WordDisplay';
import OnlineRaceTracker from './components/OnlineRaceTracker';
import OnlineLobby from './components/OnlineLobby';

// Hooks & Lib
import { useWordPapaProfile } from './hooks/useWordPapaProfile';
import { calculateLevel } from './lib/progression';

// Initialize socket outside component to prevent multiple connections on re-render
const socket = io('https://crispy-computing-machine-x5xxrx74gv43p6p5-3001.app.github.dev', { autoConnect: false, transports: ['websocket'] } // Forces websocket for better compatibility in cloud environments
);

const WORDS_POOL = [
  { word: "HAMLET", category: "Books" },
  { word: "EINSTEIN", category: "People" },
  { word: "FERRARI", category: "Cars" },
  { word: "PINEAPPLE", category: "Fruits" }
];

export default function Hangman() {
  // 1. STATE MANAGEMENT
  const [gameMode, setGameMode] = useState(null);
  const [gameState, setGameState] = useState('menu');
  const [hasClaimedXP, setHasClaimedXP] = useState(false);
  const [opponent, setOpponent] = useState(null); // Will store { name, progress, roomId }

  const { profile, addWin, showLevelUp, setShowLevelUp } = useWordPapaProfile();
  const currentRank = useMemo(() => calculateLevel(profile.xp), [profile.xp]);

  const [currentGame, setCurrentGame] = useState(null);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isAnimating, setIsAnimating] = useState(false);

  // 2. DERIVED STATE
  const wordLetters = useMemo(() => currentGame?.word.toUpperCase().split('') || [], [currentGame]);
  const wrongGuesses = useMemo(() => guessedLetters.filter(l => !wordLetters.includes(l)), [guessedLetters, wordLetters]);

  const correctGuessesCount = useMemo(() =>
    wordLetters.filter(letter => guessedLetters.includes(letter)).length,
    [wordLetters, guessedLetters]);

  const isWon = wordLetters.length > 0 && wordLetters.every(l => guessedLetters.includes(l));
  const isLost = wrongGuesses.length >= 6 || ((gameMode === 'blitz' || gameMode === 'online') && timeLeft <= 0);
  const isGameOver = isWon || isLost;

  // 3. ACTIONS

  // Updated to accept optional server data for online sync
  const initGameSession = useCallback((mode, serverData = null) => {
    if (serverData) {
      setCurrentGame({ word: serverData.word, category: serverData.category });
    } else {
      const next = WORDS_POOL[Math.floor(Math.random() * WORDS_POOL.length)];
      setCurrentGame({ word: next.word, category: next.category });
    }
    setGuessedLetters([]);
    setHasClaimedXP(false);
    setTimeLeft(mode === 'online' ? 120 : 60);
  }, []);

  const startNewGame = useCallback((resetToMenu = false) => {
    if (resetToMenu) {
      if (socket.connected) socket.disconnect();
      setGameMode(null);
      setGameState('menu');
      setOpponent(null);
      setCurrentGame(null);
    } else {
      initGameSession(gameMode);
      setGameState('playing');
    }
  }, [gameMode, initGameSession]);

  const handleModeSelect = (mode) => {
    setGameMode(mode);
    if (mode === 'online') {
      socket.connect();
      setGameState('lobby');
    } else {
      initGameSession(mode);
      setGameState('playing');
    }
  };

  // 4. SERVER EVENT LISTENERS
  useEffect(() => {
    // Triggered when server pairs two players
    socket.on('match-found', (data) => {
      // data: { roomId, opponentName, word, category }
      setOpponent({ name: data.opponentName, progress: 0, roomId: data.roomId });
      initGameSession('online', { word: data.word, category: data.category });
      setGameState('playing');
    });

    // Triggered when opponent finds a correct letter
    socket.on('opponent-progress', (data) => {
      // data: { score }
      setOpponent(prev => prev ? { ...prev, progress: data.score } : null);
    });

    return () => {
      socket.off('match-found');
      socket.off('opponent-progress');
    };
  }, [initGameSession]);

  const handleGuess = useCallback((letter) => {
    const L = letter.toUpperCase();
    if (guessedLetters.includes(L) || isGameOver || gameState !== 'playing') return;

    const newGuessedLetters = [...guessedLetters, L];
    setGuessedLetters(newGuessedLetters);

    // Emit progress to server if in Online mode
    if (gameMode === 'online' && opponent?.roomId) {
      const newScore = wordLetters.filter(l => newGuessedLetters.includes(l)).length;
      socket.emit('send-guess', {
        roomId: opponent.roomId,
        score: newScore
      });
    }

    if (wordLetters.includes(L)) {
      if (gameMode === 'blitz') setTimeLeft(prev => prev + 5);
    } else {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }
  }, [guessedLetters, isGameOver, gameState, wordLetters, gameMode, opponent]);

  // 5. EFFECTS

  // XP Claiming
  useEffect(() => {
    if (isWon && !hasClaimedXP) {
      addWin(gameMode);
      setHasClaimedXP(true);
    }
  }, [isWon, hasClaimedXP, gameMode, addWin]);

  // Keyboard Listeners
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key.match(/^[a-zA-Z]$/)) handleGuess(e.key);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleGuess]);

  // Timer Logic
  useEffect(() => {
    if (!['blitz', 'online'].includes(gameMode) || isGameOver || gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameMode, isGameOver, gameState]);

  // 6. RENDER LOGIC
  if (gameState === 'menu') {
    return <ModeSelector onSelect={handleModeSelect} />;
  }

  if (gameState === 'lobby') {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <LevelBar profile={profile} />
        <OnlineLobby
          socket={socket}
          profile={profile}
          onCancel={() => startNewGame(true)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <LevelBar profile={profile} />

      <Card className="p-8 md:p-12 rounded-[2.5rem] border-2 border-gray-100 dark:border-gray-800 shadow-2xl bg-white dark:bg-gray-900 relative overflow-hidden">

        <GameHeader
          gameMode={gameMode}
          category={currentGame?.category}
          timeLeft={timeLeft}
          onQuit={() => startNewGame(true)}
        />

        {gameMode === 'online' && opponent && (
          <OnlineRaceTracker
            myCount={correctGuessesCount}
            oppCount={opponent.progress}
            total={wordLetters.length}
            oppName={opponent.name}
          />
        )}

        <div className="flex flex-col items-center space-y-12">
          <HangmanDrawing errorCount={wrongGuesses.length} isAnimating={isAnimating} />

          <WordDisplay
            wordLetters={wordLetters}
            guessedLetters={guessedLetters}
            isLost={isLost}
            isWon={isWon}
          />

          {!isGameOver ? (
            <VirtualKeyboard
              guessedLetters={guessedLetters}
              wordLetters={wordLetters}
              onGuess={handleGuess}
            />
          ) : (
            <GameResults
              isWon={isWon}
              word={currentGame?.word}
              category={currentGame?.category}
              guessedLetters={guessedLetters}
              mode={gameMode}
              onRestart={() => startNewGame(true)}
              myScore={correctGuessesCount}
              oppScore={opponent?.progress || 0}
              oppName={opponent?.name}
            />
          )}
        </div>
      </Card>

      <LevelUpModal
        isOpen={showLevelUp}
        rank={currentRank}
        onClose={() => setShowLevelUp(false)}
      />
    </div>
  );
}