// games/hangman/index.js
'use client'
import { useState } from 'react';
import ModeSelector from './components/ModeSelector';
import GameBoard from './components/GameBoard'; // Your actual game UI
import OnlineLobby from './components/OnlineLobby'; // Matchmaking UI

export function Hangman() {
  const [gameMode, setGameMode] = useState(null); // 'classic', 'blitz', 'online'
  const [gameState, setGameState] = useState('menu'); // 'menu', 'lobby', 'playing'

  const handleStartGame = (mode) => {
    setGameMode(mode);
    if (mode === 'online') {
      setGameState('lobby');
    } else {
      setGameState('playing');
    }
  };

  return (
    <div className="w-full">
      {gameState === 'menu' && (
        <ModeSelector onSelect={handleStartGame} />
      )}

      {gameState === 'lobby' && (
        <OnlineLobby onMatchFound={() => setGameState('playing')} />
      )}

      {gameState === 'playing' && (
        <GameBoard mode={gameMode} />
      )}
    </div>
  );
}