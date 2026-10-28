const io = require('socket.io')(3001, {
  cors: { origin: "*" },
  pingTimeout: 30000,
  pingInterval: 15000
});

console.log("---------------------------------------");
console.log("🚀 WordPapa 1v1 Arena: Server Online");
console.log("---------------------------------------");

// Rule 4: High-Stakes Entry
const ENTRY_FEE = 10; 
const BASE_WIN_PRIZE = 20; 
const BASE_XP_WIN = 25;    
const XP_LOSS = 5;         

// Forfeit Rule: 3 seconds
const RECONNECT_GRACE_PERIOD = 3000; 

// Rule 3: Match Duration (90s Regulation + 30s Sudden Death Overtime = 120s Max)
const MAX_MATCH_DURATION = 120000; 

// Rule 1: Shared Word Pool (112 Balanced 6-10 Letter Words Across 8 Categories)
const ONLINE_WORDS = [
  // 1. Space & Astronomy (14 words)
  { word: "JUPITER", category: "Space" },
  { word: "GALAXY", category: "Space" },
  { word: "TELESCOPE", category: "Space" },
  { word: "ASTEROID", category: "Space" },
  { word: "SUPERNOVA", category: "Space" },
  { word: "UNIVERSE", category: "Space" },
  { word: "CELESTIAL", category: "Space" },
  { word: "HEAVENS", category: "Space" },
  { word: "DIMENSION", category: "Space" },
  { word: "COSMOLOGY", category: "Space" },
  { word: "NEBULA", category: "Space" },
  { word: "ASTRONOMY", category: "Space" },
  { word: "SATELLITE", category: "Space" },
  { word: "ORBITAL", category: "Space" },

  // 2. Animals & Wildlife (14 words)
  { word: "PLATYPUS", category: "Animals" },
  { word: "CHAMELEON", category: "Animals" },
  { word: "DOLPHIN", category: "Animals" },
  { word: "KANGAROO", category: "Animals" },
  { word: "FLAMINGO", category: "Animals" },
  { word: "OCTOPUS", category: "Animals" },
  { word: "CHEETAH", category: "Animals" },
  { word: "GIRAFFE", category: "Animals" },
  { word: "PENGUIN", category: "Animals" },
  { word: "GORILLA", category: "Animals" },
  { word: "HAMSTER", category: "Animals" },
  { word: "LEOPARD", category: "Animals" },
  { word: "ELEPHANT", category: "Animals" },
  { word: "BUFFALO", category: "Animals" },

  // 3. Nature & Elements (14 words)
  { word: "WILDERNESS", category: "Nature" },
  { word: "STREAM", category: "Nature" },
  { word: "VALLEY", category: "Nature" },
  { word: "SHADOW", category: "Nature" },
  { word: "LIGHTNING", category: "Nature" },
  { word: "OCEANS", category: "Nature" },
  { word: "RIPPLES", category: "Nature" },
  { word: "FOREST", category: "Nature" },
  { word: "VOLCANO", category: "Nature" },
  { word: "GLACIER", category: "Nature" },
  { word: "WATERFALL", category: "Nature" },
  { word: "SUNRISE", category: "Nature" },
  { word: "SUNSET", category: "Nature" },
  { word: "CANYON", category: "Nature" },

  // 4. Food & Cuisine (14 words)
  { word: "AVOCADO", category: "Food" },
  { word: "PINEAPPLE", category: "Food" },
  { word: "SPAGHETTI", category: "Food" },
  { word: "CHOCOLATE", category: "Food" },
  { word: "CHOPSTICKS", category: "Food" },
  { word: "BANANA", category: "Food" },
  { word: "PANCAKE", category: "Food" },
  { word: "CINNAMON", category: "Food" },
  { word: "SANDWICH", category: "Food" },
  { word: "BROCCOLI", category: "Food" },
  { word: "MUSHROOM", category: "Food" },
  { word: "BURRITO", category: "Food" },
  { word: "BISCUIT", category: "Food" },
  { word: "PUDDING", category: "Food" },

  // 5. Landmarks & Architecture (14 words)
  { word: "COLOSSEUM", category: "Landmarks" },
  { word: "PYRAMID", category: "Landmarks" },
  { word: "PALACE", category: "Landmarks" },
  { word: "TEMPLE", category: "Landmarks" },
  { word: "KINGDOM", category: "Landmarks" },
  { word: "VILLAGE", category: "Landmarks" },
  { word: "PLAYGROUND", category: "Landmarks" },
  { word: "LIBRARY", category: "Landmarks" },
  { word: "BRIDGES", category: "Landmarks" },
  { word: "CASTLE", category: "Landmarks" },
  { word: "MONUMENT", category: "Landmarks" },
  { word: "FORTRESS", category: "Landmarks" },
  { word: "AQUEDUCT", category: "Landmarks" },
  { word: "BASTION", category: "Landmarks" },

  // 6. Science & Knowledge (14 words)
  { word: "EINSTEIN", category: "Science" },
  { word: "SCIENCE", category: "Science" },
  { word: "GEOGRAPHY", category: "Science" },
  { word: "RESEARCH", category: "Science" },
  { word: "EXERCISE", category: "Science" },
  { word: "KNOWLEDGE", category: "Science" },
  { word: "BLACKBOARD", category: "Science" },
  { word: "VIBRATION", category: "Science" },
  { word: "COMPASS", category: "Science" },
  { word: "CHEMISTRY", category: "Science" },
  { word: "GRAVITY", category: "Science" },
  { word: "ELECTRON", category: "Science" },
  { word: "MICROSCOPE", category: "Science" },
  { word: "HYPOTHESIS", category: "Science" },

  // 7. Vehicles & Transportation (14 words)
  { word: "FERRARI", category: "Vehicles" },
  { word: "SUBMARINE", category: "Vehicles" },
  { word: "HELICOPTER", category: "Vehicles" },
  { word: "CHARIOT", category: "Vehicles" },
  { word: "AIRPLANE", category: "Vehicles" },
  { word: "ROCKET", category: "Vehicles" },
  { word: "BICYCLE", category: "Vehicles" },
  { word: "STEAMBOAT", category: "Vehicles" },
  { word: "LOCOMOTIVE", category: "Vehicles" },
  { word: "AMBULANCE", category: "Vehicles" },
  { word: "TRACTOR", category: "Vehicles" },
  { word: "SAILBOAT", category: "Vehicles" },
  { word: "CRUISER", category: "Vehicles" },
  { word: "HOVERCRAFT", category: "Vehicles" },

  // 8. Vocabulary & Wisdom (14 words)
  { word: "SERENITY", category: "Vocabulary" },
  { word: "METICULOUS", category: "Vocabulary" },
  { word: "PRAGMATIC", category: "Vocabulary" },
  { word: "RESILIENT", category: "Vocabulary" },
  { word: "HARMONY", category: "Vocabulary" },
  { word: "WISDOM", category: "Vocabulary" },
  { word: "BRILLIANT", category: "Vocabulary" },
  { word: "MEDITATION", category: "Vocabulary" },
  { word: "CONSCIOUS", category: "Vocabulary" },
  { word: "TRANSCEND", category: "Vocabulary" },
  { word: "RADIANCE", category: "Vocabulary" },
  { word: "DESTINY", category: "Vocabulary" },
  { word: "COURAGE", category: "Vocabulary" },
  { word: "LIBERATION", category: "Vocabulary" }
];

let queue = [];
let activeRooms = new Set(); 
let playerToRoomMap = new Map();
let disconnectTimeouts = new Map();
let roomExpiryTimers = new Map();
let customRooms = new Map(); // code -> { hostId, hostName, word, category }
let roomSessions = new Map(); // roomId -> { roomId, p1, p2, currentRound, history, rematchRequests, isBot, status }

const finalizeMatch = (roomId, winnerIdOrName, wasForfeit = false, reason = 'word_solved') => {
  if (!activeRooms.has(roomId)) return;

  if (roomExpiryTimers.has(roomId)) {
    clearTimeout(roomExpiryTimers.get(roomId));
    roomExpiryTimers.delete(roomId);
  }

  // Find winner metadata
  let winnerName = winnerIdOrName;
  let winnerId = null;
  for (const [sId, data] of playerToRoomMap.entries()) {
    if (data.roomId === roomId && (sId === winnerIdOrName || data.username === winnerIdOrName)) {
      winnerName = data.username;
      winnerId = sId;
      break;
    }
  }

  const session = roomSessions.get(roomId);
  if (session) {
    session.status = 'round_ended';
    if (session.p1 && (winnerId === session.p1.id || winnerName === session.p1.username)) {
      session.p1.score += 1;
    } else if (session.p2 && (winnerId === session.p2.id || winnerName === session.p2.username)) {
      session.p2.score += 1;
    }
  }

  console.log(`🏆 [${roomId}] Winner: ${winnerName} (${winnerId || 'N/A'}) [${reason}] ${wasForfeit ? '(Forfeit)' : ''}`);

  const matchEndedPayload = {
    roomId,
    winnerName,
    winnerId,
    reason,
    wasForfeit,
    basePrize: BASE_WIN_PRIZE,
    baseXP: BASE_XP_WIN,
    xpLoss: XP_LOSS,
    seriesScore: session ? {
      p1Id: session.p1.id,
      p2Id: session.p2.id,
      p1Score: session.p1.score,
      p2Score: session.p2.score,
      round: session.currentRound,
      isSeriesOver: session.p1.score >= 2 || session.p2.score >= 2,
      seriesWinner: session.p1.score >= 2 ? session.p1.username : (session.p2.score >= 2 ? session.p2.username : null)
    } : null
  };
  
  // Rule 5: Authoritative synchronized results for BOTH ends simultaneously
  io.to(roomId).emit('match-ended', matchEndedPayload);
  io.to(roomId).emit('game-results-synced', matchEndedPayload);

  activeRooms.delete(roomId);

  // Keep player mappings and session for rematch window (60s grace period)
  setTimeout(() => {
    if (!activeRooms.has(roomId)) {
      roomSessions.delete(roomId);
      for (const [socketId, data] of playerToRoomMap.entries()) {
        if (data.roomId === roomId) playerToRoomMap.delete(socketId);
      }
    }
  }, 60000);
};

const startDuelBetween = (p1, p2, forcedWord = null) => {
  const roomId = `duel_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const selectedMatch = forcedWord || ONLINE_WORDS[Math.floor(Math.random() * ONLINE_WORDS.length)];

  playerToRoomMap.set(p1.id, { roomId, username: p1.username });
  playerToRoomMap.set(p2.id, { roomId, username: p2.username });

  const s1 = io.sockets.sockets.get(p1.id);
  const s2 = io.sockets.sockets.get(p2.id);

  if (s1 && s2) {
    s1.join(roomId);
    s2.join(roomId);
    activeRooms.add(roomId);

    roomSessions.set(roomId, {
      roomId,
      p1: { id: p1.id, username: p1.username, score: 0 },
      p2: { id: p2.id, username: p2.username, score: 0 },
      currentRound: 1,
      history: [selectedMatch.word],
      rematchRequests: new Set(),
      isBot: false,
      status: 'playing'
    });

    roomExpiryTimers.set(roomId, setTimeout(() => {
      finalizeMatch(roomId, "Draw", false, 'time_up');
    }, MAX_MATCH_DURATION));

    io.to(roomId).emit('match-started', { entryFee: ENTRY_FEE });
    
    io.to(p1.id).emit('match-found', { 
      ...selectedMatch, 
      roomId, 
      opponentName: p2.username,
      opponentId: p2.id,
      isBot: false,
      seriesScore: { myScore: 0, oppScore: 0, round: 1 }
    });
    io.to(p2.id).emit('match-found', { 
      ...selectedMatch, 
      roomId, 
      opponentName: p1.username,
      opponentId: p1.id,
      isBot: false,
      seriesScore: { myScore: 0, oppScore: 0, round: 1 }
    });
    
    console.log(`⚔️ Duel Started (Shared Word: ${selectedMatch.word}): ${p1.username} vs ${p2.username}`);
  }
};

io.on('connection', (socket) => {
  
  socket.on('join-queue', ({ username }) => {
    // Reconnection handling: check both socket.id and active session
    if (playerToRoomMap.has(socket.id)) {
      const existing = playerToRoomMap.get(socket.id);
      socket.join(existing.roomId);
      return;
    }

    if (queue.some(p => p.id === socket.id)) return;
    
    queue.push({ id: socket.id, username: username || "Player" });
    console.log(`👤 ${username || "Player"} joined queue. Queue size: ${queue.length}`);

    if (queue.length >= 2) {
      const p1 = queue.shift();
      const p2 = queue.shift();
      startDuelBetween(p1, p2);
    }
  });

  socket.on('create-custom-room', ({ username }) => {
    // Generate a 4-letter alphanumeric room code
    const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 4; i++) code += letters.charAt(Math.floor(Math.random() * letters.length));

    const selectedMatch = ONLINE_WORDS[Math.floor(Math.random() * ONLINE_WORDS.length)];
    customRooms.set(code, {
      hostId: socket.id,
      hostName: username || "Host",
      wordData: selectedMatch,
      createdAt: Date.now()
    });

    socket.emit('custom-room-created', { roomCode: code });
    console.log(`🏠 Custom Room Created: [${code}] by ${username}`);
  });

  socket.on('join-custom-room', ({ roomCode, username }) => {
    const code = (roomCode || "").toUpperCase().trim();
    if (!customRooms.has(code)) {
      socket.emit('custom-room-error', { message: "Room not found or expired" });
      return;
    }

    const room = customRooms.get(code);
    if (room.hostId === socket.id) {
      socket.emit('custom-room-error', { message: "Cannot join your own room" });
      return;
    }

    customRooms.delete(code);
    const p1 = { id: room.hostId, username: room.hostName };
    const p2 = { id: socket.id, username: username || "Challenger" };
    startDuelBetween(p1, p2, room.wordData);
  });

  // Clash Duel: Instant AI Challenger Match
  socket.on('request-bot-match', () => {
    queue = queue.filter(p => p.id !== socket.id);
    const bots = ["Scholar Aether", "Student Zephyr", "Sage Orion", "Rival Kael"];
    const randomBot = bots[Math.floor(Math.random() * bots.length)];
    const roomId = `duel_bot_${Date.now()}`;
    const selectedMatch = ONLINE_WORDS[Math.floor(Math.random() * ONLINE_WORDS.length)];
    
    playerToRoomMap.set(socket.id, { roomId, username: socket.id, isBotMatch: true });
    socket.join(roomId);
    activeRooms.add(roomId);

    roomSessions.set(roomId, {
      roomId,
      p1: { id: socket.id, username: "Player", score: 0 },
      p2: { id: `bot_${Date.now()}`, username: randomBot, score: 0 },
      currentRound: 1,
      history: [selectedMatch.word],
      rematchRequests: new Set(),
      isBot: true,
      botName: randomBot,
      status: 'playing'
    });

    socket.emit('match-started', { entryFee: ENTRY_FEE });
    socket.emit('match-found', { 
      ...selectedMatch, 
      roomId, 
      opponentName: randomBot, 
      isBot: true,
      seriesScore: { myScore: 0, oppScore: 0, round: 1 }
    });
    console.log(`🤖 Bot Duel Started: ${randomBot}`);
  });

  socket.on('send-guess', ({ roomId, letter, score }) => {
    socket.to(roomId).emit('opponent-guess', { letter, score });
  });

  // Clash Duel: Tactical Spells
  socket.on('cast-spell', ({ roomId, spellId, casterName }) => {
    console.log(`✨ [${roomId}] Spell Cast: ${spellId} by ${casterName}`);
    socket.to(roomId).emit('opponent-spell-cast', { spellId, casterName, timestamp: Date.now() });
  });

  // Clash Duel: Shield Barrier status sync
  socket.on('shield-state', ({ roomId, active }) => {
    socket.to(roomId).emit('opponent-shield-state', { active });
  });

  // Clash Duel: Real-time wrong guess / lives sync
  socket.on('wrong-guess-count', ({ roomId, wrongCount }) => {
    socket.to(roomId).emit('opponent-wrong-count', { wrongCount });
  });

  // Clash Duel: Reactive Emote / Taunt
  socket.on('send-taunt', ({ roomId, emoji, senderName }) => {
    socket.to(roomId).emit('opponent-taunt', { emoji, senderName });
  });

  // Rule 2: First to Finish / Match Concluded
  socket.on('game-finished', ({ roomId, winnerName, reason }) => {
    finalizeMatch(roomId, winnerName, false, reason || 'word_solved');
  });

  // Best-of-3 Instant Rematch Handshake
  socket.on('request-rematch', ({ roomId }) => {
    const session = roomSessions.get(roomId);
    if (!session) {
      socket.emit('rematch-declined', { message: "Match session expired" });
      return;
    }

    // A. Bot Match: Instant rematch auto-accept
    if (session.isBot) {
      session.currentRound += 1;
      const unusedWords = ONLINE_WORDS.filter(w => !session.history.includes(w.word));
      const nextWord = unusedWords.length > 0 
        ? unusedWords[Math.floor(Math.random() * unusedWords.length)]
        : ONLINE_WORDS[Math.floor(Math.random() * ONLINE_WORDS.length)];
      session.history.push(nextWord.word);
      activeRooms.add(roomId);
      session.status = 'playing';

      roomExpiryTimers.set(roomId, setTimeout(() => {
        finalizeMatch(roomId, "Draw", false, 'time_up');
      }, MAX_MATCH_DURATION));

      socket.emit('rematch-accepted', {
        ...nextWord,
        roomId,
        opponentName: session.p2.username,
        isBot: true,
        seriesScore: {
          myScore: session.p1.score,
          oppScore: session.p2.score,
        }
      });
      console.log(`🔄 Bot Play Again Accepted [${roomId}] (Word: ${nextWord.word})`);
      return;
    }

    // B. Human vs Human 2-Player Match
    session.rematchRequests.add(socket.id);
    console.log(`🤝 Play Again Requested in [${roomId}] by ${socket.id} (${session.rematchRequests.size}/2)`);

    if (session.rematchRequests.size === 1) {
      socket.emit('rematch-waiting');
      socket.to(roomId).emit('rematch-requested', {
        requesterId: socket.id,
      });
    } else if (session.rematchRequests.size >= 2) {
      // Both players agreed to play again!
      session.currentRound += 1;
      session.rematchRequests.clear();
      activeRooms.add(roomId);
      session.status = 'playing';

      const unusedWords = ONLINE_WORDS.filter(w => !session.history.includes(w.word));
      const nextWord = unusedWords.length > 0 
        ? unusedWords[Math.floor(Math.random() * unusedWords.length)]
        : ONLINE_WORDS[Math.floor(Math.random() * ONLINE_WORDS.length)];
      session.history.push(nextWord.word);

      roomExpiryTimers.set(roomId, setTimeout(() => {
        finalizeMatch(roomId, "Draw", false, 'time_up');
      }, MAX_MATCH_DURATION));

      const p1Score = session.p1.score;
      const p2Score = session.p2.score;

      io.to(session.p1.id).emit('rematch-accepted', {
        ...nextWord,
        roomId,
        opponentName: session.p2.username,
        opponentId: session.p2.id,
        isBot: false,
        seriesScore: {
          myScore: p1Score,
          oppScore: p2Score,
        }
      });

      io.to(session.p2.id).emit('rematch-accepted', {
        ...nextWord,
        roomId,
        opponentName: session.p1.username,
        opponentId: session.p1.id,
        isBot: false,
        seriesScore: {
          myScore: p2Score,
          oppScore: p1Score,
        }
      });

      console.log(`⚔️ Play Again Accepted by Both in [${roomId}] (Word: ${nextWord.word})`);
    }
  });

  socket.on('leave-match', ({ roomId }) => {
    if (roomId) {
      socket.to(roomId).emit('opponent-left-match');
      activeRooms.delete(roomId);
      roomSessions.delete(roomId);
      playerToRoomMap.delete(socket.id);
    }
  });

  socket.on('disconnect', () => {
    if (playerToRoomMap.has(socket.id)) {
      const { roomId, username } = playerToRoomMap.get(socket.id);
      socket.to(roomId).emit('opponent-left-match');
      
      if (activeRooms.has(roomId)) {
        const timeout = setTimeout(() => {
          let opponentName = "Opponent";
          for (const [id, data] of playerToRoomMap.entries()) {
            if (data.roomId === roomId && id !== socket.id) {
              opponentName = data.username;
              break;
            }
          }
          // The Forfeit Rule logic
          finalizeMatch(roomId, opponentName, true, 'forfeit');
        }, RECONNECT_GRACE_PERIOD);
        
        disconnectTimeouts.set(socket.id, timeout);
      }
    }
    queue = queue.filter(p => p.id !== socket.id);
  });
});