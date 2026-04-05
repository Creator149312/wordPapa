"use client";
import ModeSelector from "./ModeSelector";
import OnlineLobby from "./OnlineLobby";

export default function GameLobbyView({
  gameState,
  handleModeSelect,
  profile,
  requirements,
  socket,
  startNewGame,
}) {
  // Online Lobby View (Fullscreen Overlay)
  if (gameState === "lobby") {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col p-4 bg-zinc-50/95 dark:bg-black/95 backdrop-blur-md overflow-hidden animate-in fade-in duration-300">
        <div className="max-w-2xl mx-auto w-full pt-12">
          <OnlineLobby
            socket={socket}
            profile={profile}
            onCancel={() => startNewGame(true)}
          />
        </div>
      </div>
    );
  }

  // Main Menu View
  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <ModeSelector
        onSelect={handleModeSelect}
        profile={profile}
        requirements={requirements}
      />
    </div>
  );
}
