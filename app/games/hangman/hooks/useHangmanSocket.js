import { useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

// Hardcoded for your specific GitHub codespace environment
const socket = io('https://crispy-computing-machine-x5xxrx74gv43p6p5-3001.app.github.dev', {
  autoConnect: false,
  transports: ['websocket']
});

export function useHangmanSocket({ 
  profile, 
  initGameSession, 
  deductCoins, 
  setOpponent, 
  setGameState, 
  setOpponentWon, 
  applyOnlineResults,
  setHasClaimedResult 
}) {
  
  const joinQueue = useCallback(() => {
    socket.connect();
    socket.emit('join-queue', { 
      username: profile.name, 
      currentCoins: profile.papaPoints, 
      currentXP: profile.xp 
    });
  }, [profile.name, profile.papaPoints, profile.xp]);

  const disconnect = useCallback(() => {
    if (socket.connected) {
      socket.disconnect();
    }
  }, []);

  const sendGuess = useCallback((roomId, letter, score) => {
    socket.emit('send-guess', { roomId, letter, score });
  }, []);

  const emitFinished = useCallback((roomId, winnerName) => {
    socket.emit('game-finished', { roomId, winnerName });
  }, []);

  useEffect(() => {
    // 1. Fee Deduction (Matched to Server ENTRY_FEE)
    socket.on('match-started', (data) => {
      deductCoins(data.entryFee);
    });

    // 2. Match Found - Start the game
    socket.on('match-found', (data) => {
      setHasClaimedResult(false); 
      setOpponentWon(false);      
      
      setOpponent({ 
        name: data.opponentName, 
        progress: 0, 
        roomId: data.roomId 
      });

      initGameSession('online', { word: data.word, category: data.category });
      setGameState('playing');
    });

    // 3. Update Opponent Progress
    socket.on('opponent-guess', (data) => {
      setOpponent(prev => prev ? { ...prev, progress: data.score } : null);
    });

    // 4. Opponent Win Event
    socket.on('opponent-won', () => setOpponentWon(true));

    // 5. Final Results Sync - UPDATED to match Server naming & Boolean logic
    socket.on('game-results-synced', (data) => {
      const isMeWinner = profile.name === data.winnerName;
      
      // We pass only the boolean to applyOnlineResults.
      // The ProfileContext already knows the base rewards and will add streak bonuses.
      applyOnlineResults(isMeWinner);
    });

    return () => {
      socket.off('match-started');
      socket.off('match-found');
      socket.off('opponent-guess');
      socket.off('opponent-won');
      socket.off('game-results-synced');
    };
  }, [
    profile.name, 
    initGameSession, 
    deductCoins, 
    setOpponent, 
    setGameState, 
    setOpponentWon, 
    applyOnlineResults,
    setHasClaimedResult 
  ]);

  return { 
    socket, 
    joinQueue, 
    disconnect, 
    sendGuess, 
    emitFinished 
  };
}