'use client';
import { useState, useEffect } from 'react';
import { Globe, ShieldCheck, Users, X } from 'lucide-react';

export default function OnlineLobby({ socket, profile, onCancel }) {
  // We only need local status for the UI text/animation
  const [status, setStatus] = useState('searching'); // 'searching' | 'matched'
  const [opponentName, setOpponentName] = useState('');

  useEffect(() => {
    if (!socket) return;

    // 1. Tell the server we are looking for a game
    socket.emit('join-queue', { 
      username: profile?.name || "Anonymous Papa",
      rank: "Bronze" // You can pass real rank logic here later
    });

    // 2. Listen locally just to update the UI "Success" state
    // Note: Hangman.js also listens to this to switch the whole screen
    const handleMatchFound = (data) => {
      setStatus('matched');
      setOpponentName(data.opponentName);
    };

    socket.on('match-found', handleMatchFound);

    return () => {
      socket.off('match-found', handleMatchFound);
    };
  }, [socket, profile]);

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-gray-900 rounded-[3rem] border-4 border-dashed border-blue-100 dark:border-gray-800 p-12 flex flex-col items-center text-center relative overflow-hidden">
        
        {/* Animated Background Pulse */}
        <div className={`absolute inset-0 transition-colors duration-1000 ${
          status === 'matched' ? 'bg-green-50/50 dark:bg-green-900/10' : 'bg-blue-50/30 dark:bg-blue-900/10'
        } animate-pulse -z-0`} />

        <div className="relative z-10 space-y-8">
          {/* Visual Indicator */}
          <div className="flex justify-center">
            <div className="relative">
              <div className={`w-24 h-24 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-200 border-l-transparent transition-all duration-500 ${
                status === 'searching' ? 'animate-spin' : 'rotate-180 border-green-500'
              }`} />
              <div className="absolute inset-0 flex items-center justify-center">
                {status === 'matched' ? (
                  <Users className="text-green-600 animate-bounce" size={32} />
                ) : (
                  <Globe className="text-blue-400 animate-pulse" size={32} />
                )}
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-2">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">
              {status === 'searching' && "Searching for Rivals..."}
              {status === 'matched' && "Match Found!"}
            </h2>
            <p className="text-gray-500 font-medium text-sm uppercase tracking-widest min-h-[20px]">
              {status === 'searching' && "Scanning global servers..."}
              {status === 'matched' && `Connecting to ${opponentName}`}
            </p>
          </div>

          {/* Stats/Status Pills */}
          <div className="flex gap-3 justify-center">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className={`w-2 h-2 rounded-full animate-ping ${status === 'matched' ? 'bg-green-500' : 'bg-blue-500'}`} />
              <span className="text-[10px] font-black uppercase text-gray-600">
                {status === 'matched' ? 'Stable Link' : '1,204 Online'}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <ShieldCheck size={14} className="text-blue-500" />
              <span className="text-[10px] font-black uppercase text-gray-600">Fair Play On</span>
            </div>
          </div>

          {/* Cancel Button */}
          {status === 'searching' && (
            <button
              onClick={onCancel}
              className="group flex items-center gap-2 mx-auto px-6 py-3 rounded-full bg-red-50 dark:bg-red-950/30 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
            >
              <X size={16} className="group-hover:rotate-90 transition-transform" />
              <span className="text-xs font-black uppercase tracking-widest">Cancel Search</span>
            </button>
          )}
        </div>
      </div>

      {/* Lobby Tip */}
      <p className="mt-8 text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
        Tip: Stay focused! Opponents can see your progress in real-time.
      </p>
    </div>
  );
}