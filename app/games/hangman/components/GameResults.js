"use client";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  Trophy,
  XCircle,
  Coins,
  Flame,
  Star,
  TrendingUp,
  TrendingDown,
  PartyPopper,
} from "lucide-react";
import ShareResult from "./ShareResult";
import { useProfile } from "./../../../ProfileContext";

export default function GameResults({
  isWon,
  word,
  streak,
  xpEarned,
  coinsEarned,
  mode,
  onRestart,
}) {
  const { profile } = useProfile();
  const isOnline = mode === "online";

  const isRunEnded = !isWon && streak > 0;
  const isPureLoss = !isWon && streak === 0;
  const isNewRecord = !isWon && streak > (profile?.highestStreak || 0);

  return (
    <div className="w-full pt-1 text-center space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* 1. MINIMALIST EARNINGS HEADER */}
      <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-zinc-100 dark:bg-zinc-900/50 transition-colors">
        <div className="flex items-center gap-3">
          {/* Only the icon container holds the status color */}
          <div
            className={`p-2 rounded-xl ${
              isWon
                ? "bg-[#75c32c]/10 text-[#75c32c]"
                : isRunEnded
                  ? "bg-amber-500/10 text-amber-600"
                  : "bg-rose-500/10 text-rose-600"
            }`}
          >
            {isWon ? (
              <Trophy size={20} />
            ) : isRunEnded ? (
              <PartyPopper size={20} />
            ) : (
              <XCircle size={20} />
            )}
          </div>
          <div className="text-left">
            <h2
              className={`text-sm font-black uppercase tracking-tight leading-none ${
                isWon
                  ? "text-[#75c32c]"
                  : isRunEnded
                    ? "text-amber-600"
                    : "text-rose-600"
              }`}
            >
              {isWon ? "Success!" : isRunEnded ? "Great Run!" : "Failed"}
            </h2>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter mt-1">
              Word:{" "}
              <span className="text-zinc-900 dark:text-zinc-100 font-mono">
                {word}
              </span>
            </p>
          </div>
        </div>

        {/* Earning Badges - Simplified */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-black text-[10px]">
            <TrendingUp
              size={10}
              className={xpEarned > 0 ? "text-[#75c32c]" : "text-zinc-400"}
            />
            {xpEarned > 0 ? `+${xpEarned}` : xpEarned} XP
          </div>

          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 font-black text-[10px]">
            <Coins size={10} fill="currentColor" />+{coinsEarned || 0}
          </div>
        </div>
      </div>

      {/* 2. STREAMLINED STREAK DISPLAY */}
      {mode !== "online" && (
        <div className="rounded-2xl px-4 py-3 bg-zinc-100 dark:bg-zinc-900/50 flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10">
            <div className="relative">
              <h3
                className={`text-4xl font-black tracking-tighter ${
                  isWon || isRunEnded ? "text-orange-500" : "text-zinc-400"
                }`}
              >
                {streak}
              </h3>
              {(isWon || isRunEnded) && (
                <Flame
                  className="absolute -top-1 -right-4 text-orange-500 animate-pulse"
                  size={14}
                  fill="currentColor"
                />
              )}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-zinc-500">
                  {isWon
                    ? "Current Streak"
                    : isRunEnded
                      ? "Final Streak"
                      : "Streak Reset"}
                </p>
                {isNewRecord && (
                  <span className="px-1.5 py-0.5 bg-indigo-500 text-white text-[8px] font-black uppercase rounded-full">
                    New Best
                  </span>
                )}
              </div>
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight mt-0.5">
                {isWon ? "Keep it burning!" : "Ready for the next run?"}
              </p>
            </div>
          </div>

          <div className="flex gap-1">
            {[1, 5, 10, 15, 21].map((m) => (
              <Star
                key={m}
                size={12}
                className={
                  streak >= m
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-zinc-300 dark:text-zinc-700"
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* 3. SUBTLE FOOTER */}
      {isPureLoss && !isOnline && (
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 py-1">
          Mistakes are proof you are trying
        </p>
      )}

      {/* 4. ACTIONS - Clean & Bold */}
      <div className="flex items-center gap-2 pt-1">
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
              ? "bg-[#75c32c]"
              : "bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900"
          }`}
        >
          {isWon ? "Next Word" : "Try Again"}
          <RefreshCw size={14} className="ml-2" />
        </Button>
      </div>
    </div>
  );
}

// "use client";
// import { Button } from "@/components/ui/button";
// import {
//   RefreshCw,
//   Trophy,
//   XCircle,
//   Coins,
//   Flame,
//   Star,
//   TrendingUp,
//   TrendingDown,
//   PartyPopper,
// } from "lucide-react";
// import ShareResult from "./ShareResult";
// import { useProfile } from "./../../../ProfileContext";

// export default function GameResults({
//   isWon,
//   word,
//   streak,
//   xpEarned,
//   coinsEarned,
//   mode,
//   onRestart,
// }) {
//   const { profile } = useProfile();
//   const isOnline = mode === "online";

//   const isRunEnded = !isWon && streak > 0;
//   const isPureLoss = !isWon && streak === 0;
//   const isNewRecord = !isWon && streak > (profile?.highestStreak || 0);

//   return (
//     <div className="w-full pt-1 text-center space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-500">
//       {/* 1. COMPACT EARNINGS HEADER */}
//       <div
//         className={`flex items-center justify-between px-3 py-2 rounded-xl border shadow-sm transition-colors ${
//           isWon
//             ? "bg-[#75c32c]/10 border-[#75c32c]/20"
//             : isRunEnded
//               ? "bg-amber-500/10 border-amber-500/20"
//               : "bg-rose-500/10 border-rose-500/20"
//         }`}
//       >
//         <div className="flex items-center gap-2.5">
//           <div
//             className={`p-1.5 rounded-lg ${
//               isWon
//                 ? "bg-[#75c32c]/20 text-[#75c32c]"
//                 : isRunEnded
//                   ? "bg-amber-500/20 text-amber-600"
//                   : "bg-rose-500/20 text-rose-600"
//             }`}
//           >
//             {isWon ? (
//               <Trophy size={18} />
//             ) : isRunEnded ? (
//               <PartyPopper size={18} />
//             ) : (
//               <XCircle size={18} />
//             )}
//           </div>
//           <div className="text-left">
//             <h2
//               className={`text-[13px] font-black uppercase tracking-tight leading-none ${
//                 isWon
//                   ? "text-[#75c32c]"
//                   : isRunEnded
//                     ? "text-amber-600 dark:text-amber-400"
//                     : "text-rose-600 dark:text-rose-400"
//               }`}
//             >
//               {isWon ? "Success!" : isRunEnded ? "Great Run!" : "Failed"}
//             </h2>
//             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
//               Word:{" "}
//               <span className="text-slate-900 dark:text-white font-mono">
//                 {word}
//               </span>
//             </p>
//           </div>
//         </div>

//         {/* Earning Badges */}
//         <div className="flex items-center gap-1.5">
//           <div
//             className={`min-w-[55px] flex items-center justify-center gap-1 px-2 py-1 rounded-md transition-all ${
//               xpEarned > 0
//                 ? "bg-slate-900 dark:bg-white"
//                 : "bg-slate-200 dark:bg-slate-800"
//             }`}
//           >
//             {xpEarned > 0 && (
//               <TrendingUp size={10} className="text-[#75c32c]" />
//             )}
//             <span
//               className={`font-black text-[10px] ${xpEarned > 0 ? "text-white dark:text-slate-900" : "text-slate-500"}`}
//             >
//               {xpEarned > 0 ? `+${xpEarned}` : xpEarned} XP
//             </span>
//           </div>

//           <div className="min-w-[55px] flex items-center justify-center gap-1 px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-900/40 border border-amber-500/20">
//             <Coins size={10} className="text-amber-600" fill="currentColor" />
//             <span className="text-amber-700 dark:text-amber-400 font-black text-[10px]">
//               +{coinsEarned || 0}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* 2. GLOWING STREAK DISPLAY */}
//       {mode !== "online" && (
//         <div
//           className={`rounded-xl px-4 py-2.5 border flex items-center justify-between transition-all overflow-hidden relative ${
//             isWon
//               ? "bg-orange-500/5 border-orange-500/20"
//               : isRunEnded
//                 ? "bg-amber-500/5 border-amber-500/20"
//                 : "bg-slate-500/5 border-slate-500/10"
//           }`}
//         >
//           <div className="flex items-center gap-3.5 relative z-10">
//             <div className="relative">
//               <h3
//                 className={`text-3xl font-black tracking-tighter transition-all ${
//                   isWon || isRunEnded
//                     ? "text-orange-600 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]"
//                     : "text-slate-400"
//                 }`}
//               >
//                 {streak}
//               </h3>
//               {(isWon || isRunEnded) && (
//                 <Flame
//                   className="absolute -top-1 -right-4 text-orange-500 animate-pulse drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]"
//                   size={14}
//                   fill="currentColor"
//                 />
//               )}
//             </div>
//             <div className="text-left">
//               <div className="flex items-center gap-1.5">
//                 <p
//                   className={`text-[9px] font-black uppercase tracking-wider ${
//                     isWon
//                       ? "text-orange-500"
//                       : isRunEnded
//                         ? "text-amber-600"
//                         : "text-slate-500"
//                   }`}
//                 >
//                   {isWon
//                     ? "Current Streak"
//                     : isRunEnded
//                       ? "Final Streak"
//                       : "Streak Reset"}
//                 </p>
//                 {isNewRecord && (
//                   <span className="px-1.5 py-0.5 bg-indigo-500 text-white text-[7px] font-black uppercase rounded-full animate-bounce">
//                     New Record
//                   </span>
//                 )}
//               </div>
//               <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">
//                 {isWon
//                   ? "Keep it burning!"
//                   : isRunEnded
//                     ? "What a performance!"
//                     : "Ready to reset?"}
//               </p>
//             </div>
//           </div>

//           <div className="flex gap-1">
//             {[1, 5, 10, 15, 21].map((milestone) => {
//               const active = streak >= milestone;
//               return (
//                 <Star
//                   key={milestone}
//                   size={12}
//                   className={`transition-all duration-500 ${
//                     active
//                       ? "text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] scale-110"
//                       : "text-slate-200 dark:text-slate-800 opacity-40"
//                   }`}
//                 />
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* 3. FOOTER */}
//       {isPureLoss && !isOnline && (
//         <div className="flex items-center justify-center gap-1.5 text-rose-500/80">
//           <TrendingDown size={12} />
//           <p className="text-[8px] font-black uppercase tracking-widest">
//             Mistakes are proof you are trying
//           </p>
//         </div>
//       )}

//       {/* 4. ACTIONS */}
//       <div className="flex items-center gap-2 pt-1">
//         <div className="flex-none">
//           <ShareResult
//             word={word}
//             isWon={isWon}
//             streak={streak}
//             mode={mode}
//             variant="icon"
//           />
//         </div>
//         <Button
//           onClick={onRestart}
//           className={`flex-1 flex items-center justify-center text-white font-black h-11 rounded-xl uppercase text-[10px] tracking-widest transition-all active:scale-95 ${
//             isWon
//               ? "bg-[#75c32c] shadow-[0_3px_0_#5a9a21]"
//               : isRunEnded
//                 ? "bg-amber-500 shadow-[0_3px_0_rgb(217,119,6)]"
//                 : "bg-slate-900 dark:bg-white dark:text-slate-900 shadow-[0_3px_0_rgba(0,0,0,0.3)]"
//           } active:shadow-none active:translate-y-[3px]`}
//         >
//           <span className="truncate">
//             {isWon ? "Next Word" : isRunEnded ? "New Run" : "Try Again"}
//           </span>
//           <RefreshCw size={14} className="ml-2 flex-shrink-0" />
//         </Button>
//       </div>
//     </div>
//   );
// }
