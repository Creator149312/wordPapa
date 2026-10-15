"use client";
import React from "react";
import { Snowflake, Shield, Shuffle, Sparkles, AlertCircle } from "lucide-react";

export default function ClashCombatFeedback({
  isFrozen = false,
  freezeSeconds = 0,
  hasShield = false,
  isScrambled = false,
  scrambleSeconds = 0,
  combatAlert = null, // { type: 'shield_block' | 'bounty' | 'freeze' | 'scramble' | 'insufficient', text: string }
}) {
  return (
    <div className="pointer-events-none relative w-full">
      {/* 1. Combat Banner Notification (Pops up at top of combat) */}
      {combatAlert && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full shadow-2xl border-2 text-xs font-black uppercase tracking-wider ${
              combatAlert.type === "shield_block"
                ? "bg-amber-500 text-white border-amber-300 shadow-amber-500/50"
                : combatAlert.type === "bounty"
                ? "bg-emerald-600 text-white border-emerald-300 shadow-emerald-500/50 animate-pulse"
                : combatAlert.type === "freeze"
                ? "bg-sky-500 text-white border-sky-300 shadow-sky-500/50"
                : combatAlert.type === "scramble"
                ? "bg-purple-600 text-white border-purple-300 shadow-purple-500/50"
                : "bg-red-600 text-white border-red-400 shadow-red-500/50"
            }`}
          >
            {combatAlert.type === "shield_block" && <Shield size={14} className="fill-white" />}
            {combatAlert.type === "bounty" && <Sparkles size={14} className="fill-white" />}
            {combatAlert.type === "freeze" && <Snowflake size={14} className="animate-spin" />}
            {combatAlert.type === "scramble" && <Shuffle size={14} />}
            {combatAlert.type === "insufficient" && <AlertCircle size={14} />}
            <span>{combatAlert.text}</span>
          </div>
        </div>
      )}

      {/* 2. Frozen Ice Overlay (Rendered when player is frozen) */}
      {isFrozen && (
        <div className="absolute inset-0 -m-2 z-40 rounded-3xl bg-sky-500/20 backdrop-blur-[2px] border-4 border-sky-400/80 flex flex-col items-center justify-center animate-in fade-in duration-150 shadow-[0_0_30px_rgba(56,189,248,0.4)]">
          <div className="p-4 rounded-2xl bg-zinc-950/85 border-2 border-sky-400 flex flex-col items-center gap-2 shadow-2xl">
            <Snowflake size={32} className="text-sky-400 animate-spin" />
            <div className="text-center">
              <p className="text-xs font-black uppercase tracking-widest text-sky-300">
                FROZEN BY OPPONENT!
              </p>
              <p className="text-2xl font-black text-white tabular-nums">
                {freezeSeconds.toFixed(1)}s
              </p>
            </div>
            <span className="text-[9px] font-bold text-sky-200/80 uppercase tracking-tight">
              Inputs locked until thawed
            </span>
          </div>
        </div>
      )}

      {/* 3. Inked / Scramble Fog Effect */}
      {isScrambled && (
        <div className="absolute inset-0 -m-2 z-30 rounded-3xl bg-purple-950/40 backdrop-blur-[4px] border-2 border-purple-500/50 flex flex-col items-center justify-center animate-pulse pointer-events-none">
          <div className="px-4 py-2 rounded-xl bg-black/80 border border-purple-400 flex items-center gap-2 shadow-xl">
            <Shuffle size={16} className="text-purple-400 animate-spin" />
            <span className="text-xs font-black uppercase tracking-wider text-purple-200">
              Ink Splat Active! ({scrambleSeconds.toFixed(1)}s)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
