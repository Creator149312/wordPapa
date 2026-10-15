import { useEffect, useCallback, useMemo } from 'react';
import { io } from 'socket.io-client';

const getSocketUrl = () => {
  if (process.env.NEXT_PUBLIC_SOCKET_URL) {
    return process.env.NEXT_PUBLIC_SOCKET_URL;
  }
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Handle GitHub Codespace forwarded port pattern
    if (hostname.includes('.app.github.dev')) {
      return window.location.origin.replace(/-\d{4}\.app\.github\.dev/, '-3001.app.github.dev');
    }
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3001';
    }
    return window.location.origin;
  }
  return 'http://localhost:3001';
};

// Singleton socket instance with dynamic host resolution
let socketInstance = null;

const getSocket = () => {
  if (!socketInstance && typeof window !== 'undefined') {
    socketInstance = io(getSocketUrl(), {
      autoConnect: false,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      timeout: 10000,
    });
  }
  return socketInstance;
};

export function useHangmanSocket({ 
  profile, 
  initGameSession, 
  deductCoins, 
  setOpponent, 
  setGameState, 
  setOpponentWon, 
  applyOnlineResults,
  setHasClaimedResult,
  onOpponentSpell,
  onOpponentShield,
  onOpponentWrongCount,
  onOpponentTaunt,
}) {
  const socket = useMemo(() => getSocket(), []);

  const joinQueue = useCallback(() => {
    if (!socket) return;
    if (!socket.connected) socket.connect();
    socket.emit('join-queue', { 
      username: profile?.name || "Player", 
      currentCoins: profile?.papaPoints || 0, 
      currentXP: profile?.xp || 0 
    });
  }, [socket, profile?.name, profile?.papaPoints, profile?.xp]);

  const disconnect = useCallback(() => {
    if (socket?.connected) {
      socket.disconnect();
    }
  }, [socket]);

  const sendGuess = useCallback((roomId, letter, score) => {
    if (socket?.connected) {
      socket.emit('send-guess', { roomId, letter, score });
    }
  }, [socket]);

  const emitFinished = useCallback((roomId, winnerName) => {
    if (socket?.connected) {
      socket.emit('game-finished', { roomId, winnerName });
    }
  }, [socket]);

  // Clash Duel: Tactical Spells & Defense Emitters
  const castSpell = useCallback((roomId, spellId) => {
    if (socket?.connected) {
      socket.emit('cast-spell', { roomId, spellId, casterName: profile?.name || "Player" });
    }
  }, [socket, profile?.name]);

  const sendShieldState = useCallback((roomId, active) => {
    if (socket?.connected) {
      socket.emit('shield-state', { roomId, active });
    }
  }, [socket]);

  const sendWrongCount = useCallback((roomId, wrongCount) => {
    if (socket?.connected) {
      socket.emit('wrong-guess-count', { roomId, wrongCount });
    }
  }, [socket]);

  const sendTaunt = useCallback((roomId, emoji) => {
    if (socket?.connected) {
      socket.emit('send-taunt', { roomId, emoji, senderName: profile?.name || "Player" });
    }
  }, [socket, profile?.name]);

  useEffect(() => {
    if (!socket) return;

    // 1. Fee Deduction (Matched to Server ENTRY_FEE)
    socket.on('match-started', (data) => {
      deductCoins?.(data.entryFee);
    });

    // 2. Match Found - Start the game
    socket.on('match-found', (data) => {
      setHasClaimedResult?.(false); 
      setOpponentWon?.(false);      
      
      setOpponent?.({ 
        name: data.opponentName, 
        progress: 0, 
        wrongCount: 0,
        isShielded: false,
        isFrozen: false,
        roomId: data.roomId 
      });

      initGameSession?.('online', { word: data.word, category: data.category });
      setGameState?.('playing');
    });

    // 3. Update Opponent Progress
    socket.on('opponent-guess', (data) => {
      setOpponent?.(prev => prev ? { ...prev, progress: data.score } : null);
    });

    // 4. Opponent Win Event
    socket.on('opponent-won', () => setOpponentWon?.(true));

    // 5. Clash Duel: Opponent Cast Spell
    socket.on('opponent-spell-cast', (data) => {
      onOpponentSpell?.(data);
    });

    // 6. Clash Duel: Opponent Shield State
    socket.on('opponent-shield-state', (data) => {
      setOpponent?.(prev => prev ? { ...prev, isShielded: data.active } : null);
      onOpponentShield?.(data.active);
    });

    // 7. Clash Duel: Opponent Wrong Count
    socket.on('opponent-wrong-count', (data) => {
      setOpponent?.(prev => prev ? { ...prev, wrongCount: data.wrongCount } : null);
      onOpponentWrongCount?.(data.wrongCount);
    });

    // 8. Clash Duel: Opponent Taunt
    socket.on('opponent-taunt', (data) => {
      onOpponentTaunt?.(data);
    });

    // 9. Final Results Sync
    socket.on('game-results-synced', (data) => {
      const isMeWinner = profile?.name === data.winnerName;
      applyOnlineResults?.(isMeWinner);
    });

    return () => {
      socket.off('match-started');
      socket.off('match-found');
      socket.off('opponent-guess');
      socket.off('opponent-won');
      socket.off('opponent-spell-cast');
      socket.off('opponent-shield-state');
      socket.off('opponent-wrong-count');
      socket.off('opponent-taunt');
      socket.off('game-results-synced');
    };
  }, [
    socket,
    profile?.name, 
    initGameSession, 
    deductCoins, 
    setOpponent, 
    setGameState, 
    setOpponentWon, 
    applyOnlineResults,
    setHasClaimedResult,
    onOpponentSpell,
    onOpponentShield,
    onOpponentWrongCount,
    onOpponentTaunt,
  ]);

  return { 
    socket, 
    joinQueue, 
    disconnect, 
    sendGuess, 
    emitFinished,
    castSpell,
    sendShieldState,
    sendWrongCount,
    sendTaunt,
  };
}