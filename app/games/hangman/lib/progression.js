export const RANKS = [
  { name: "Word Toddler", minXP: 0, color: "#94a3b8" },
  { name: "Word Scout", minXP: 100, color: "#60a5fa" },
  { name: "Word Knight", minXP: 320, color: "#a855f7" },
  { name: "Word Master", minXP: 360, color: "#f59e0b" },
  { name: "Word Papa", minXP: 3000, color: "#75c32c" },
];

export const calculateLevel = (xp) => {
  return RANKS.reduce((prev, curr) => (xp >= curr.minXP ? curr : prev));
};