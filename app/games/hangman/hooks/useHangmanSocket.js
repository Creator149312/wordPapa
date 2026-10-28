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
  onRematchRequested,
  onRematchWaiting,
  onRematchAccepted,
  onOpponentLeftMatch,
  onSeriesResultsSynced,
  onMatchEnded,
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

  const emitFinished = useCallback((roomId, winnerName, reason = "word_solved") => {
    if (socket?.connected && roomId) {
      socket.emit('game-finished', { roomId, winnerName, winnerId: socket.id, reason });
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

  const createCustomRoom = useCallback(() => {
    if (!socket) return;
    if (!socket.connected) socket.connect();
    socket.emit('create-custom-room', { username: profile?.name || "Player" });
  }, [socket, profile?.name]);

  const joinCustomRoom = useCallback((roomCode) => {
    if (!socket) return;
    if (!socket.connected) socket.connect();
    socket.emit('join-custom-room', { roomCode, username: profile?.name || "Player" });
  }, [socket, profile?.name]);

  // Instant Rematch & Best-of-3 Emitters
  const requestRematch = useCallback((roomId) => {
    if (socket?.connected && roomId) {
      socket.emit('request-rematch', { roomId });
    }
  }, [socket]);

  const leaveMatch = useCallback((roomId) => {
    if (socket?.connected && roomId) {
      socket.emit('leave-match', { roomId });
    }
  }, [socket]);

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
        roomId: data.roomId,
        isBot: Boolean(data.isBot),
      });

      // Pass the complete match payload to parent
      initGameSession?.('online', { 
        word: data.word, 
        category: data.category,
        roomId: data.roomId,
        opponentName: data.opponentName,
        opponentId: data.opponentId,
        isBot: Boolean(data.isBot),
        seriesScore: data.seriesScore,
      });
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

    // 8.5 Authoritative Match Ended (Simultaneous on both ends)
    socket.on('match-ended', (data) => {
      onMatchEnded?.(data);
    });

    // 9. Final Results Sync
    socket.on('game-results-synced', (data) => {
      const isMeWinner = data.winnerId 
        ? socket.id === data.winnerId 
        : profile?.name === data.winnerName;
      applyOnlineResults?.(isMeWinner);
      if (data.seriesScore) {
        onSeriesResultsSynced?.(data.seriesScore);
      }
    });

    // 10. Instant Rematch Handshake
    socket.on('rematch-requested', (data) => {
      onRematchRequested?.(data);
    });

    socket.on('rematch-waiting', () => {
      onRematchWaiting?.();
    });

    socket.on('rematch-accepted', (data) => {
      onRematchAccepted?.(data);
    });

    socket.on('opponent-left-match', () => {
      onOpponentLeftMatch?.();
    });

    socket.on('rematch-declined', () => {
      onOpponentLeftMatch?.();
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
      socket.off('match-ended');
      socket.off('game-results-synced');
      socket.off('rematch-requested');
      socket.off('rematch-waiting');
      socket.off('rematch-accepted');
      socket.off('opponent-left-match');
      socket.off('rematch-declined');
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
    onRematchRequested,
    onRematchWaiting,
    onRematchAccepted,
    onOpponentLeftMatch,
    onSeriesResultsSynced,
    onMatchEnded,
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
    createCustomRoom,
    joinCustomRoom,
    requestRematch,
    leaveMatch,
  };
}