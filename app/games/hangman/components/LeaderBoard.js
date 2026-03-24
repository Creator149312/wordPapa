"use client";
import { useState } from "react";
import {
  Trophy,
  User,
  ArrowUp,
  Star,
  Medal,
  Zap,
  Globe,
  Award,
} from "lucide-react";

export default function LeaderBoard({
  leaderboardData = { global: [], endless: [] },
  userStats = null,
  isLoading = false,
}) {
  const [view, setView] = useState("endless");

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto animate-pulse space-y-4">
        <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded-[2.5rem] border-[4px] border-zinc-300" />
      </div>
    );
  }

  const currentList =
    view === "endless" ? leaderboardData.endless : leaderboardData.global;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* 1. TOGGLE SWITCH */}
      <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-2xl border-[3px] border-zinc-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <button
          onClick={() => setView("endless")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black uppercase italic transition-all duration-200 ${
            view === "endless"
              ? "bg-zinc-900 text-white shadow-inner"
              : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          <Zap size={18} fill={view === "endless" ? "currentColor" : "none"} />{" "}
          Endless Run
        </button>
        <button
          onClick={() => setView("global")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black uppercase italic transition-all duration-200 ${
            view === "global"
              ? "bg-zinc-900 text-white shadow-inner"
              : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          <Globe size={18} /> Global XP
        </button>
      </div>

      {/* 2. HALL OF FAME CARD */}
      <div className="p-4 md:p-8 bg-white dark:bg-zinc-900 border-[4px] border-zinc-900 rounded-[2.5rem] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-center mb-3 md:mb-6">
          <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter flex items-center justify-center gap-3">
            <Trophy className="text-yellow-500 w-8 h-8" />
            Hall of Fame
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mt-1">
            {view === "endless"
              ? "Highest Single Run Performance"
              : "Lifetime Word-Papa Rankings"}
          </p>
        </div>

        <div className="space-y-3">
          {currentList && currentList.length > 0 ? (
            currentList.map((player, i) => {
              const isTop3 = i < 3;
              const isMe =
                userStats?.userEmail &&
                player.userEmail === userStats.userEmail;

              const medalColors = [
                "text-yellow-400",
                "text-zinc-300",
                "text-orange-400",
              ];

              // UPDATED SCHEMA LOGIC
              // Endless View: Highest Run XP | Global View: Total Cumulative XP
              const primaryXP =
                view === "endless"
                  ? player.highestEndlessXP || 0
                  : player.xp || 0;

              // Show the highest word streak achieved in Endless mode
              const wordCount = player.highestEndlessRun || 0;

              return (
                <div
                  key={player._id || i}
                  className={`relative group flex items-center justify-between p-4 border-2 border-zinc-900 rounded-2xl transition-all ${
                    isMe
                      ? "ring-4 ring-yellow-400/30 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10 scale-[1.02] z-10"
                      : i === 0
                        ? "bg-[#75c32c] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        : "bg-zinc-50 dark:bg-zinc-800/50"
                  }`}
                >
                  {isMe && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-zinc-900 text-[8px] font-black px-3 py-1 rounded-full border-2 border-zinc-900 uppercase tracking-tighter shadow-sm">
                      Your Rank
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <div className="w-8 flex justify-center">
                      {isTop3 ? (
                        <Medal
                          className={
                            i === 0 && !isMe ? "text-white" : medalColors[i]
                          }
                          size={28}
                          fill="currentColor"
                        />
                      ) : (
                        <span className="text-xl font-black italic opacity-30">
                          #{i + 1}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <span className="font-black uppercase italic tracking-tight leading-none text-lg">
                        {player.name || "Anonymous Papa"}
                      </span>

                      {/* Word Streak Badge */}
                      <div className="flex items-center mt-1">
                        <span
                          className={`flex items-center gap-1 text-[8px] font-black px-2 py-0.5 rounded-md border-2 border-zinc-900/10 uppercase italic ${
                            i === 0 && !isMe
                              ? "bg-white/20 text-white"
                              : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
                          }`}
                        >
                          <Award size={8} /> {wordCount} Words Run
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Star
                        size={14}
                        fill="currentColor"
                        className={
                          i === 0 && !isMe ? "text-white" : "text-yellow-500"
                        }
                      />
                      <span className="text-2xl font-black italic tracking-tighter leading-none">
                        {primaryXP.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-[9px] font-black uppercase opacity-60">
                      {view === "endless" ? "Best Run XP" : "Total XP"}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-20 text-center">
              <div className="opacity-10 mb-2 flex justify-center">
                <Trophy size={48} />
              </div>
              <p className="opacity-30 font-black uppercase italic">
                No champions yet... start a run!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. PERSISTENT USER FOOTER */}
      {userStats && (
        <div
          className={`p-5 rounded-[2rem] border-[4px] border-zinc-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-bottom-6 duration-500 
          ${view === "endless" ? "bg-amber-500 text-white" : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl border-[3px] border-current bg-current/10">
                <User size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase opacity-70 italic">
                  {view === "endless"
                    ? "Personal Best Run"
                    : "Lifetime Achievement"}
                </p>
                <h3 className="text-xl font-black uppercase italic tracking-tight">
                  {userStats.name || "Player One"}
                </h3>
              </div>
            </div>

            <div className="text-right flex flex-col items-end">
              <div className="flex items-center gap-1 mb-1">
                <ArrowUp size={14} className="animate-bounce" />
                <span className="text-[10px] font-black uppercase italic tracking-widest">
                  {view === "endless" ? "High Score" : "Rank Progress"}
                </span>
              </div>
              <p className="text-3xl font-black italic tracking-tighter leading-none">
                {view === "endless"
                  ? (userStats.highestEndlessXP || 0).toLocaleString()
                  : (userStats.xp || 0).toLocaleString()}
                <span className="text-xs ml-1 uppercase not-italic opacity-70">
                  XP
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
