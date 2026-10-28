"use client";
import React from "react";
import { Snowflake, Shield, Shuffle, Sparkles, AlertCircle } from "lucide-react";

export default function ClashCombatFeedback({
  isFrozen = false,
  freezeSeconds = 0,
  hasShield = false,
  isScrambled = false,
  scrambleSeconds = 0,
  combatAlert = null,
}) {
  return (
    <div className="pointer-events-none relative w-full">
      {/* 1. Minimal Combat Banner Toast */}
      {combatAlert && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full shadow-lg border text-[11px] font-bold tracking-tight ${
              combatAlert.type === "shield_block"
                ? "bg-amber-600/95 text-white border-amber-400"
                : combatAlert.type === "bounty"
                ? "bg-emerald-600/95 text-white border-emerald-400"
                : combatAlert.type === "freeze"
                ? "bg-sky-600/95 text-white border-sky-400"
                : combatAlert.type === "scramble"
                ? "bg-purple-600/95 text-white border-purple-400"
                : "bg-rose-600/95 text-white border-rose-400"
            }`}
          >
            {combatAlert.type === "shield_block" && <Shield size={12} className="fill-white" />}
            {combatAlert.type === "bounty" && <Sparkles size={12} className="fill-white" />}
            {combatAlert.type === "freeze" && <Snowflake size={12} className="animate-spin" />}
            {combatAlert.type === "scramble" && <Shuffle size={12} />}
            {combatAlert.type === "insufficient" && <AlertCircle size={12} />}
            <span>{combatAlert.text}</span>
          </div>
        </div>
      )}

      {/* 2. Frozen Minimal Badge */}
      {isFrozen && (
        <div className="absolute -top-8 right-2 z-40 animate-in fade-in duration-150">
          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-950/90 border border-sky-400 text-sky-200 text-[10px] font-mono font-bold shadow-md">
            <Snowflake size={11} className="animate-spin text-sky-400" />
            <span>Frozen ({freezeSeconds.toFixed(1)}s)</span>
          </div>
        </div>
      )}

      {/* 3. Inked Minimal Badge */}
      {isScrambled && (
        <div className="absolute -top-8 left-2 z-40 animate-in fade-in duration-150">
          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-950/90 border border-purple-400 text-purple-200 text-[10px] font-mono font-bold shadow-md">
            <Shuffle size={11} className="animate-spin text-purple-400" />
            <span>Inked ({scrambleSeconds.toFixed(1)}s)</span>
          </div>
        </div>
      )}
    </div>
  );
}
