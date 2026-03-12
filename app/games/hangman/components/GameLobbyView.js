// components/GameLobbyView.js
import ModeSelector from './ModeSelector';
import OnlineLobby from './OnlineLobby';
import LevelBar from './LevelBar';

export default function GameLobbyView({ 
  gameState, 
  handleModeSelect, 
  profile, 
  requirements, 
  socket, 
  startNewGame 
}) {
  if (gameState === 'menu') {
    return <ModeSelector onSelect={handleModeSelect} profile={profile} requirements={requirements} />;
  }

  return (
    <div className="fixed inset-0 flex flex-col p-4 bg-gray-50 dark:bg-black overflow-hidden">
      <div className="max-w-2xl mx-auto w-full space-y-4">
        <LevelBar profile={profile} />
        <OnlineLobby socket={socket} profile={profile} onCancel={() => startNewGame(true)} />
      </div>
    </div>
  );
}