"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useProfile } from "@app/ProfileContext";
import { calculateLevel } from "@app/games/hangman/lib/progression";

// ─── Per-route message packs ───────────────────────────────────────────────
// Each entry is keyed by a pathname prefix.
// 'trigger' controls when the bubble fires:
//   "mount"   — immediately on page load
//   "scroll"  — after user scrolls 30% of the page
//   "idle"    — after 8 seconds of no interaction
const ROUTE_CONTEXTS = [
  {
    match: (p) => p.startsWith("/browse"),
    trigger: "scroll",
    messages: [
      "FIND A WORD YOU LIKE? HOVER IT AND SAVE IT TO YOUR LIST.",
      "WORDS YOU COLLECT TODAY BECOME YOUR ARSENAL TOMORROW.",
      "A SCHOLAR NEVER BROWSES WITHOUT BUILDING THEIR LIBRARY.",
    ],
  },
  {
    match: (p) => p.startsWith("/define") || p.startsWith("/thesaurus"),
    trigger: "mount",
    messages: [
      "REAL MASTERY COMES FROM THE ROOTS — CHECK THE ETYMOLOGY.",
      "IF YOU KNOW THIS WORD, HOW MANY SYNONYMS CAN YOU LIST?",
      "SAVE THIS WORD TO PRACTICE IT IN THE ARENA.",
    ],
  },
  {
    match: (p) => p.startsWith("/rhyming-words"),
    trigger: "idle",
    messages: [
      "RHYME IS RHYTHM. RHYTHM IS MEMORY.",
      "A POET KNOWS THE SOUND OF A WORD, NOT JUST THE MEANING.",
      "ADD THESE TO A LIST AND TURN THEM INTO FLASHCARDS.",
    ],
  },
  {
    match: (p) => p.startsWith("/syllables"),
    trigger: "idle",
    messages: [
      "COUNTING SYLLABLES TRAINS YOUR EAR FOR STRESS PATTERNS.",
      "SPEAKERS WHO COUNT SYLLABLES SOUND MORE NATURAL.",
    ],
  },
  {
    match: (p) => p.startsWith("/word-finder"),
    trigger: "idle",
    messages: [
      "LOOKING FOR GAME WORDS? THE ARENA WILL TEST THEM FOR REAL.",
      "FIND THE WORD. SAVE IT. OWN IT.",
    ],
  },
  {
    match: (p) => p.startsWith("/phrasal-verbs"),
    trigger: "mount",
    messages: [
      "PHRASAL VERBS ARE THE SECRET TO SOUNDING FLUENT — NOT JUST CORRECT.",
      "PICK THREE OF THESE. SAVE THEM. USE THEM IN A SENTENCE TODAY.",
    ],
  },
  {
    match: (p) => p.startsWith("/adjectives"),
    trigger: "scroll",
    messages: [
      "DESCRIBING PRECISELY IS THE MARK OF A SCHOLAR.",
      "THE RIGHT ADJECTIVE IS WORTH A THOUSAND GENERIC ONES.",
    ],
  },
  {
    match: (p) => p.startsWith("/lists"),
    trigger: "mount",
    messages: [
      "LISTS WITHOUT PRACTICE ARE JUST DECORATION. HEAD TO THE ARENA.",
      "EACH WORD IN THIS LIST IS A WEAPON WAITING TO BE SHARPENED.",
      "REVIEW YOUR LIST. THEN CHALLENGE YOURSELF IN ENDLESS RUN.",
    ],
  },
  {
    match: (p) => p.startsWith("/leaderboard"),
    trigger: "mount",
    messages: [
      "STUDY THE BOARD. YOUR NEXT TARGET IS RIGHT THERE.",
      "THE ARENA REWARDS CONSISTENCY. PLAY DAILY. CLIMB DAILY.",
      "EVERY NAME ABOVE YOURS IS A GOAL.",
    ],
  },
  {
    match: (p) => p.startsWith("/dashboard"),
    trigger: "mount",
    messages: [
      "PROGRESS THAT IS NOT MEASURED IS JUST HOPE. CHECK YOUR STATS.",
      "YOUR STREAK IS YOUR REPUTATION. DON'T BREAK IT.",
    ],
  },
  {
    match: (p) => p === "/" || p.startsWith("/register") || p.startsWith("/login"),
    trigger: "idle",
    messages: [
      "WELCOME. THE EASIEST WORD YOU WILL LEARN TODAY IS YOUR FIRST.",
      "ONE GAME. FIVE MINUTES. A VOCABULARY THAT GROWS EVERY DAY.",
    ],
  },
];

// ─── Rank-flavoured generic fallback messages ──────────────────────────────
const RANK_MESSAGES = {
  1:  ["HELLO! I AM PAPA. TAP ME WHENEVER YOU NEED A NUDGE.", "WE ARE JUST GETTING STARTED. KEEP EXPLORING."],
  2:  ["YOU ARE GROWING FAST. KEEP COLLECTING WORDS.", "EVERY WORD YOU SAVE IS A STEP FORWARD."],
  3:  ["A TRUE STUDENT NEVER STOPS ASKING WHAT DOES THIS MEAN.", "GOOD WORK. NOW GO DEEPER."],
  4:  ["SCHOLARS DO NOT JUST READ — THEY RETAIN.", "KNOWLEDGE THAT IS NOT PRACTISED FADES."],
  5:  ["WISDOM IS KNOWING WHICH WORDS TO USE, NOT JUST HOW MANY.", "FOCUS. THE RIGHT WORD IS ALREADY IN YOUR VOCABULARY."],
  6:  ["SILENCE BEFORE THE WORD. THAT IS THE YOGI'S WAY.", "BREATHE. RECALL. ANSWER."],
  7:  ["A GURU DOES NOT MEMORISE — THE GURU UNDERSTANDS.", "TEACH SOMEONE A WORD TODAY. THAT IS TRUE MASTERY."],
  8:  ["MASTERY LEAVES NO ROOM FOR HESITATION.", "YOUR PRECISION IS YOUR POWER."],
  9:  ["LEGENDS ARE MADE WORD BY WORD.", "THE ARENA RESPECTS ONLY ONE THING: CONSISTENCY."],
  10: ["YOU HAVE REACHED THE TOP. NOW HELP OTHERS CLIMB.", "WORD PAPA DOES NOT REST. THE LEXICON IS INFINITE."],
};

// Pages where the mascot should stay silent (game sessions, API routes)
const BLACKLIST = ["/games/hangman", "/admin", "/api", "/logout"];

function pickMessage(messages) {
  return messages[Math.floor(Math.random() * messages.length)];
}

export default function SiteMascot() {
  const pathname = usePathname();
  const { profile } = useProfile();

  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [message, setMessage] = useState("");
  const [isWaving, setIsWaving] = useState(false);

  const rank = useMemo(() => {
    const r = calculateLevel(profile?.xp || 0);
    return { level: r.level || 1, name: r.name || "Infant", color: r.color || "#75c32c" };
  }, [profile?.xp]);

  const accent = rank.color;

  // Resolve context for the current route
  const context = useMemo(() => {
    return ROUTE_CONTEXTS.find((c) => c.match(pathname)) || null;
  }, [pathname]);

  // Reset on every route change
  useEffect(() => {
    setVisible(false);
    setDismissed(false);
    setMessage("");
    setIsWaving(false);
  }, [pathname]);

  // Don't show on blacklisted paths
  const isBlacklisted = BLACKLIST.some((b) => pathname.startsWith(b));

  const fireMessage = useCallback(() => {
    if (dismissed || isBlacklisted) return;
    const msgs = context?.messages || RANK_MESSAGES[rank.level] || RANK_MESSAGES[1];
    setMessage(pickMessage(msgs));
    setVisible(true);
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 1200);
    // Auto-dismiss after 12s
    setTimeout(() => setVisible(false), 12000);
  }, [dismissed, isBlacklisted, context, rank.level]);

  // Trigger logic
  useEffect(() => {
    if (isBlacklisted || dismissed) return;
    const trigger = context?.trigger || "idle";

    if (trigger === "mount") {
      // Small delay so it doesn't pop instantly on navigation
      const t = setTimeout(fireMessage, 1800);
      return () => clearTimeout(t);
    }

    if (trigger === "scroll") {
      const onScroll = () => {
        const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        if (scrolled > 0.3) {
          window.removeEventListener("scroll", onScroll);
          fireMessage();
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    if (trigger === "idle") {
      let idleTimer;
      const reset = () => {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(fireMessage, 8000);
      };
      const events = ["mousemove", "keydown", "touchstart", "scroll"];
      events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
      reset(); // Start immediately
      return () => {
        clearTimeout(idleTimer);
        events.forEach((e) => window.removeEventListener(e, reset));
      };
    }
  }, [pathname, isBlacklisted, dismissed, context, fireMessage]);

  if (isBlacklisted) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-[150] flex flex-col items-end gap-2 select-none">
      {/* Speech bubble */}
      <AnimatePresence>
        {visible && message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            className="relative max-w-[220px] bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-100 rounded-2xl rounded-br-none px-4 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            {/* Close button */}
            <button
              onClick={() => { setVisible(false); setDismissed(true); }}
              className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              aria-label="Dismiss"
            >
              <X size={10} strokeWidth={3} />
            </button>

            <p className="text-[11px] font-black uppercase tracking-tight leading-snug text-zinc-800 dark:text-zinc-100">
              {message}
            </p>

            {/* Tail triangle pointing to avatar */}
            <div
              className="absolute -bottom-[9px] right-4 w-0 h-0"
              style={{
                borderLeft: "8px solid transparent",
                borderRight: "0px solid transparent",
                borderTop: "9px solid #18181b",
              }}
            />
            <div
              className="absolute -bottom-[7px] right-[17px] w-0 h-0"
              style={{
                borderLeft: "6px solid transparent",
                borderRight: "0px solid transparent",
                borderTop: "7px solid white",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Papa avatar button — matches DynamicPapa shape: balloons → strings → face box */}
      <motion.button
        onClick={() => {
          if (visible) {
            setVisible(false);
          } else {
            fireMessage();
          }
        }}
        animate={isWaving ? { y: [0, -6, 0, -4, 0] } : {}}
        transition={{ duration: 0.7 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        aria-label="Papa mascot"
        className="relative flex flex-col items-center"
      >
        {/* Face box */}
        <div
          className="relative flex items-center justify-center rounded-xl border-[2.5px] border-zinc-900 bg-white dark:bg-zinc-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          style={{ width: 44, height: 44 }}
        >
          {/* Accent top stripe */}
          <div
            className="absolute top-0 left-0 right-0 h-[9px] border-b-2 border-zinc-900 rounded-t-[0.6rem]"
            style={{ backgroundColor: accent }}
          />
          <span className="text-[11px] font-black text-zinc-900 dark:text-zinc-100 select-none">
            {"(•‿•)"}
          </span>
        </div>
      </motion.button>
    </div>
  );
}
