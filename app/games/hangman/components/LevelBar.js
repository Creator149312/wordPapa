"use client";
import { useMemo } from "react";
import {
  calculateLevel,
  getNextRank,
  calculateProgress,
} from "../lib/progression";
import { Shield, Zap } from "lucide-react";
import { useProfile } from "../../../ProfileContext";

export default function LevelBar() {
  const { profile } = useProfile();
  const { xp } = profile;

  const currentRank = useMemo(() => calculateLevel(xp), [xp]);
  const nextRank = useMemo(() => getNextRank(xp), [xp]);
  const progress = useMemo(() => calculateProgress(xp), [xp]);

  const isMaxLevel = !nextRank;
  const brandColor = currentRank.color || "#75c32c";

  return (
    <div className="w-full">
      <div className="relative bg-zinc-100 dark:bg-zinc-900/60 rounded-2xl overflow-hidden transition-colors">
        {/* Simple Progress Fill */}
        <div
          className="absolute bottom-0 left-0 h-1 transition-all duration-700 ease-in-out z-20"
          style={{
            width: `${isMaxLevel ? 100 : progress}%`,
            backgroundColor: brandColor,
          }}
        />

        <div className="flex items-center justify-between px-3 py-1.5 relative z-10">
          {/* LEFT: Level Shield Badge & Rank Info */}
          <div className="flex items-center gap-2.5 md:w-1/3">
            {/* The Level Shield */}
            <div className="relative flex items-center justify-center shrink-0">
              <Shield
                size={32}
                fill={brandColor}
                stroke={brandColor}
                className="opacity-20"
              />
              <Shield
                size={32}
                className="absolute text-zinc-900 dark:text-zinc-100"
                strokeWidth={2.5}
              />
              <span className="absolute text-[11px] font-black text-zinc-900 dark:text-zinc-100 mt-0.5">
                {currentRank.level || 1}
              </span>
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-100 truncate">
                {currentRank.name}
              </span>

              {!isMaxLevel && (
                <span className="md:hidden text-[9px] font-bold text-zinc-500 tabular-nums">
                  {xp.toLocaleString()} XP
                </span>
              )}
            </div>
          </div>

          {/* CENTER: XP Numbers (Desktop Only) */}
          <div className="hidden md:flex flex-col items-center w-1/3 text-center">
            <span className="text-[11px] font-black text-zinc-900 dark:text-zinc-100 tabular-nums tracking-tight">
              {xp.toLocaleString()}
              {!isMaxLevel && (
                <span className="text-zinc-500 ml-1 font-medium">
                  / {nextRank.minXP.toLocaleString()} XP
                </span>
              )}
            </span>
          </div>

          {/* RIGHT: Percentage */}
          <div className="flex items-center justify-end gap-2 w-1/3">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1">
                <Zap
                  size={10}
                  className="text-zinc-400 dark:text-zinc-500"
                  fill="currentColor"
                />
                <p className="text-xs font-black text-zinc-900 dark:text-zinc-100 leading-none">
                  {progress}%
                </p>
              </div>
              <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mt-1">
                {isMaxLevel ? "Max" : "Progress"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";
// import { useMemo } from "react";
// import {
//   calculateLevel,
//   getNextRank,
//   calculateProgress,
// } from "../lib/progression";
// import { Shield, Zap } from "lucide-react";
// import { useProfile } from "../../../ProfileContext";

// export default function LevelBar() {
//   const { profile } = useProfile();
//   const { xp } = profile;

//   const currentRank = useMemo(() => calculateLevel(xp), [xp]);
//   const nextRank = useMemo(() => getNextRank(xp), [xp]);
//   const progress = useMemo(() => calculateProgress(xp), [xp]);

//   const isMaxLevel = !nextRank;
//   const brandColor = currentRank.color || "#75c32c";

//   return (
//     <div className="w-full">
//       <div className="relative bg-zinc-100 dark:bg-zinc-900/60 rounded-2xl overflow-hidden transition-colors">
//         {/* Simple Progress Fill - The only significant area of color */}
//         <div
//           className="absolute bottom-0 left-0 h-1 transition-all duration-700 ease-in-out z-20"
//           style={{
//             width: `${isMaxLevel ? 100 : progress}%`,
//             backgroundColor: brandColor,
//           }}
//         />

//         <div className="flex items-center justify-between px-3 py-2 relative z-10">
//           {/* LEFT: Level Badge & Rank Info */}
//           <div className="flex items-center gap-3 md:w-1/3">
//             <div
//               className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 text-white"
//               style={{ backgroundColor: brandColor }}
//             >
//               {currentRank.level || 1}
//             </div>

//             <div className="flex flex-col min-w-0">
//               <div className="flex items-center gap-1">
//                 {/* Neutralized Icon */}
//                 <Shield
//                   size={12}
//                   className="text-zinc-400 dark:text-zinc-500"
//                   strokeWidth={3}
//                 />
//                 <span className="text-[11px] font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-100 truncate">
//                   {currentRank.name}
//                 </span>
//               </div>

//               {!isMaxLevel && (
//                 <span className="md:hidden text-[10px] font-bold text-zinc-500 dark:text-zinc-500 tabular-nums">
//                   {xp.toLocaleString()} / {nextRank.minXP.toLocaleString()} XP
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* CENTER: XP Numbers (Desktop Only) */}
//           <div className="hidden md:flex flex-col items-center w-1/3 text-center">
//             <span className="text-xs font-black text-zinc-900 dark:text-zinc-100 tabular-nums tracking-tight">
//               {xp.toLocaleString()}
//               {!isMaxLevel && (
//                 <span className="text-zinc-400 dark:text-zinc-500 ml-1 font-medium italic">
//                   / {nextRank.minXP.toLocaleString()} XP
//                 </span>
//               )}
//             </span>
//           </div>

//           {/* RIGHT: Percentage */}
//           <div className="flex items-center justify-end gap-2 w-1/3">
//             <div className="flex flex-col items-end">
//               <div className="flex items-center gap-1">
//                 {/* Neutralized Icon */}
//                 <Zap
//                   size={12}
//                   className="text-zinc-400 dark:text-zinc-500"
//                   fill="currentColor"
//                 />
//                 <p className="text-sm font-black text-zinc-900 dark:text-zinc-100 leading-none">
//                   {progress}%
//                 </p>
//               </div>
//               <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mt-1">
//                 {isMaxLevel ? "Max" : "Progress"}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
