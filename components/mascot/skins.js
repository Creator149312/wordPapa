import { RANKS } from "@app/games/hangman/constants";

/**
 * Rank-driven visual layers for PapaMascot.
 *
 * Single source of truth: colors always come from the canonical RANKS
 * config in the Hangman game — never duplicate the palette here.
 *
 * Progression philosophy:
 *   - Body color evolves automatically with rank (skill signal)
 *   - Accessories get richer as rank climbs (sprout → cap → crown)
 *   - Aura appears from Sage (5) upward
 *   - Sparkles are reserved for Legend (9) and Word Papa (10)
 */
const SKIN_LAYERS = {
  1: { accessory: "sprout", aura: false, sparkles: false },
  2: { accessory: "bow", aura: false, sparkles: false },
  3: { accessory: "cap", aura: false, sparkles: false },
  4: { accessory: "gradCap", aura: false, sparkles: false },
  5: { accessory: "glasses", aura: true, sparkles: false },
  6: { accessory: "lotus", aura: true, sparkles: false },
  7: { accessory: "beard", aura: true, sparkles: false },
  8: { accessory: "gemBand", aura: true, sparkles: false },
  9: { accessory: "flameCrown", aura: true, sparkles: true },
  10: { accessory: "crown", aura: true, sparkles: true },
};

/**
 * Resolve the full visual skin for a rank level.
 * @param {number} rankLevel — 1..10 (values outside are clamped)
 * @returns {{ level: number, name: string, color: string, accessory: string, aura: boolean, sparkles: boolean }}
 */
export function getMascotSkin(rankLevel) {
  const level = Math.min(10, Math.max(1, Number(rankLevel) || 1));
  const rank = RANKS.find((r) => r.level === level) || RANKS[0];
  const layers = SKIN_LAYERS[level] || SKIN_LAYERS[1];
  return { level, name: rank.name, color: rank.color, ...layers };
}
