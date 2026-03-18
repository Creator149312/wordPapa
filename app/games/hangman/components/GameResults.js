"use client";
import { Button } from "@/components/ui/button";
import {
  RefreshCw, Trophy, XCircle, Coins, Flame, Star,
  TrendingUp, PartyPopper, HeartCrack, Heart
} from "lucide-react";
import ShareResult from "./ShareResult";

export default function GameResults({
  isWon, word, streak, xpEarned, coinsEarned, mode, onRestart,
  // NEW PROPS FOR REVIVE
  onRevive, onEndRun, isRunEnded, revivesUsed = 0, reviveCost = 50
}) {
  const isEndless = mode === "endless";
  const isOnline = mode === "online";

  // Check if we should show the Revive Offer instead of the final score
  const showReviveOffer = isEndless && !isWon && !isRunEnded && revivesUsed < 1;

  const isRunEndedStatus = (!isWon && streak > 0) || (isEndless && isRunEnded);
  const isPureLoss = !isWon && streak === 0 && !showReviveOffer;

  return (
    <div className="w-full pt-1 text-center space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* 1. EARNINGS HEADER */}
      <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-zinc-100 dark:bg-zinc-900/50 transition-colors">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${
            showReviveOffer ? "bg-amber-500/10 text-amber-600" :
            isWon || isEndless ? "bg-[#75c32c]/10 text-[#75c32c]" :
            isRunEndedStatus ? "bg-amber-500/10 text-amber-600" : "bg-rose-500/10 text-rose-600"
          }`}>
            {showReviveOffer ? <HeartCrack size={20} /> :
             isWon || (isEndless && streak > 5) ? <Trophy size={20} /> :
             isRunEndedStatus ? <PartyPopper size={20} /> : <XCircle size={20} />}
          </div>
          <div className="text-left">
            <h2 className={`text-sm font-black uppercase tracking-tight leading-none ${
              showReviveOffer ? "text-amber-600" :
              isWon || isEndless ? "text-[#75c32c]" :
              isRunEndedStatus ? "text-amber-600" : "text-rose-600"
            }`}>
              {showReviveOffer ? "Out of Lives!" : isEndless ? "Run Complete!" : isWon ? "Success!" : isRunEndedStatus ? "Great Run!" : "Failed"}
            </h2>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter mt-1">
              {showReviveOffer ? "Don't give up yet" : isEndless ? "Final Score Reached" : `Word: ${word}`}
            </p>
          </div>
        </div>

        {/* Hide earnings if it's just a revive offer to build tension */}
        {!showReviveOffer && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-black text-[10px]">
              <TrendingUp size={10} className="text-[#75c32c]" /> +{xpEarned} XP
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 font-black text-[10px]">
              <Coins size={10} fill="currentColor" />+{coinsEarned || 0}
            </div>
          </div>
        )}
      </div>

      {/* 2. STREAK DISPLAY */}
      <div className={`rounded-2xl px-4 py-3 flex items-center justify-between relative overflow-hidden ${
        showReviveOffer ? "bg-amber-500/10 border border-amber-500/20" : "bg-zinc-100 dark:bg-zinc-900/50"
      }`}>
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative">
            <h3 className={`text-4xl font-black tracking-tighter ${streak > 0 ? "text-orange-500" : "text-zinc-400"}`}>
              {streak}
            </h3>
            {streak > 0 && <Flame className="absolute -top-1 -right-4 text-orange-500 animate-pulse" size={14} fill="currentColor" />}
          </div>
          <div className="text-left">
            <p className={`text-[10px] font-black uppercase tracking-wider ${showReviveOffer ? "text-amber-600" : "text-zinc-500"}`}>
              {isEndless ? "Words Mastered" : "Current Streak"}
            </p>
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight mt-0.5">
              {showReviveOffer ? "Save your progress!" : isEndless ? "Endless Legend" : "Keep it burning!"}
            </p>
          </div>
        </div>
      </div>

      {/* 3. ACTIONS (Revive or Restart) */}
      <div className="flex items-center gap-2 pt-1">
        {showReviveOffer ? (
          <>
            <Button onClick={onEndRun} className="flex-1 h-12 rounded-2xl bg-zinc-200 dark:bg-zinc-800 text-zinc-500 font-black uppercase text-[10px] tracking-widest hover:bg-zinc-300">
              Give Up
            </Button>
            <Button onClick={onRevive} className="flex-[2] h-12 rounded-2xl bg-amber-500 text-white font-black uppercase text-[11px] tracking-widest shadow-lg shadow-amber-500/20 hover:bg-amber-600 hover:scale-[1.02] transition-all">
              <Heart size={14} className="mr-2 fill-white animate-pulse" /> Revive (-{reviveCost})
            </Button>
          </>
        ) : (
          <>
            <div className="flex-none">
              <ShareResult word={word} isWon={isWon} streak={streak} mode={mode} variant="icon" />
            </div>
            <Button onClick={onRestart} className={`flex-1 h-12 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all active:scale-95 text-white ${
              isWon ? "bg-[#75c32c]" : "bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900"
            }`}>
              {isEndless ? "New Run" : isWon ? "Next Word" : "Try Again"}
              <RefreshCw size={14} className="ml-2" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}