import { RANKS, calculateLevel } from '../lib/progression';

export default function LevelBar({ profile }) {
  const { xp, papaPoints } = profile;
  
  const currentRank = calculateLevel(xp);
  const nextRank = RANKS[RANKS.indexOf(currentRank) + 1] || currentRank;
  
  // Calculate percentage toward next rank
  const range = nextRank.minXP - currentRank.minXP;
  const progress = range === 0 ? 100 : ((xp - currentRank.minXP) / range) * 100;

  return (
    <div className="w-full space-y-3">
      {/* Your Global Progress Header Logic */}
      <div className="flex justify-between items-center px-6 py-3 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-black text-xs transition-colors duration-500" 
            style={{ color: currentRank.color, border: `2px solid ${currentRank.color}44` }}
          >
            {xp}
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">Current Rank</p>
            <p className="text-sm font-black uppercase italic" style={{ color: currentRank.color }}>
              {currentRank.name}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">Papa Points</p>
          <p className="text-sm font-black text-[#75c32c]">🪙 {papaPoints}</p>
        </div>
      </div>

      {/* The Visual Progress Bar */}
      <div className="px-2">
        <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-1000 ease-out rounded-full"
            style={{ 
              width: `${progress}%`, 
              backgroundColor: currentRank.color,
              boxShadow: `0 0 8px ${currentRank.color}44`
            }}
          />
        </div>
        <div className="flex justify-between mt-1 px-1">
           <span className="text-[8px] font-bold text-gray-400 uppercase">LVL Progress</span>
           <span className="text-[8px] font-bold text-gray-400 uppercase">Next: {nextRank.minXP} XP</span>
        </div>
      </div>
    </div>
  );
}