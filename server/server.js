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

// Rule 1: Shared Word Pool
const ONLINE_WORDS = [
  // Space & Science
  { word: "JUPITER", category: "Space" },
  { word: "GALAXY", category: "Space" },
  { word: "TELESCOPE", category: "Space" },
  { word: "ASTEROID", category: "Space" },
  { word: "SUPERNOVA", category: "Space" },
  { word: "EINSTEIN", category: "Famous People" },
  // Animals & Nature
  { word: "PLATYPUS", category: "Animals" },
  { word: "CHAMELEON", category: "Animals" },
  { word: "DOLPHIN", category: "Animals" },
  { word: "KANGAROO", category: "Animals" },
  { word: "FLAMINGO", category: "Animals" },
  // Food & Produce
  { word: "AVOCADO", category: "Food" },
  { word: "PINEAPPLE", category: "Fruits" },
  { word: "SPAGHETTI", category: "Food" },
  { word: "CHOCOLATE", category: "Food" },
  { word: "CHOPSTICKS", category: "Items" },
  // Landmarks & Geography
  { word: "COLOSSEUM", category: "Landmarks" },
  { word: "PYRAMID", category: "Landmarks" },
  { word: "WATERFALL", category: "Geography" },
  { word: "GLACIER", category: "Geography" },
  // Vehicles & Inventions
  { word: "FERRARI", category: "Cars" },
  { word: "SUBMARINE", category: "Vehicles" },
  { word: "HELICOPTER", category: "Vehicles" },
  { word: "COMPASS", category: "Items" },
  // Tough Vocabulary
  { word: "SERENDIPITY", category: "SAT Vocabulary" },
  { word: "METICULOUS", category: "SAT Vocabulary" },
  { word: "PRAGMATIC", category: "SAT Vocabulary" },
  { word: "RESILIENT", category: "SAT Vocabulary" }
];

let queue = [];
let activeRooms = new Set(); 
let playerToRoomMap = new Map();
let disconnectTimeouts = new Map();
let roomExpiryTimers = new Map();
let customRooms = new Map(); // code -> { hostId, hostName, word, category }

const finalizeMatch = (roomId, winnerIdOrName, wasForfeit = false) => {
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

  console.log(`🏆 [${roomId}] Winner: ${winnerName} (${winnerId || 'N/A'}) ${wasForfeit ? '(Forfeit)' : ''}`);
  
  // Rule 5: Synced results for XP/Coin calculations
  io.to(roomId).emit('game-results-synced', {
    winnerName,
    winnerId,
    basePrize: BASE_WIN_PRIZE,
    baseXP: BASE_XP_WIN,
    xpLoss: XP_LOSS,
    wasForfeit
  });

  activeRooms.delete(roomId);

  // Clear player mappings
  for (const [socketId, data] of playerToRoomMap.entries()) {
    if (data.roomId === roomId) playerToRoomMap.delete(socketId);
  }
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

    roomExpiryTimers.set(roomId, setTimeout(() => {
      finalizeMatch(roomId, "Draw", false);
    }, MAX_MATCH_DURATION));

    io.to(roomId).emit('match-started', { entryFee: ENTRY_FEE });
    
    io.to(p1.id).emit('match-found', { 
      ...selectedMatch, 
      roomId, 
      opponentName: p2.username,
      opponentId: p2.id,
      isBot: false 
    });
    io.to(p2.id).emit('match-found', { 
      ...selectedMatch, 
      roomId, 
      opponentName: p1.username,
      opponentId: p1.id,
      isBot: false 
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

    socket.emit('match-started', { entryFee: ENTRY_FEE });
    socket.emit('match-found', { ...selectedMatch, roomId, opponentName: randomBot, isBot: true });
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

  // Rule 2: First to Finish
  socket.on('game-finished', ({ roomId, winnerName }) => {
    // Notify the other player immediately so they see the defeat screen
    socket.to(roomId).emit('opponent-won');
    finalizeMatch(roomId, winnerName, false);
  });

  socket.on('disconnect', () => {
    if (playerToRoomMap.has(socket.id)) {
      const { roomId, username } = playerToRoomMap.get(socket.id);
      
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
          finalizeMatch(roomId, opponentName, true);
        }, RECONNECT_GRACE_PERIOD);
        
        disconnectTimeouts.set(socket.id, timeout);
      }
    }
    queue = queue.filter(p => p.id !== socket.id);
  });
});