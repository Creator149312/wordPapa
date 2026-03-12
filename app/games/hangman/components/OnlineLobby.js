
'use client';
import { useState, useEffect } from 'react';
import { Globe, Users, X, Coins, Sword, ShieldCheck } from 'lucide-react';
import { GAME_STAKES } from '../lib/progression';

export default function OnlineLobby({ socket, profile, onCancel }) {
  const [status, setStatus] = useState('searching'); 
  const [opponentName, setOpponentName] = useState('');

  const ENTRY_FEE = GAME_STAKES.ONLINE_1V1.ENTRY_FEE;
  const WIN_PRIZE = GAME_STAKES.ONLINE_1V1.WIN_PRIZE;

  useEffect(() => {
    if (!socket) return;

    const joinQueue = () => {
      if (socket.connected) {
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
    };

    socket.on('match-found', handleMatchFound);

    return () => {
      socket.off('connect', joinQueue);
      socket.off('match-found', handleMatchFound);
    };
  }, [socket, profile]);

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-6 animate-in fade-in zoom-in duration-500">
      <div className={`bg-white dark:bg-gray-900 rounded-[3rem] border-4 border-dashed transition-all duration-700 p-12 flex flex-col items-center text-center relative overflow-hidden shadow-2xl ${
        status === 'matched' ? 'border-green-400 scale-[1.02]' : 'border-blue-100 dark:border-gray-800'
      }`}>
        
        {/* Dynamic Background Pulse */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${
          status === 'matched' ? 'bg-green-500/10 opacity-100' : 'bg-blue-500/5 opacity-50'
        } animate-pulse -z-0`} />

        <div className="relative z-10 w-full space-y-8">
          
          {/* STAKES HEADER: Shows what's on the line */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 px-5 py-2 bg-amber-50 border-2 border-amber-200 rounded-2xl shadow-sm">
              <Coins className="text-amber-600 animate-bounce" size={18} />
              <div className="text-left">
                <p className="text-[10px] font-black uppercase text-amber-800 tracking-tighter leading-none">Match Stakes</p>
                <p className="text-sm font-black text-amber-600">{WIN_PRIZE} PapaPoints</p>
              </div>
            </div>
          </div>

          {/* CENTRAL RADAR / BATTLE ICON */}
          <div className="flex justify-center py-4">
            <div className="relative">
              {/* Outer Ring */}
              <div className={`w-32 h-32 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-100 border-l-transparent transition-all duration-1000 ${
                status === 'searching' ? 'animate-spin' : 'border-green-500 rotate-180 scale-125'
              }`} />
              
              {/* Inner Circle */}
              <div className={`absolute inset-0 m-2 rounded-full flex items-center justify-center transition-all duration-500 ${
                status === 'matched' ? 'bg-green-500' : 'bg-blue-50'
              }`}>
                {status === 'matched' ? (
                  <Sword className="text-white animate-pulse" size={40} />
                ) : (
                  <Globe className="text-blue-500 animate-pulse" size={40} />
                )}
              </div>
            </div>
          </div>

          {/* STATUS MESSAGING */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-4xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">
                {status === 'searching' ? "Scanning Arena" : "Target Found"}
              </h2>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
                {status === 'searching' ? "Matching with similar Ranks..." : "Synchronizing Battle Data"}
              </p>
            </div>

            {/* OPPONENT CARD */}
            <div className={`transition-all duration-500 transform ${
              status === 'matched' ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <div className="inline-flex items-center gap-3 bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-xl">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-black text-xs">
                  {opponentName?.[0]?.toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-gray-400 font-black uppercase">Challenger</p>
                  <p className="font-black text-lg italic tracking-wider">{opponentName}</p>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex flex-col gap-6 items-center pt-4">
            {status === 'searching' ? (
              <button
                onClick={onCancel}
                className="group flex items-center gap-2 px-10 py-4 rounded-full bg-white border-2 border-red-100 text-red-500 hover:border-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg hover:shadow-red-200 active:scale-95"
              >
                <X size={18} />
                <span className="text-sm font-black uppercase tracking-widest">Abandon Queue</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 text-green-600 font-black uppercase text-xs animate-pulse">
                <ShieldCheck size={16} />
                Initializing Duel...
              </div>
            )}

            {/* PING DISPLAY */}
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className={`w-2 h-2 rounded-full ${status === 'matched' ? 'bg-green-500' : 'bg-blue-400 animate-ping'}`} />
              <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
                Region: Global Arena
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
