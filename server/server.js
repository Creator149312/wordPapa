const io = require('socket.io')(3001, {
  cors: { origin: "*" }
});

console.log("---------------------------------------");
console.log("🚀 WordPapa Socket Server running on port 3001");
console.log("---------------------------------------");

let queue = [];

io.on('connection', (socket) => {
  console.log(`+ New Connection: ${socket.id}`);

  socket.on('join-queue', ({ username }) => {
    console.log(`🔍 Matchmaking: ${username} (${socket.id}) entered queue`);
    queue.push({ id: socket.id, username });
    console.log(`👥 Queue size: ${queue.length}`);

    if (queue.length >= 2) {
      const p1 = queue.shift();
      const p2 = queue.shift();
      const roomId = `room_${p1.id}`;

      const s1 = io.sockets.sockets.get(p1.id);
      const s2 = io.sockets.sockets.get(p2.id);
      
      if (s1 && s2) {
        s1.join(roomId);
        s2.join(roomId);

        console.log(`✅ Match Found! Room: ${roomId}`);
        console.log(`   Player 1: ${p1.username}`);
        console.log(`   Player 2: ${p2.username}`);

        // Tell Player 1 that Player 2 is the opponent
        io.to(p1.id).emit('match-found', {
          roomId,
          opponentName: p2.username,
          word: "PINEAPPLE",
          category: "Fruits"
        });

        // Tell Player 2 that Player 1 is the opponent
        io.to(p2.id).emit('match-found', {
          roomId,
          opponentName: p1.username,
          word: "PINEAPPLE",
          category: "Fruits"
        });
      }
    }
  });

  socket.on('send-guess', ({ roomId, letter, score }) => {
    console.log(`⌨️  Guess in ${roomId}: Letter "${letter}" | New Score: ${score}`);
    // Broadcast to the other person in the room
    socket.to(roomId).emit('opponent-guess', { letter, score });
  });

  socket.on('disconnect', () => {
    console.log(`- User Disconnected: ${socket.id}`);
    queue = queue.filter(p => p.id !== socket.id);
    console.log(`👥 Queue size: ${queue.length}`);
  });
});