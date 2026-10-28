"use client";
import React from "react";
import { Snowflake, Shield, Shuffle, Sparkles, Droplets } from "lucide-react";
import { SPELLS_CONFIG } from "../constants/spells";

const SPELL_ICONS = {
  freeze: Snowflake,
  shield: Shield,
  scramble: Shuffle,
  reveal: Sparkles,
};

export default function ClashSpellCards({
  deck = ["freeze", "shield", "scramble", "reveal"],
  currentElixir = 0,
  onCastSpell,
  isFrozen = false,
  hasShield = false,
  cooldowns = {},
  isOvertime = false,
  isGameOver = false,
}) {
  return (
    <div className="w-full grid grid-cols-4 gap-2 select-none">
      {deck.map((spellKey) => {
        const spell = SPELLS_CONFIG[spellKey];
        if (!spell) return null;

        const Icon = SPELL_ICONS[spellKey] || Sparkles;
        const canAfford = currentElixir >= spell.cost;
        const isOnCooldown = (cooldowns[spell.id] || 0) > 0;
        const isRedundantShield = spell.id === "shield" && hasShield;
        const isDisabled = !canAfford || isFrozen || isOnCooldown || isRedundantShield || isGameOver;

        return (
          <button
            key={spell.id}
            onClick={() => {
              if (!isDisabled) onCastSpell(spell.id, spell.cost);
            }}
            disabled={isDisabled}
            className={`
              relative flex flex-col items-center justify-between p-1.5 rounded-xl
              border transition-all duration-150 overflow-hidden h-16
              ${
                !isDisabled
                  ? `bg-zinc-900/90 border-zinc-700/80 hover:border-zinc-500 hover:-translate-y-0.5 active:scale-95 cursor-pointer shadow-sm`
                  : "bg-zinc-950/60 border-zinc-800/60 opacity-35 cursor-not-allowed"
              }
            `}
          >
            {/* Top Cost Droplet & Hotkey Indicator */}
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-0.5 px-1 py-0.2 rounded bg-fuchsia-950/80 border border-fuchsia-500/40">
                <Droplets size={8} className="text-fuchsia-300 fill-fuchsia-300" />
                <span className="text-[9px] font-black text-fuchsia-100 tabular-nums">
                  {spell.cost}
                </span>
              </div>
              <span className="text-[8px] font-mono font-bold text-zinc-400 bg-zinc-800/80 px-1 rounded border border-zinc-700/50">
                {deck.indexOf(spellKey) + 1}
              </span>
            </div>

            {/* Spell Art Icon */}
            <div className={`p-1 rounded-lg bg-gradient-to-br ${spell.color} text-white shadow-xs`}>
              <Icon size={14} />
            </div>

            {/* Spell Name */}
            <span className="text-[8px] font-bold uppercase tracking-tight text-zinc-200 truncate max-w-full">
              {spell.name}
            </span>

            {/* Active Shield Label */}
            {isRedundantShield && (
              <div className="absolute inset-0 bg-amber-950/90 border border-amber-400/80 flex items-center justify-center">
                <span className="text-[8px] font-black uppercase text-amber-200 tracking-wider">
                  Active
                </span>
              </div>
            )}

            {/* Cooldown Timer */}
            {isOnCooldown && !isRedundantShield && (
              <div className="absolute inset-0 bg-black/85 flex items-center justify-center backdrop-blur-[1px]">
                <span className="text-xs font-black text-white tabular-nums">
                  {cooldowns[spell.id].toFixed(0)}s
                </span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
