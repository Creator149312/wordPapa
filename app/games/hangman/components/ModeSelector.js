'use client';
import { Card } from "@/components/ui/card";
import { Coffee, Globe, Users, Lock, Coins, Flame, Trophy, ChevronRight } from "lucide-react";

export default function ModeSelector({ onSelect, profile, requirements }) {
  const isXPLocked = profile.xp < requirements.MIN_XP;
  const isCoinLocked = profile.papaPoints < requirements.MIN_COINS;
  const isLocked = isXPLocked || isCoinLocked;

  return (
    <Card className="p-8 md:p-8 rounded-[2.5rem] border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl max-w-4xl mx-auto animate-in fade-in zoom-in duration-700">
      <div className="space-y-2 mb-6">
        {/* Minimalist Top Nav/Header Area */}
        <header className="relative z-10 pt-2 pb-2 px-6 flex flex-col items-center gap-2">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-gray-900 dark:text-white leading-none">
            Hang<span className="text-[#75c32c]">Papa</span>
          </h1>
        </header>
        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.4em]">Select your battleground</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* ENDLESS CLASSIC MODE */}
        <button
          onClick={() => onSelect('classic')}
          className="group relative p-8 rounded-[2rem] bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 border-2 border-transparent hover:border-[#75c32c] transition-all duration-500 text-left flex flex-col h-full shadow-sm hover:shadow-2xl hover:-translate-y-1"
        >
          {profile.highestStreak > 0 && (
            <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 bg-orange-500 text-white rounded-full shadow-lg shadow-orange-500/20">
              <Flame size={12} fill="currentColor" />
              <span className="text-[10px] font-black">{profile.highestStreak}</span>
            </div>
          )}

          <div className="mb-8">
            <div className="w-14 h-14 bg-[#75c32c]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <Coffee className="text-[#75c32c]" size={30} strokeWidth={2.5} />
            </div>
            <h3 className="font-black text-2xl text-gray-900 dark:text-white uppercase tracking-tighter">Classic Run</h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest mt-2 leading-relaxed">
              Infinite words. <br />One life. <span className="text-[#75c32c] font-black">Build a legacy.</span>
            </p>
          </div>

          <div className="mt-auto flex items-center gap-2 text-[#75c32c] font-black text-[10px] uppercase tracking-[0.2em]">
            Quick Play <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* ONLINE 1v1 DUEL */}
        {/* <button
          onClick={() => !isLocked ? onSelect('online') : null}
          className={`group relative p-8 rounded-[2rem] border-2 transition-all duration-500 text-left flex flex-col h-full overflow-hidden ${isLocked
              ? "border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 cursor-not-allowed"
              : "border-transparent bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 hover:-translate-y-1"
            }`}
        >
         
          <div className={`absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isLocked ? "bg-gray-200 dark:bg-gray-700 text-gray-500" : "bg-white/20 text-white backdrop-blur-md"
            }`}>
            {isLocked ? <Lock size={10} /> : <span className="relative flex h-2 w-2 mr-1"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span></span>}
            {isLocked ? "Level Restricted" : "Live Duel"}
          </div>

          <div className="mb-8">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${isLocked ? 'bg-gray-200 dark:bg-gray-800' : 'bg-white/10 group-hover:rotate-12'}`}>
              <Globe className={isLocked ? "text-gray-400" : "text-white"} size={30} strokeWidth={2.5} />
            </div>
            <h3 className={`font-black text-2xl uppercase tracking-tighter ${isLocked ? 'text-gray-400' : 'text-white'}`}>Online Arena</h3>

            {isLocked ? (
              <div className="mt-4 space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-black uppercase text-gray-400">
                    <span>XP Progress</span>
                    <span>{profile.xp}/{requirements.MIN_XP}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-[#75c32c] transition-all duration-1000" style={{ width: `${Math.min((profile.xp / requirements.MIN_XP) * 100, 100)}%` }} />
                  </div>
                </div>
                {isCoinLocked && (
                  <p className="text-[10px] text-amber-600 font-black uppercase flex items-center gap-1">
                    <Coins size={10} /> Entry: {requirements.MIN_COINS} needed
                  </p>
                )}
              </div>
            ) : (
              <p className="text-[11px] text-blue-100 font-medium uppercase tracking-widest mt-2 leading-relaxed">
                Compete for <span className="underline decoration-white/30 underline-offset-4">{requirements.MIN_COINS * 2} Coins</span>.<br />Ranked Matchmaking.
              </p>
            )}
          </div>

          <div className={`mt-auto flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] ${isLocked ? 'text-gray-400' : 'text-white'}`}>
            {isLocked ? 'Boost XP to Unlock' : 'Join Queue'} <ChevronRight size={14} className={isLocked ? '' : 'group-hover:translate-x-1 transition-transform'} />
          </div>
        </button> */}
      </div>

      {/* Footer Stats */}
      {/* <div className="mt-10 flex items-center justify-center gap-8 border-t border-gray-100 dark:border-gray-800 pt-8 opacity-60">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 tracking-widest">
          <Users size={14} className="text-blue-500" />
          <span>2.4k Online</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 tracking-widest">
          <Trophy size={14} className="text-amber-500" />
          <span>Season 1 Ends in 4d</span>
        </div>
      </div> */}
    </Card>
  );
}