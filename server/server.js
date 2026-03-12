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

// Rule 3: Match Duration (120 Seconds)
const MAX_MATCH_DURATION = 120000; 

// Rule 1: Shared Word Pool
const ONLINE_WORDS = [
  { word: "JUPITER", category: "Space" },
  { word: "PLATYPUS", category: "Animals" },
  { word: "CHOPSTICKS", category: "Items" },
  { word: "AVOCADO", category: "Food" },
  { word: "COLOSSEUM", category: "Landmarks" },
  { word: "FERRARI", category: "Cars" },
  { word: "PINEAPPLE", category: "Fruits" },
  { word: "SUBMARINE", category: "Vehicles" },
  { word: "EINSTEIN", category: "Famous People" }
];

let queue = [];
let activeRooms = new Set(); 
let playerToRoomMap = new Map();
let disconnectTimeouts = new Map();
let roomExpiryTimers = new Map();

const finalizeMatch = (roomId, winnerName, wasForfeit = false) => {
  if (!activeRooms.has(roomId)) return;

  if (roomExpiryTimers.has(roomId)) {
    clearTimeout(roomExpiryTimers.get(roomId));
    roomExpiryTimers.delete(roomId);
  }

  console.log(`🏆 [${roomId}] Winner: ${winnerName} ${wasForfeit ? '(Forfeit)' : ''}`);
  
  // Rule 5: Synced results for XP/Coin calculations
  io.to(roomId).emit('game-results-synced', {
    winnerName,
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

io.on('connection', (socket) => {
  
  socket.on('join-queue', ({ username }) => {
    // Reconnection handling
    for (let [oldId, timeout] of disconnectTimeouts.entries()) {
      const session = playerToRoomMap.get(oldId);
      if (session && session.username === username) {
        clearTimeout(timeout);
        disconnectTimeouts.delete(oldId);
        socket.join(session.roomId);
        playerToRoomMap.set(socket.id, session);
        playerToRoomMap.delete(oldId);
        console.log(`♻️ Player ${username} reconnected.`);
        return;
      }
    }

    if (queue.some(p => p.id === socket.id)) return;
    
    queue.push({ id: socket.id, username });
    console.log(`👤 ${username} joined queue. Queue size: ${queue.length}`);

    if (queue.length >= 2) {
      const p1 = queue.shift();
      const p2 = queue.shift();
      const roomId = `duel_${Date.now()}`;
      
      // Rule 1: Same Word & Category
      const selectedMatch = ONLINE_WORDS[Math.floor(Math.random() * ONLINE_WORDS.length)];

      playerToRoomMap.set(p1.id, { roomId, username: p1.username });
      playerToRoomMap.set(p2.id, { roomId, username: p2.username });

      const s1 = io.sockets.sockets.get(p1.id);
      const s2 = io.sockets.sockets.get(p2.id);

      if (s1 && s2) {
        s1.join(roomId);
        s2.join(roomId);
        activeRooms.add(roomId);

        // Rule 3: Timer implementation (Draw if no one finishes)
        roomExpiryTimers.set(roomId, setTimeout(() => {
          // Frontend handles score comparison; Server just triggers the sync
          finalizeMatch(roomId, "Draw", false);
        }, MAX_MATCH_DURATION));

        io.to(roomId).emit('match-started', { entryFee: ENTRY_FEE });
        
        io.to(p1.id).emit('match-found', { ...selectedMatch, roomId, opponentName: p2.username });
        io.to(p2.id).emit('match-found', { ...selectedMatch, roomId, opponentName: p1.username });
        
        console.log(`⚔️ Duel Started: ${p1.username} vs ${p2.username}`);
      }
    }
  });

  socket.on('send-guess', ({ roomId, letter, score }) => {
    socket.to(roomId).emit('opponent-guess', { letter, score });
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