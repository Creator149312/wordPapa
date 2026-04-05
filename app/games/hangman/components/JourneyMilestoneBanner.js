"use client";

import { PartyPopper, ShieldCheck, Sparkles, Trophy } from "lucide-react";

export default function JourneyMilestoneBanner({
  type = "node",
  title,
  subtitle,
  accent = "#75c32c",
}) {
  const isArenaClear = type === "arena";
  const Icon = isArenaClear ? Trophy : PartyPopper;
  const SecondaryIcon = isArenaClear ? ShieldCheck : Sparkles;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center pointer-events-none px-5">
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-[2rem] border-[4px] border-zinc-900 bg-white p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:bg-zinc-950"
        style={{ boxShadow: `12px 12px 0 0 ${accent}` }}
      >
        <div
          className="absolute inset-x-0 top-0 h-2"
          style={{ backgroundColor: accent }}
        />

        <Icon
          className="absolute -right-3 -top-3 h-14 w-14 rotate-12 text-white"
          style={{ color: accent }}
        />
        <SecondaryIcon
          className="absolute -left-3 -bottom-3 h-12 w-12 -rotate-12 text-zinc-900 dark:text-white"
          style={{ color: accent }}
        />

        <div className="relative z-10 text-center space-y-3 animate-banner-pop">
          <p className="text-[11px] font-black uppercase tracking-[0.26em] text-zinc-400 dark:text-zinc-500">
            {isArenaClear ? "Arena Cleared" : "Node Cleared"}
          </p>
          <h2 className="text-3xl font-black tracking-[-0.06em] text-zinc-950 dark:text-white">
            {title}
          </h2>
          <p className="text-sm font-bold leading-6 text-zinc-600 dark:text-zinc-300">
            {subtitle}
          </p>
        </div>

        <style jsx>{`
          @keyframes banner-pop {
            0% {
              transform: scale(0.9) translateY(24px);
              opacity: 0;
            }
            14% {
              transform: scale(1.04) translateY(0);
              opacity: 1;
            }
            82% {
              transform: scale(1) translateY(0);
              opacity: 1;
            }
            100% {
              transform: scale(1.02) translateY(-14px);
              opacity: 0;
            }
          }
          .animate-banner-pop {
            animation: banner-pop 3.6s forwards ease-out;
          }
        `}</style>
      </div>
    </div>
  );
}
