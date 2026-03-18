"use client";
import { Trophy, MapPin, User, ArrowUp } from "lucide-react";

export default function Leaderboard({ leaderboard = [], userStats = null }) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="p-6 bg-white dark:bg-zinc-900 border-[4px] border-zinc-900 dark:border-zinc-100 rounded-[2.5rem] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">

        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-center mb-8 flex items-center justify-center gap-3">
          <Trophy className="text-yellow-500" />
          Hall of Fame
        </h2>

        <div className="space-y-2">
          {leaderboard.map((run, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-4 border-2 border-zinc-900 rounded-2xl ${i === 0 ? 'bg-[#75c32c] text-white' : 'bg-zinc-50 dark:bg-zinc-800'
                }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-xl font-black italic w-6">#{i + 1}</span>
                <span className="font-black uppercase italic">{run.name || "Voyager"}</span>
              </div>
              <span className="text-xl font-black italic">{run.highestEndlessRun}m</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. THE "YOU ARE HERE" SECTION */}
      {userStats && !userStats.isTop10 && (
        <div className="p-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-[4px] border-[#75c32c] rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#75c32c] p-2 rounded-lg text-white">
                <User size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase opacity-60">Your Current Rank</p>
                <p className="text-lg font-black uppercase italic">#{userStats.rank} {userStats.name}</p>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1 justify-end text-[#75c32c]">
                <ArrowUp size={14} />
                <span className="text-xs font-black">KEEP GOING!</span>
              </div>
              <p className="text-xl font-black italic">{userStats.highestEndlessRun}m</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}