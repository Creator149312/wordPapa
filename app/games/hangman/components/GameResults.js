"use client";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  Trophy,
  XCircle,
  Coins,
  Flame,
  TrendingUp,
  PartyPopper,
  HeartCrack,
  Heart,
  Timer,
} from "lucide-react";
import ShareResult from "./ShareResult";

export default function GameResults({
  isWon,
  word,
  streak,
  xpEarned,
  coinsEarned,
  mode,
  onRestart,
  onRevive,
  onEndRun,
  isRunEnded,
  revivesUsed = 0,
  reviveCost = 50,
  countdown = null, // Passed from EndlessRunMode
}) {
  const isEndless = mode === "endless";

  // Only offer revive if in Endless, they lost, and the run hasn't officially ended
  const showReviveOffer =
    isEndless && !isWon && !isRunEnded && countdown !== null;
  const isRunEndedStatus = (!isWon && streak > 0) || (isEndless && isRunEnded);

  return (
    <div className="w-full pt-1 text-center space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* 1. EARNINGS HEADER */}
      <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-zinc-100 dark:bg-zinc-900/50 transition-colors border-b-2 border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl ${
              showReviveOffer
                ? "bg-amber-500/10 text-amber-600 animate-pulse"
                : isWon || isEndless
                  ? "bg-[#75c32c]/10 text-[#75c32c]"
                  : isRunEndedStatus
                    ? "bg-amber-500/10 text-amber-600"
                    : "bg-rose-500/10 text-rose-600"
            }`}
          >
            {showReviveOffer ? (
              <HeartCrack size={20} />
            ) : isWon || (isEndless && streak > 5) ? (
              <Trophy size={20} />
            ) : isRunEndedStatus ? (
              <PartyPopper size={20} />
            ) : (
              <XCircle size={20} />
            )}
          </div>
          <div className="text-left">
            <h2
              className={`text-sm font-black uppercase tracking-tight leading-none ${
                showReviveOffer
                  ? "text-amber-600"
                  : isWon || isEndless
                    ? "text-[#75c32c]"
                    : isRunEndedStatus
                      ? "text-amber-600"
                      : "text-rose-600"
              }`}
            >
              {showReviveOffer
                ? "Fuel is Empty!"
                : isEndless
                  ? "Run Complete!"
                  : isWon
                    ? "Success!"
                    : isRunEndedStatus
                      ? "Great Run!"
                      : "Failed"}
            </h2>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter mt-1">
              {showReviveOffer
                ? `Last chance to continue...`
                : isEndless
                  ? `Mastered ${streak} words`
                  : `Word: ${word}`}
            </p>
          </div>
        </div>

        {!showReviveOffer && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-black text-[10px] border border-zinc-200 dark:border-zinc-700">
              <TrendingUp size={10} className="text-[#75c32c]" /> +{xpEarned} XP
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 font-black text-[10px] border border-zinc-200 dark:border-zinc-700">
              <Coins size={10} fill="currentColor" />+{coinsEarned || 0}
            </div>
          </div>
        )}
      </div>

      {/* 2. STREAK / COUNTDOWN DISPLAY */}
      <div
        className={`rounded-2xl px-4 py-3 flex items-center justify-between relative overflow-hidden transition-all duration-300 ${
          showReviveOffer
            ? "bg-amber-500/10 border-2 border-amber-500/50 scale-[1.02]"
            : "bg-zinc-100 dark:bg-zinc-900/50 border border-transparent"
        }`}
      >
        <div className="flex items-center gap-4 relative z-10 w-full">
          <div className="relative">
            <h3
              className={`text-4xl font-black tracking-tighter ${
                showReviveOffer
                  ? "text-amber-600 animate-bounce-subtle"
                  : streak > 0
                    ? "text-orange-500"
                    : "text-zinc-400"
              }`}
            >
              {showReviveOffer ? countdown : streak}
            </h3>
            {streak > 0 && !showReviveOffer && (
              <Flame
                className="absolute -top-1 -right-4 text-orange-500 animate-pulse"
                size={14}
                fill="currentColor"
              />
            )}
            {showReviveOffer && (
              <Timer
                className="absolute -top-1 -right-5 text-amber-600 animate-spin-slow"
                size={16}
              />
            )}
          </div>
          <div className="text-left flex-1">
            <p
              className={`text-[10px] font-black uppercase tracking-wider ${
                showReviveOffer ? "text-amber-700" : "text-zinc-500"
              }`}
            >
              {showReviveOffer
                ? "Revive Timer"
                : isEndless
                  ? "Words Mastered"
                  : "Current Streak"}
            </p>
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight mt-0.5">
              {showReviveOffer
                ? "Quick! Your run is about to end."
                : "You're becoming a legend!"}
            </p>
          </div>
        </div>
      </div>

      {/* 3. ACTIONS */}
      <div className="flex items-center gap-2 pt-1">
        {showReviveOffer ? (
          <>
            <Button
              onClick={onEndRun}
              className="flex-1 h-12 rounded-2xl bg-zinc-200 dark:bg-zinc-800 text-zinc-500 font-black uppercase text-[10px] tracking-widest hover:bg-zinc-300 transition-all active:scale-95"
            >
              Give Up
            </Button>
            <Button
              onClick={onRevive}
              className="flex-[2] h-12 rounded-2xl bg-amber-500 text-white font-black uppercase text-[11px] tracking-widest shadow-lg shadow-amber-500/40 hover:bg-amber-600 hover:scale-[1.02] transition-all relative overflow-hidden group"
            >
              {/* SHOCK BAR: Visual drain effect */}
              <div
                className="absolute bottom-0 left-0 h-1.5 bg-white/40 transition-all duration-1000 ease-linear"
                style={{ width: `${(countdown / 6) * 100}%` }}
              />

              <div className="flex items-center justify-center gap-2 relative z-10">
                <Heart size={14} className="fill-white animate-pulse" />
                <span>Revive ({reviveCost})</span>
              </div>
            </Button>
          </>
        ) : (
          <>
            <div className="flex-none">
              <ShareResult
                word={word}
                isWon={isWon}
                streak={streak}
                mode={mode}
                variant="icon"
              />
            </div>
            <Button
              onClick={onRestart}
              className={`flex-1 h-12 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all active:scale-95 text-white ${
                isWon
                  ? "bg-[#75c32c] hover:bg-[#64a825]"
                  : "bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90"
              }`}
            >
              {isEndless ? "New Run" : isWon ? "Next Word" : "Try Again"}
              <RefreshCw size={14} className="ml-2" />
            </Button>
          </>
        )}
      </div>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes bounce-subtle {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 0.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
