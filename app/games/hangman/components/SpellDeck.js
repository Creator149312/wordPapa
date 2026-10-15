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

export default function SpellDeck({
  deck = ["freeze", "shield", "scramble", "reveal"],
  currentElixir = 0,
  onCastSpell,
  isFrozen = false,
  hasShield = false,
  cooldowns = {},
}) {
  return (
    <div className="w-full max-w-2xl mx-auto my-2 select-none">
      <div className="flex items-center justify-between mb-1.5 px-2">
        <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Tactical Deck (Deploy with Elixir)
        </span>
        {hasShield && (
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/50 flex items-center gap-1 animate-pulse">
            <Shield size={10} className="fill-amber-300" />
            Shield Active
          </span>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2 md:gap-3">
        {deck.map((spellKey) => {
          const spell = SPELLS_CONFIG[spellKey];
          if (!spell) return null;

          const Icon = SPELL_ICONS[spellKey] || Sparkles;
          const canAfford = currentElixir >= spell.cost;
          const isOnCooldown = (cooldowns[spell.id] || 0) > 0;
          const isDisabled = !canAfford || isFrozen || isOnCooldown;

          // If shield is already active, don't waste another shield
          const isRedundantShield = spell.id === "shield" && hasShield;

          return (
            <button
              key={spell.id}
              onClick={() => {
                if (!isDisabled && !isRedundantShield) {
                  onCastSpell(spell.id, spell.cost);
                }
              }}
              disabled={isDisabled || isRedundantShield}
              className={`
                group relative flex flex-col items-center justify-between p-2 md:p-2.5 rounded-2xl
                border-2 transition-all duration-150 text-left overflow-hidden
                ${
                  canAfford && !isFrozen && !isOnCooldown && !isRedundantShield
                    ? `bg-zinc-900 dark:bg-zinc-900 ${spell.border} shadow-md ${spell.glow} hover:-translate-y-1 active:scale-95 cursor-pointer ring-1 ring-white/10`
                    : "bg-zinc-950/60 border-zinc-800/60 opacity-50 cursor-not-allowed"
                }
              `}
            >
              {/* Cost Badge (Top Left Droplet) */}
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-fuchsia-950/90 border border-fuchsia-500/50 shadow-sm">
                  <Droplets size={10} className="text-fuchsia-300 fill-fuchsia-300" />
                  <span className="text-[11px] font-black text-fuchsia-200 tabular-nums">
                    {spell.cost}
                  </span>
                </div>
                <span className="text-[8px] font-black uppercase text-zinc-400 tracking-tighter hidden md:inline">
                  {spell.tag}
                </span>
              </div>

              {/* Spell Icon */}
              <div
                className={`my-1.5 p-2 rounded-xl bg-gradient-to-br ${spell.color} text-white shadow-sm transition-transform duration-200 ${
                  canAfford && !isDisabled ? "group-hover:scale-110" : ""
                }`}
              >
                <Icon size={18} />
              </div>

              {/* Spell Name & Description */}
              <div className="w-full text-center">
                <p className="text-[11px] font-black uppercase tracking-tight text-white truncate">
                  {spell.name}
                </p>
                <p className="text-[9px] font-bold text-zinc-400 leading-tight line-clamp-1 hidden sm:block">
                  {isRedundantShield ? "Active" : spell.desc}
                </p>
              </div>

              {/* Cooldown Overlay */}
              {isOnCooldown && (
                <div className="absolute inset-0 bg-black/75 flex items-center justify-center backdrop-blur-[1px]">
                  <span className="text-sm font-black text-white tabular-nums">
                    {cooldowns[spell.id]}s
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
