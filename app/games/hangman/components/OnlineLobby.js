
'use client';
import { useState, useEffect } from 'react';
import { Globe, ShieldCheck, Users, X } from 'lucide-react';

export default function OnlineLobby({ socket, profile, onCancel }) {
  const [status, setStatus] = useState('searching'); 
  const [opponentName, setOpponentName] = useState('');

  useEffect(() => {
    if (!socket) return;

    // Function to handle joining logic
    const joinQueue = () => {
      if (socket.connected) {
        console.log("📡 Emitting join-queue for:", profile?.name);
        socket.emit('join-queue', { 
          username: profile?.name || "Anonymous Papa" 
        });
      }
    };

    // If already connected, join. If not, wait for connect event.
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
    <div className="w-full max-w-2xl mx-auto py-12 px-6">
      <div className="bg-white dark:bg-gray-900 rounded-[3rem] border-4 border-dashed border-blue-100 dark:border-gray-800 p-12 flex flex-col items-center text-center relative overflow-hidden">
        
        <div className={`absolute inset-0 transition-colors duration-1000 ${
          status === 'matched' ? 'bg-green-50/50' : 'bg-blue-50/30'
        } animate-pulse -z-0`} />

        <div className="relative z-10 space-y-8">
          <div className="flex justify-center">
            <div className="relative">
              <div className={`w-24 h-24 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-200 border-l-transparent ${
                status === 'searching' ? 'animate-spin' : 'border-green-500'
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

          <div className="space-y-2">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">
              {status === 'searching' ? "Searching for Rivals..." : "Match Found!"}
            </h2>
            <p className="text-gray-500 font-medium text-sm uppercase tracking-widest min-h-[20px]">
              {status === 'searching' ? "Scanning global servers..." : `Opponent: ${opponentName}`}
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-2xl">
              <div className={`w-2 h-2 rounded-full animate-ping ${status === 'matched' ? 'bg-green-500' : 'bg-blue-500'}`} />
              <span className="text-[10px] font-black uppercase text-gray-600">
                {status === 'matched' ? 'Connected' : 'Looking...'}
              </span>
            </div>
          </div>

          {status === 'searching' && (
            <button
              onClick={onCancel}
              className="group flex items-center gap-2 mx-auto px-6 py-3 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
            >
              <X size={16} />
              <span className="text-xs font-black uppercase tracking-widest">Cancel</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
