'use client';
import { Users, Shield, Snowflake, Heart } from 'lucide-react';

export default function OnlineRaceTracker({
  myCount = 0,
  oppCount = 0,
  total = 0,
  oppName = "Challenger",
  myWrongCount = 0,
  oppWrongCount = 0,
  maxWrong = 6,
  myShield = false,
  oppShield = false,
  myFrozen = false,
  oppFrozen = false,
}) {
  if (!oppName) return null;

  const myLives = Math.max(0, maxWrong - myWrongCount);
  const oppLives = Math.max(0, maxWrong - oppWrongCount);

  return (
    <div className="w-full p-4 bg-slate-900/90 text-white rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-4">
      <div className="flex justify-between items-start mb-3">
        {/* User Stats */}
        <div className="text-left space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black text-[#75c32c] uppercase tracking-widest">
              You
            </span>
            {myShield && (
              <span className="flex items-center gap-0.5 px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[8px] font-black border border-amber-400/50">
                <Shield size={8} className="fill-amber-300" /> Shield
              </span>
            )}
            {myFrozen && (
              <span className="flex items-center gap-0.5 px-1 py-0.2 rounded bg-sky-500/20 text-sky-300 text-[8px] font-black border border-sky-400/50 animate-pulse">
                <Snowflake size={8} /> Frozen
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white">{myCount}</span>
            <span className="text-xs font-bold text-slate-400">/ {total}</span>
          </div>

          <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
            <Heart size={10} className="text-emerald-400 fill-emerald-400" />
            <span>{myLives} lives</span>
          </div>
        </div>

        {/* Center VS Divider */}
        <div className="flex flex-col items-center pt-1">
          <div className="px-3 py-1 bg-slate-800 rounded-full border border-slate-700 shadow-inner">
            <span className="text-[10px] font-black text-fuchsia-400 italic tracking-wider">
              VS
            </span>
          </div>
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter mt-1">
            1v1 DUEL
          </span>
        </div>

        {/* Opponent Stats */}
        <div className="text-right space-y-1">
          <div className="flex items-center justify-end gap-1.5">
            {oppFrozen && (
              <span className="flex items-center gap-0.5 px-1 py-0.2 rounded bg-sky-500/20 text-sky-300 text-[8px] font-black border border-sky-400/50 animate-pulse">
                <Snowflake size={8} /> Frozen
              </span>
            )}
            {oppShield && (
              <span className="flex items-center gap-0.5 px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[8px] font-black border border-amber-400/50">
                <Shield size={8} className="fill-amber-300" /> Shield
              </span>
            )}
            <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest truncate max-w-[80px]">
              {oppName}
            </span>
          </div>

          <div className="flex items-baseline justify-end gap-1">
            <span className="text-2xl font-black text-white">{oppCount}</span>
            <span className="text-xs font-bold text-slate-400">/ {total}</span>
          </div>

          <div className="flex items-center justify-end gap-1 text-[9px] font-bold text-slate-400">
            <span>{oppLives} lives</span>
            <Heart size={10} className="text-rose-400 fill-rose-400" />
          </div>
        </div>
      </div>

      {/* Visual Dual Progress Bars */}
      <div className="space-y-1.5">
        {/* Your Progress */}
        <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-[#75c32c] transition-all duration-500 ease-out"
            style={{ width: `${total > 0 ? (myCount / total) * 100 : 0}%` }}
          />
        </div>
        {/* Opponent Progress */}
        <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-rose-500 transition-all duration-500 ease-out"
            style={{ width: `${total > 0 ? (oppCount / total) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between text-[8px] font-black uppercase text-slate-400 tracking-wider">
        <span className="text-emerald-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live Match
        </span>
        <span className="text-slate-500">First to solve wins</span>
      </div>
    </div>
  );
}