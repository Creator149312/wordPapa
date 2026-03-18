// components/GameLobbyView.js
"use client";
import { useState } from "react";
import ModeSelector from './ModeSelector';
import OnlineLobby from './OnlineLobby';
import LeaderBoard from './LeaderBoard';
import { Trophy, LayoutGrid } from "lucide-react";

export default function GameLobbyView({ 
  gameState, 
  handleModeSelect, 
  profile, 
  requirements, 
  socket, 
  startNewGame 
}) {
  const [activeTab, setActiveTab] = useState("modes"); // 'modes' or 'leaderboard'

  // 1. Online Lobby View (Fullscreen Overlay)
  if (gameState === 'lobby') {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col p-4 bg-zinc-50/95 dark:bg-black/95 backdrop-blur-md overflow-hidden animate-in fade-in duration-300">
        <div className="max-w-2xl mx-auto w-full pt-12">
          <OnlineLobby socket={socket} profile={profile} onCancel={() => startNewGame(true)} />
        </div>
      </div>
    );
  }

  // 2. Main Menu View
  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Tab Switcher: Sketchy Style */}
      <div className="flex justify-center items-center gap-3">
        <button
          onClick={() => setActiveTab("modes")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black uppercase italic tracking-tighter border-[3px] transition-all duration-200 ${
            activeTab === "modes"
              ? "bg-[#75c32c] text-white border-zinc-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1"
              : "bg-white dark:bg-zinc-900 text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-zinc-600"
          }`}
        >
          <LayoutGrid size={18} />
          Play Modes
        </button>

        <button
          onClick={() => setActiveTab("leaderboard")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black uppercase italic tracking-tighter border-[3px] transition-all duration-200 ${
            activeTab === "leaderboard"
              ? "bg-[#75c32c] text-white border-zinc-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1"
              : "bg-white dark:bg-zinc-900 text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-zinc-600"
          }`}
        >
          <Trophy size={18} />
          Hall of Fame
        </button>
      </div>

      {/* Conditional Content Rendering */}
      <div className="relative min-h-[400px]">
        {activeTab === "modes" ? (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <ModeSelector 
              onSelect={handleModeSelect} 
              profile={profile} 
              requirements={requirements} 
            />
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <LeaderBoard />
          </div>
        )}
      </div>

      {/* Decorative Footer Detail */}
      <div className="flex justify-center opacity-20 pointer-events-none">
        <svg width="100" height="20" viewBox="0 0 100 20">
          <path d="M0 10 Q 25 0, 50 10 T 100 10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
        </svg>
      </div>
    </div>
  );
}