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
  Wind,
  Map,
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
  countdown = null,
  journeyProgress = null,
  journeyNode = null,
  rankCompleted = false,
  rankBonusXP = 0,
  arenaCompleted = false,
  arenaBonusXP = 0,
  onContinueJourney,
  nextNodeId = null,
  onBackToJourney = null,
}) {
  const isEndless = mode === "endless";
  const isJourney = mode === "journey";
  const showArenaCompletion = arenaCompleted || rankCompleted;
  const resolvedArenaBonusXP = arenaBonusXP || rankBonusXP;

  const showReviveOffer =
    (isEndless || isJourney) && !isWon && !isRunEnded && countdown !== null;
  const isRunEndedStatus = (!isWon && streak > 0) || ((isEndless || isJourney) && isRunEnded);

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
              <Wind size={20} className="animate-bounce-subtle" /> // Changed icon to Wind
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
                ? "Balloons Popped!" // Changed from Fuel is Empty
                : isJourney
                  ? isWon
                    ? "Node Complete!"
                    : isRunEndedStatus
                      ? "Journey Halted"
                      : "Try Again"
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
                ? `Quick! Refill your air...` // Changed text
                : isJourney
                  ? `Cleared ${streak} words`
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
                ? isJourney
                  ? "Revive Window"
                  : "Air Supply Timer"
                : isJourney
                  ? "Words Cleared"
                  : isEndless
                  ? "Words Mastered"
                  : "Current Streak"}
            </p>
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight mt-0.5">
              {showReviveOffer
                ? isJourney
                  ? "Use a revive if you want to keep this node run alive."
                  : "Don't fall! Refill air to stay afloat."
                : "You're becoming a legend!"}
            </p>
          </div>
        </div>
      </div>

      {/* 2.5. JOURNEY PROGRESS DISPLAY (Optional) */}
      {journeyProgress && journeyNode && (
        <div
          className={`rounded-2xl px-4 py-3 border-2 animate-in fade-in slide-in-from-bottom-2 duration-500 ${
            journeyProgress.completed
              ? "bg-purple-500/10 border-purple-500/50 shadow-lg shadow-purple-500/20"
              : "bg-blue-500/10 border-blue-500/30"
          }`}
        >
          <div className="flex items-center gap-3">
            {journeyProgress.completed ? (
              <PartyPopper className="text-purple-600 dark:text-purple-400" size={20} />
            ) : (
              <TrendingUp className="text-blue-600 dark:text-blue-400" size={20} />
            )}
            <div className="text-left flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                {journeyProgress.completed
                  ? `🎉 Node ${journeyNode.nodeId} Complete!`
                  : `Node ${journeyNode.nodeId} Progress`}
              </p>
              <div className="mt-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    journeyProgress.completed
                      ? "bg-purple-500"
                      : "bg-blue-500"
                  }`}
                  style={{
                    width: `${journeyProgress.percent}%`,
                  }}
                />
              </div>
              <p className="text-[9px] font-bold mt-1 text-zinc-500">
                {journeyProgress.percent}% Mastered
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2.6. RANK COMPLETION BONUS */}
      {showArenaCompletion && resolvedArenaBonusXP > 0 && (
        <div className="rounded-2xl px-4 py-3 border-2 border-yellow-400/60 bg-yellow-400/10 animate-in fade-in slide-in-from-bottom-2 duration-700 shadow-lg shadow-yellow-400/20">
          <div className="flex items-center gap-3">
            <Trophy className="text-yellow-500" size={22} />
            <div className="text-left flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-yellow-700 dark:text-yellow-300">
                🏆 Arena Complete!
              </p>
              <p className="text-[9px] font-bold mt-0.5 text-yellow-600 dark:text-yellow-400">
                Mastered all 5 nodes · Bonus +{resolvedArenaBonusXP} XP
              </p>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-400/20 text-yellow-700 dark:text-yellow-300 font-black text-[10px] border border-yellow-400/40">
              <TrendingUp size={10} /> +{resolvedArenaBonusXP}
            </div>
          </div>
        </div>
      )}

      {/* 3. ACTIONS */}
      <div className="flex items-center gap-2 pt-1">
        {showReviveOffer ? (
          <>
            <Button
              onClick={onEndRun}
              className="flex-1 h-12 rounded-2xl bg-zinc-200 dark:bg-zinc-800 text-zinc-500 font-black uppercase text-[10px] tracking-widest hover:bg-zinc-300 transition-all active:scale-95"
            >
              {isJourney ? "End Node" : "Let Fall"}
            </Button>
            <Button
              onClick={onRevive}
              className="flex-[2] h-12 rounded-2xl bg-amber-500 text-white font-black uppercase text-[11px] tracking-widest shadow-lg shadow-amber-500/40 hover:bg-amber-600 hover:scale-[1.02] transition-all relative overflow-hidden group"
            >
              {/* PRESSURE GAUGE: Visual air refill effect */}
              <div
                className="absolute bottom-0 left-0 h-1.5 bg-white/40 transition-all duration-1000 ease-linear"
                style={{ width: `${(countdown / 6) * 100}%` }}
              />

              <div className="flex items-center justify-center gap-2 relative z-10">
                <Wind size={14} className="animate-pulse" />
                <span>{isJourney ? `Revive Node (${reviveCost})` : `Refill Air (${reviveCost})`}</span>
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
            {isJourney && isWon && nextNodeId && onContinueJourney && (
              <Button
                onClick={onContinueJourney}
                className="flex-1 h-12 rounded-2xl bg-[#75c32c] hover:bg-[#64a825] font-black uppercase text-[11px] tracking-widest transition-all active:scale-95 text-white"
              >
                Continue {nextNodeId}
                <RefreshCw size={14} className="ml-2" />
              </Button>
            )}
            {isJourney && isRunEnded && onBackToJourney && (
              <Button
                onClick={onBackToJourney}
                className="flex-1 h-12 rounded-2xl bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-black uppercase text-[10px] tracking-widest hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-all active:scale-95"
              >
                <Map size={13} className="mr-1.5" />
                Journey Map
              </Button>
            )}
            <Button
              onClick={onRestart}
              className={`flex-1 h-12 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all active:scale-95 text-white ${
                isWon
                  ? "bg-[#75c32c] hover:bg-[#64a825]"
                  : "bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90"
              }`}
            >
              {isJourney ? (isWon ? "Replay Node" : "Retry Node") : isEndless ? "New Flight" : isWon ? "Next Word" : "Try Again"}
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
