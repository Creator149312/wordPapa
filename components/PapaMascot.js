"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getMascotSkin } from "./mascot/skins";

/* ─── Rank accessory layers (pure SVG, drawn on the 100×100 viewBox) ─── */

// Headwear renders BEFORE the body so the body edge tucks it in naturally.
function renderHeadwear(type) {
  switch (type) {
    case "sprout":
      return (
        <g transform="translate(50, 26)">
          <path d="M 0 0 L 0 -8" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 0 -7 Q -9 -9 -11 -17 Q -2 -15 0 -7 Z" fill="#4ade80" />
          <path d="M 0 -7 Q 9 -9 11 -17 Q 2 -15 0 -7 Z" fill="#22c55e" />
        </g>
      );
    case "cap": // Student — baseball cap
      return (
        <g transform="translate(50, 28)">
          <path d="M -19 2 A 19 15 0 0 1 19 2 Z" fill="#0284c7" />
          <path d="M 19 2 L 31 7 L 17 7 Z" fill="#0369a1" />
          <circle cx="0" cy="-11" r="2.5" fill="#0369a1" />
        </g>
      );
    case "gradCap": // Scholar — graduation cap
      return (
        <g transform="translate(50, 28)">
          <path d="M -20 0 L 0 -12 L 20 0 L 16 4 L 0 -4 L -16 4 Z" fill="#1a1a1a" />
          <rect x="-14" y="0" width="28" height="6" fill="#1a1a1a" />
          <rect x="-2" y="-12" width="4" height="10" fill="#f59e0b" />
        </g>
      );
    case "lotus": // Yogi — lotus bloom
      return (
        <g transform="translate(50, 24)">
          <path d="M 0 -2 C -4 -10 -2 -15 0 -17 C 2 -15 4 -10 0 -2 Z" fill="#c084fc" />
          <path d="M -2 -1 C -10 -7 -13 -4 -15 0 C -10 3 -4 2 -2 -1 Z" fill="#a855f7" />
          <path d="M 2 -1 C 10 -7 13 -4 15 0 C 10 3 4 2 2 -1 Z" fill="#a855f7" />
        </g>
      );
    case "gemBand": // Master — headband with gem
      return (
        <g transform="translate(50, 30)">
          <path d="M -24 -2 Q 0 -14 24 -2" stroke="#1e293b" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 0 -15 L 5 -9 L 0 -3 L -5 -9 Z" fill="#38bdf8" stroke="#0ea5e9" strokeWidth="0.75" />
        </g>
      );
    case "flameCrown": // Legend — flame crest
      return (
        <g transform="translate(50, 22)">
          <path d="M 0 4 C -8 -2 -6 -8 -2 -12 C -3 -6 0 -6 0 -12 C 1 -16 3 -18 4 -21 C 6 -14 10 -10 8 -2 C 7 2 3 5 0 4 Z" fill="#f97316" />
          <path d="M 1 3 C -2 0 -1 -4 2 -9 C 4 -4 5 0 1 3 Z" fill="#fbbf24" />
        </g>
      );
    case "crown": // Word Papa — golden crown
      return (
        <g transform="translate(50, 20)">
          <path d="M -14 7 L -14 -4 L -7 1 L 0 -9 L 7 1 L 14 -4 L 14 7 Z" fill="#fbbf24" stroke="#b45309" strokeWidth="1" />
          <circle cx="0" cy="-3" r="1.8" fill="#dc2626" />
        </g>
      );
    default:
      return null;
  }
}

// Overlays render AFTER the face so they sit on top of body/eyes.
function renderOverlay(type) {
  switch (type) {
    case "bow": // Toddler — playful bow at the side of the head
      return (
        <g transform="translate(64, 28) rotate(15)">
          <path d="M 0 0 L -8 -5 L -8 5 Z" fill="#f472b6" />
          <path d="M 0 0 L 8 -5 L 8 5 Z" fill="#f472b6" />
          <circle r="2.5" fill="#db2777" />
        </g>
      );
    case "glasses": // Sage — round spectacles
      return (
        <g transform="translate(50, 48)" stroke="#1a1a1a" strokeWidth="2" fill="none">
          <circle cx="-14" cy="0" r="11.5" />
          <circle cx="14" cy="0" r="11.5" />
          <path d="M -2.5 0 L 2.5 0" />
          <path d="M -25.5 -2 L -30 -5" />
          <path d="M 25.5 -2 L 30 -5" />
        </g>
      );
    case "beard": // Guru — wise white beard
      return (
        <path
          d="M 34 60 Q 50 66 66 60 Q 66 82 50 86 Q 34 82 34 60 Z"
          fill="#f8fafc"
          stroke="#cbd5e1"
          strokeWidth="1"
          opacity="0.95"
        />
      );
    default:
      return null;
  }
}

// Prestige twinkles for Legend / Word Papa.
function renderSparkles() {
  const points = [
    { x: 13, y: 30, d: 0 },
    { x: 87, y: 26, d: 0.4 },
    { x: 88, y: 70, d: 0.8 },
    { x: 12, y: 74, d: 1.2 },
  ];
  return (
    <g>
      {points.map((p) => (
        <motion.path
          key={`${p.x}-${p.y}`}
          d="M 0 -4 L 1.2 -1.2 L 4 0 L 1.2 1.2 L 0 4 L -1.2 1.2 L -4 0 L -1.2 -1.2 Z"
          fill="#fbbf24"
          transform={`translate(${p.x}, ${p.y})`}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1.1, 0.7] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: p.d }}
        />
      ))}
    </g>
  );
}

/**
 * PapaMascot — Minimalist vector mascot for WordPapa
 * A friendly, round scholar bird that reacts to user state.
 *
 * Props:
 *   mood: "happy" | "worried" | "idle" | "celebrating" | "sleeping"
 *   isWaving: boolean — triggers wave animation
 *   accentColor: string — hex color override for body (defaults to rank color)
 *   size: number — width/height in px (default: 44)
 *   rankLevel: number 1-10 — drives color + accessory evolution (auto-upgrade)
 */
export default function PapaMascot({
  mood = "idle",
  isWaving = false,
  accentColor,
  size = 44,
  rankLevel,
}) {
  const [blink, setBlink] = useState(false);

  // Random blink every 3-6 seconds
  useEffect(() => {
    const blinkLoop = () => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    };
    const interval = setInterval(blinkLoop, 3000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  // Mood-based visual parameters
  const getMoodConfig = () => {
    switch (mood) {
      case "happy":
        return {
          eyeCurve: 2,        // U-shaped happy eyes
          eyeOpen: 1,         // Fully open
          blush: true,        // Show blush marks
          browAngle: 0,       // Neutral brows
          bounce: true,       // Gentle bounce
        };
      case "worried":
        return {
          eyeCurve: -1,       // Slight frown
          eyeOpen: 0.9,       // Slightly narrowed
          blush: false,
          browAngle: -15,     // Worried brows
          bounce: false,
        };
      case "celebrating":
        return {
          eyeCurve: 3,        // Big happy curve
          eyeOpen: 1,
          blush: true,
          browAngle: 10,      // Raised brows
          bounce: true,
          spin: true,         // Celebration spin
        };
      case "sleeping":
        return {
          eyeCurve: 0,
          eyeOpen: 0.1,       // Nearly closed
          blush: false,
          browAngle: 0,
          bounce: false,
          zzz: true,          // Show Zzz
        };
      default: // idle
        return {
          eyeCurve: 0,
          eyeOpen: 1,
          blush: false,
          browAngle: 0,
          bounce: false,
        };
    }
  };

  const config = getMoodConfig();
  const scale = size / 100; // Base viewBox is 100x100

  // Rank-driven skin: body color + accessory evolve automatically with rank
  const skin = rankLevel ? getMascotSkin(rankLevel) : null;
  const bodyColor = accentColor || skin?.color || "#75c32c";
  // Backwards compatible: without rankLevel the scholar cap stays (original look)
  const accessory = skin ? skin.accessory : "gradCap";

  return (
    <motion.div
      animate={
        isWaving
          ? { y: [0, -8, 0, -6, 0], rotate: [0, -5, 5, -3, 0] }
          : config.spin
            ? { rotate: [0, 360], scale: [1, 1.1, 1] }
            : config.bounce
              ? { y: [0, -3, 0] }
              : {}
      }
      transition={
        isWaving
          ? { duration: 0.8 }
          : config.spin
            ? { duration: 0.6, repeat: 2 }
            : config.bounce
              ? { duration: 1.5, repeat: Infinity }
              : {}
      }
      className="select-none"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="drop-shadow-lg"
      >
        {/* ─── Rank Aura (Sage and above) ─── */}
        {skin?.aura && (
          <motion.ellipse
            cx="50"
            cy="58"
            rx="42"
            ry="44"
            fill={bodyColor}
            animate={{ opacity: [0.12, 0.22, 0.12] }}
            transition={{ duration: 2.4, repeat: Infinity }}
          />
        )}

        {/* ─── Headwear (rank-driven; defaults to scholar cap) ─── */}
        {renderHeadwear(accessory)}

        {/* ─── Body — rounded-square "Papa" card (original brand silhouette) ─── */}
        <motion.rect
          x="22"
          y="24"
          width="56"
          height="60"
          rx="16"
          fill="#1a1a1a"
          animate={config.bounce ? { height: [60, 57, 60], y: [24, 27, 24] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        />

        {/* ─── Top bar — rank color (the identity stripe) ─── */}
        <path
          d="M 22 40 L 22 40 A 16 16 0 0 1 38 24 L 62 24 A 16 16 0 0 1 78 40 Z"
          fill={bodyColor}
        />

        {/* ─── Left arm (static) ─── */}
        <path
          d="M 24 56 Q 15 58 16 66"
          stroke="#1a1a1a"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {/* ─── Eyes — white, expressive ─── */}
        <g transform={`translate(50, 52)`}>
          {/* Left eye */}
          <g transform="translate(-13, 0)">
            <ellipse
              rx="7.5"
              ry={blink ? 0.8 : 7.5 * config.eyeOpen}
              fill="white"
            />
            {!blink && (
              <motion.circle
                r="3"
                fill="#1a1a1a"
                animate={{ cy: config.eyeCurve }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            )}
          </g>

          {/* Right eye */}
          <g transform="translate(13, 0)">
            <ellipse
              rx="7.5"
              ry={blink ? 0.8 : 7.5 * config.eyeOpen}
              fill="white"
            />
            {!blink && (
              <motion.circle
                r="3"
                fill="#1a1a1a"
                animate={{ cy: config.eyeCurve }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            )}
          </g>
        </g>

        {/* ─── Blush Marks ─── */}
        <AnimatePresence>
          {config.blush && (
            <>
              <motion.ellipse
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.6, scale: 1 }}
                exit={{ opacity: 0 }}
                cx="32"
                cy="56"
                rx="4"
                ry="2.5"
                fill="#f472b6"
              />
              <motion.ellipse
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.6, scale: 1 }}
                exit={{ opacity: 0 }}
                cx="68"
                cy="56"
                rx="4"
                ry="2.5"
                fill="#f472b6"
              />
            </>
          )}
        </AnimatePresence>

        {/* ─── Mouth (mood-aware, white on dark body) ─── */}
        {mood === "sleeping" ? (
          <ellipse cx="50" cy="68" rx="3.5" ry="3" fill="#ffffff" opacity="0.7" />
        ) : mood === "worried" ? (
          <path
            d="M 44 70 Q 50 66 56 70"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          <path
            d={config.eyeCurve >= 3 ? "M 42 66 Q 50 76 58 66 Q 50 70 42 66 Z" : "M 43 66 Q 50 73 57 66"}
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill={config.eyeCurve >= 3 ? "#ffffff" : "none"}
          />
        )}

        {/* ─── Worried Brows ─── */}
        {config.browAngle !== 0 && (
          <g transform="translate(50, 40)">
            <motion.path
              d="M -18 -5 L -8 0"
              stroke="#1a1a1a"
              strokeWidth="2"
              strokeLinecap="round"
              animate={{ rotate: config.browAngle }}
              style={{ originX: "-18px", originY: "-5px" }}
            />
            <motion.path
              d="M 18 -5 L 8 0"
              stroke="#1a1a1a"
              strokeWidth="2"
              strokeLinecap="round"
              animate={{ rotate: -config.browAngle }}
              style={{ originX: "18px", originY: "-5px" }}
            />
          </g>
        )}

        {/* ─── Rank overlays (bow / glasses / beard) ─── */}
        {renderOverlay(accessory)}

        {/* ─── Prestige sparkles (Legend / Word Papa) ─── */}
        {skin?.sparkles && renderSparkles()}

        {/* ─── Zzz (Sleeping) ─── */}
        <AnimatePresence>
          {config.zzz && (
            <motion.g
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -15 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <text x="70" y="30" fontSize="12" fill="#9ca3af" fontWeight="bold">Z</text>
              <text x="76" y="24" fontSize="10" fill="#9ca3af" fontWeight="bold">z</text>
              <text x="82" y="18" fontSize="8" fill="#9ca3af" fontWeight="bold">z</text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* ─── Right arm (wave) ─── */}
        <motion.path
          d="M 76 56 Q 85 58 84 66"
          stroke="#1a1a1a"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          animate={isWaving ? { rotate: [0, -22, 10, -16, 0] } : {}}
          transition={{ duration: 0.6 }}
          style={{ originX: "76px", originY: "56px" }}
        />
      </svg>
    </motion.div>
  );
}
