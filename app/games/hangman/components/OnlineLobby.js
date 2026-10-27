
'use client';
import { useState, useEffect } from 'react';
import { Globe, Users, X, Coins, Sword, ShieldCheck, KeyRound, ArrowRight } from 'lucide-react';
import { GAME_STAKES } from '../constants';

export default function OnlineLobby({ socket, profile, onCancel, onStartInstantDuel }) {
  const [status, setStatus] = useState('searching'); 
  const [opponentName, setOpponentName] = useState('');
  const [searchSeconds, setSearchSeconds] = useState(0);
  const [lobbyTab, setLobbyTab] = useState('matchmaking'); // 'matchmaking' | 'custom'
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [createdRoomCode, setCreatedRoomCode] = useState(null);
  const [customError, setCustomError] = useState(null);

  const ENTRY_FEE = GAME_STAKES.ONLINE_1V1.ENTRY_FEE;
  const WIN_PRIZE = GAME_STAKES.ONLINE_1V1.WIN_PRIZE;

  const DUEL_WORDS = [
    { word: "JUPITER", category: "Space" },
    { word: "GALAXY", category: "Space" },
    { word: "ASTEROID", category: "Space" },
    { word: "PLATYPUS", category: "Animals" },
    { word: "CHAMELEON", category: "Animals" },
    { word: "DOLPHIN", category: "Animals" },
    { word: "CHOPSTICKS", category: "Items" },
    { word: "AVOCADO", category: "Food" },
    { word: "PINEAPPLE", category: "Fruits" },
    { word: "COLOSSEUM", category: "Landmarks" },
    { word: "PYRAMID", category: "Landmarks" },
    { word: "FERRARI", category: "Cars" },
    { word: "SUBMARINE", category: "Vehicles" },
    { word: "EINSTEIN", category: "Famous People" },
    { word: "SERENDIPITY", category: "SAT Vocabulary" },
    { word: "METICULOUS", category: "SAT Vocabulary" }
  ];
  const BOTS = ["Scholar Aether", "Sage Orion", "Student Zephyr", "Rival Kael"];

  // Fallback bot duel
  const handleStartBotMatch = () => {
    const randomWord = DUEL_WORDS[Math.floor(Math.random() * DUEL_WORDS.length)];
    const randomBot = BOTS[Math.floor(Math.random() * BOTS.length)];
    setStatus('matched');
    setOpponentName(randomBot);

    if (socket?.connected) {
      socket.emit('request-bot-match');
    }

    if (onStartInstantDuel) {
      setTimeout(() => {
        onStartInstantDuel({
          ...randomWord,
          roomId: `bot_duel_${Date.now()}`,
          opponentName: randomBot,
          isBot: true,
        });
      }, 500);
    }
  };

  const handleCreateRoom = () => {
    setCustomError(null);
    if (socket?.connected) {
      socket.emit('create-custom-room', { username: profile?.name || "Player" });
    }
  };

  const handleJoinRoom = () => {
    const code = roomCodeInput.trim().toUpperCase();
    if (!code) {
      setCustomError("Enter a 4-character code");
      return;
    }
    setCustomError(null);
    if (socket?.connected) {
      socket.emit('join-custom-room', { roomCode: code, username: profile?.name || "Player" });
    }
  };

  useEffect(() => {
    if (status !== 'searching') return;
    const interval = setInterval(() => {
      setSearchSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (!socket) return;

    if (!socket.connected) {
      socket.connect();
    }

    const joinQueue = () => {
      if (socket.connected && lobbyTab === 'matchmaking') {
        socket.emit('join-queue', { 
          username: profile?.name || "Player",
          currentCoins: profile?.papaPoints || 0,
          currentXP: profile?.xp || 0
        });
      }
    };

    if (socket.connected) {
      joinQueue();
    } else {
      socket.on('connect', joinQueue);
    }

    const handleMatchFound = (data) => {
      setStatus('matched');
      setOpponentName(data.opponentName);
      if (onStartInstantDuel) {
        setTimeout(() => onStartInstantDuel(data), 600);
      }
    };

    const handleCustomRoomCreated = ({ roomCode }) => {
      setCreatedRoomCode(roomCode);
    };

    const handleCustomRoomError = ({ message }) => {
      setCustomError(message);
    };

    socket.on('match-found', handleMatchFound);
    socket.on('custom-room-created', handleCustomRoomCreated);
    socket.on('custom-room-error', handleCustomRoomError);

    return () => {
      socket.off('connect', joinQueue);
      socket.off('match-found', handleMatchFound);
      socket.off('custom-room-created', handleCustomRoomCreated);
      socket.off('custom-room-error', handleCustomRoomError);
    };
  }, [socket, profile, onStartInstantDuel, lobbyTab]);

  return (
    <div className="w-full max-w-xl mx-auto py-8 px-4 animate-in fade-in zoom-in duration-500">
      <div className={`bg-zinc-950 text-white rounded-[2.5rem] border-2 transition-all duration-500 p-6 md:p-8 flex flex-col items-center text-center relative overflow-hidden shadow-2xl ${
        status === 'matched' ? 'border-emerald-400 ring-2 ring-emerald-500/20' : 'border-zinc-800'
      }`}>
        
        {/* Dynamic Background Pulse */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${
          status === 'matched' ? 'bg-emerald-500/10 opacity-100' : 'bg-fuchsia-500/5 opacity-50'
        } animate-pulse -z-0`} />

        <div className="relative z-10 w-full space-y-6">
          
          {/* HEADER: Stakes & Tab Selector */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-400/40 rounded-full shadow-sm">
              <Coins className="text-amber-400 animate-bounce" size={14} />
              <div className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-300">
                <span>Stakes:</span>
                <span>{WIN_PRIZE} PapaPoints</span>
              </div>
            </div>

            {/* TAB SELECTOR: Quick Match vs Play with a Friend */}
            {status !== 'matched' && (
              <div className="flex items-center bg-zinc-900 border border-zinc-800 p-1 rounded-2xl w-full max-w-xs shadow-inner">
                <button
                  onClick={() => setLobbyTab('matchmaking')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                    lobbyTab === 'matchmaking'
                      ? 'bg-fuchsia-600 text-white shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Quick Match
                </button>
                <button
                  onClick={() => setLobbyTab('custom')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                    lobbyTab === 'custom'
                      ? 'bg-fuchsia-600 text-white shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Play Friend
                </button>
              </div>
            )}
          </div>

          {lobbyTab === 'matchmaking' ? (
            <>
              {/* CENTRAL RADAR */}
              <div className="flex justify-center py-2">
                <div className="relative">
                  <div className={`w-28 h-28 rounded-full border-4 border-t-fuchsia-500 border-r-transparent border-b-fuchsia-950 border-l-transparent transition-all duration-1000 ${
                    status === 'searching' ? 'animate-spin' : 'border-emerald-500 rotate-180 scale-110'
                  }`} />
                  <div className={`absolute inset-0 m-2 rounded-full flex items-center justify-center transition-all duration-500 ${
                    status === 'matched' ? 'bg-emerald-500' : 'bg-zinc-900'
                  }`}>
                    {status === 'matched' ? (
                      <Sword className="text-white animate-pulse" size={34} />
                    ) : (
                      <Globe className="text-fuchsia-400 animate-pulse" size={34} />
                    )}
                  </div>
                </div>
              </div>

              {/* STATUS MESSAGING */}
              <div className="space-y-1">
                <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                  {status === 'searching' ? "Scanning Arena" : "Challenger Found!"}
                </h2>
                <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-widest">
                  {status === 'searching' ? `Queued for ${searchSeconds}s...` : "Synchronizing Shared Word"}
                </p>
              </div>
            </>
          ) : (
            /* PLAY WITH A FRIEND TAB (Room Codes) */
            <div className="py-2 space-y-4 w-full max-w-sm mx-auto">
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
                <p className="text-xs font-black uppercase tracking-wider text-zinc-300">
                  Create a Private Room
                </p>
                {createdRoomCode ? (
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-zinc-400">Share this code with your friend:</p>
                    <div className="p-2.5 rounded-xl bg-black border-2 border-fuchsia-500/80 text-2xl font-black tracking-[0.3em] text-fuchsia-300 font-mono">
                      {createdRoomCode}
                    </div>
                    <p className="text-[9px] font-bold text-emerald-400 animate-pulse">
                      Waiting for friend to join...
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleCreateRoom}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:opacity-90 active:scale-95 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all"
                  >
                    Generate Room Code
                  </button>
                )}
              </div>

              {/* JOIN WITH CODE */}
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
                <p className="text-xs font-black uppercase tracking-wider text-zinc-300">
                  Or Join Friend's Code
                </p>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      maxLength={4}
                      value={roomCodeInput}
                      onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                      placeholder="CODE"
                      className="w-full py-2 px-3 rounded-xl bg-black border border-zinc-700 text-center text-lg font-black tracking-widest font-mono uppercase text-white focus:outline-none focus:border-fuchsia-500"
                    />
                  </div>
                  <button
                    onClick={handleJoinRoom}
                    className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center gap-1"
                  >
                    <span>Join</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
                {customError && (
                  <p className="text-[10px] font-bold text-rose-400 animate-shake">
                    {customError}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* OPPONENT MATCHED CARD */}
          {status === 'matched' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="inline-flex items-center gap-3 bg-zinc-900 border border-emerald-500/40 px-6 py-2.5 rounded-2xl shadow-xl">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-black text-xs text-white">
                  {opponentName?.[0]?.toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-[9px] text-zinc-400 font-black uppercase">Challenger</p>
                  <p className="font-black text-base text-white tracking-wider">{opponentName}</p>
                </div>
              </div>
            </div>
          )}

          {/* FOOTER ACTIONS */}
          <div className="flex flex-col gap-3 items-center pt-2">
            {status === 'searching' ? (
              <>
                <button
                  onClick={handleStartBotMatch}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 active:scale-95 text-xs font-black uppercase tracking-wider transition-all"
                >
                  <Sword size={14} className="text-fuchsia-400" />
                  <span>Practice vs AI Bot</span>
                </button>
                <button
                  onClick={onCancel}
                  className="group flex items-center gap-1.5 px-6 py-2 rounded-full border border-rose-900/60 text-rose-400 hover:bg-rose-950/40 text-xs font-black uppercase tracking-wider transition-all active:scale-95"
                >
                  <X size={14} />
                  <span>Leave Lobby</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 text-emerald-400 font-black uppercase text-xs animate-pulse">
                <ShieldCheck size={16} />
                Launching Duel Arena...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
