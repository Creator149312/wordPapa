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
              relative flex flex-col items-center justify-between p-2 rounded-2xl
              border-2 transition-all duration-150 overflow-hidden aspect-[4/5]
              ${
                !isDisabled
                  ? `bg-zinc-900 ${spell.border} shadow-lg ${spell.glow} hover:-translate-y-1 active:scale-95 cursor-pointer ring-1 ring-white/10`
                  : "bg-zinc-950/80 border-zinc-800/80 opacity-40 cursor-not-allowed"
              }
            `}
          >
            {/* Top Cost Droplet & Overtime 2X Badge */}
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-fuchsia-950/90 border border-fuchsia-400/60 shadow-sm">
                <Droplets size={9} className="text-fuchsia-300 fill-fuchsia-300" />
                <span className="text-[10px] font-black text-fuchsia-100 tabular-nums">
                  {spell.cost}
                </span>
              </div>
              <span className="text-[8px] font-mono font-black text-zinc-500 hidden sm:inline">
                [{deck.indexOf(spellKey) + 1}]
              </span>
              {isOvertime && (
                <span className="text-[7px] font-black uppercase text-amber-300 tracking-tighter">
                  2X SPD
                </span>
              )}
            </div>

            {/* Spell Art Icon */}
            <div
              className={`p-2 rounded-xl bg-gradient-to-br ${spell.color} text-white shadow-sm transition-transform ${
                !isDisabled ? "hover:scale-110" : ""
              }`}
            >
              <Icon size={18} />
            </div>

            {/* Spell Name */}
            <span className="text-[10px] font-black uppercase tracking-tight text-white truncate max-w-full">
              {spell.name}
            </span>

            {/* Active Shield Label */}
            {isRedundantShield && (
              <div className="absolute inset-0 bg-amber-950/90 border border-amber-400 flex items-center justify-center">
                <span className="text-[9px] font-black uppercase text-amber-200 tracking-wider">
                  Active
                </span>
              </div>
            )}

            {/* Cooldown Timer */}
            {isOnCooldown && !isRedundantShield && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-[1px]">
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
