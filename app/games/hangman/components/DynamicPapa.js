"use client";

import React, { useEffect, useMemo, useState } from "react";
import { getMentorMessage } from "../constants/mentorMessages";

const RANK_NAME_TO_LEVEL = {
  Infant: 1,
  Toddler: 2,
  Student: 3,
  Scholar: 4,
  Sage: 5,
  Yogi: 6,
  Guru: 7,
  Master: 8,
  Legend: 9,
  "Word Papa": 10,
};

const RANK_APPEARANCES = {
  1: {
    key: "infant",
    scale: 0.84,
    bubbleTone: "bg-lime-500",
    faceClass: "text-sm lg:text-lg",
    cardTone: "bg-lime-50",
    topIcon: "🌱",
    leftIcon: "🍼",
    rightIcon: "🐣",
    backPlateClass: "bg-lime-500",
    aura: false,
    clouds: true,
    birds: false,
    sparkles: false,
    cosmicStars: false,
    balloonMode: "solid",
    stringOpacity: 1,
    defaultFace: "(•‿•)",
    hurtFace: "(•﹏•)",
    focusFace: "(O.O)",
    winFace: "٩(^‿^)۶",
    masterWinFace: "٩(^‿^)۶",
    mentorMessages: [
      "YOU CAN DO IT! PAPA IS WITH YOU.",
      "EEP... KEEP OUR LITTLE FRIEND SAFE.",
      "TAP CAREFULLY. WE'LL LEARN THIS TOGETHER.",
    ],
  },
  2: {
    key: "toddler",
    scale: 0.92,
    bubbleTone: "bg-emerald-600",
    faceClass: "text-sm lg:text-[19px]",
    cardTone: "bg-emerald-50",
    topIcon: "🧸",
    leftIcon: "🍭",
    rightIcon: "🌼",
    backPlateClass: "bg-emerald-600",
    aura: false,
    clouds: true,
    birds: false,
    sparkles: false,
    cosmicStars: false,
    balloonMode: "solid",
    stringOpacity: 1,
    defaultFace: "(◕‿◕)",
    hurtFace: "(｡•́︿•̀｡)",
    focusFace: "(•o•)",
    winFace: "ヾ(＾-＾)ノ",
    masterWinFace: "ヾ(＾-＾)ノ",
    mentorMessages: [
      "LITTLE STEPS STILL COUNT.",
      "HOLD STEADY. WE'RE GROWING FAST NOW.",
      "SMALL PAPA. BIG HEART. KEEP GOING.",
    ],
  },
  3: {
    key: "student",
    scale: 1.02,
    bubbleTone: "bg-sky-600",
    faceClass: "text-sm lg:text-xl",
    cardTone: "bg-sky-50",
    topIcon: "🧢",
    leftIcon: "✏️",
    rightIcon: "📘",
    backPlateClass: "bg-sky-600",
    aura: false,
    clouds: true,
    birds: true,
    sparkles: false,
    cosmicStars: false,
    balloonMode: "solid",
    stringOpacity: 1,
    defaultFace: "(•̀ᴗ•́)",
    hurtFace: "(•_•)",
    focusFace: "(¬‿¬)",
    winFace: "ᕦ(ò_óˇ)ᕤ",
    masterWinFace: "ᕦ(ò_óˇ)ᕤ",
    mentorMessages: [
      "BACKPACK ON. BRAIN READY.",
      "WRITE THE RIGHT LETTER IN YOUR HEAD FIRST.",
      "GOOD. THINK LIKE A REAL WORD HUNTER.",
    ],
  },
  4: {
    key: "scholar",
    scale: 1.08,
    bubbleTone: "bg-blue-700",
    faceClass: "text-sm lg:text-[21px]",
    cardTone: "bg-blue-50",
    topIcon: "🎓",
    leftIcon: "📚",
    rightIcon: "🪶",
    backPlateClass: "bg-blue-700",
    aura: false,
    clouds: true,
    birds: true,
    sparkles: true,
    cosmicStars: false,
    balloonMode: "solid",
    stringOpacity: 0.95,
    defaultFace: "(•̀ᵕ•́)",
    hurtFace: "(•̀-•́)",
    focusFace: "(•⌐■_■)",
    winFace: "(ง'̀-'́)ง",
    masterWinFace: "(ง'̀-'́)ง",
    mentorMessages: [
      "KNOWLEDGE LOVES PATIENCE.",
      "LOOK FOR THE PATTERN BEFORE THE LETTER.",
      "A SCHOLAR MOVES WITH CALM PRECISION.",
    ],
  },
  5: {
    key: "sage",
    scale: 1.14,
    bubbleTone: "bg-indigo-600",
    faceClass: "text-sm lg:text-[22px]",
    cardTone: "bg-indigo-50",
    topIcon: "🪔",
    leftIcon: "📿",
    rightIcon: "✨",
    bottomIcon: "🧔",
    backPlateClass: "bg-indigo-700",
    aura: true,
    clouds: true,
    birds: false,
    sparkles: true,
    cosmicStars: false,
    balloonMode: "solid",
    stringOpacity: 0.82,
    defaultFace: "(•‿- )",
    hurtFace: "(•̀-•́)",
    focusFace: "(ಠಿ_ಠ)",
    winFace: "(•̀ᴗ•́)و",
    masterWinFace: "(•̀ᴗ•́)و",
    mentorMessages: [
      "BREATHE. OBSERVE. ANSWER WITH INTENT.",
      "THE WORD YIELDS TO PATIENT THINKING.",
      "WISDOM IS OFTEN JUST ONE QUIET LETTER AWAY.",
    ],
  },
  6: {
    key: "yogi",
    scale: 1.18,
    bubbleTone: "bg-violet-600",
    faceClass: "text-sm lg:text-[23px]",
    cardTone: "bg-violet-50",
    topIcon: "🪷",
    leftIcon: "☯️",
    rightIcon: "✨",
    bottomIcon: "🧘",
    backPlateClass: "bg-violet-700",
    aura: true,
    clouds: false,
    birds: false,
    sparkles: true,
    cosmicStars: false,
    balloonMode: "mist",
    stringOpacity: 0.55,
    defaultFace: "(˘‿˘)",
    hurtFace: "(—_—)",
    focusFace: "(ಠ_ಠ)",
    winFace: "ヽ(•‿•)ノ",
    masterWinFace: "ヽ(•‿•)ノ",
    mentorMessages: [
      "BALANCE FIRST. LETTERS SECOND.",
      "CENTER YOUR MIND. THE ANSWER FOLLOWS.",
      "EVEN HARD WORDS BREAK UNDER STILLNESS.",
    ],
  },
  7: {
    key: "guru",
    scale: 1.22,
    bubbleTone: "bg-fuchsia-600",
    faceClass: "text-sm lg:text-[24px]",
    cardTone: "bg-fuchsia-50",
    topIcon: "🕉️",
    leftIcon: "📜",
    rightIcon: "🔮",
    bottomIcon: "🧿",
    backPlateClass: "bg-fuchsia-700",
    aura: true,
    clouds: false,
    birds: false,
    sparkles: true,
    cosmicStars: false,
    balloonMode: "mist",
    stringOpacity: 0.45,
    defaultFace: "(◉‿◉)",
    hurtFace: "(•̀-•́)",
    focusFace: "(☉_☉)",
    winFace: "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧",
    masterWinFace: "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧",
    mentorMessages: [
      "DO NOT GUESS. RECOGNIZE.",
      "A GURU READS THE GAPS, NOT JUST THE LETTERS.",
      "LET INSIGHT STRIKE BEFORE THE KEYSTROKE.",
    ],
  },
  8: {
    key: "master",
    scale: 1.26,
    bubbleTone: "bg-pink-600",
    faceClass: "text-sm lg:text-[25px]",
    cardTone: "bg-pink-50",
    topIcon: "💠",
    leftIcon: "🌊",
    rightIcon: "⚜️",
    bottomIcon: "🛡️",
    backPlateClass: "bg-pink-700",
    aura: true,
    clouds: false,
    birds: false,
    sparkles: true,
    cosmicStars: false,
    balloonMode: "glow",
    stringOpacity: 0.28,
    defaultFace: "(★‿★)",
    hurtFace: "(•̀^•́)",
    focusFace: "(▰˘◡˘▰)",
    winFace: "★⌒ヽ(˘꒳˘ *)",
    masterWinFace: "★⌒ヽ(˘꒳˘ *)",
    mentorMessages: [
      "CONTROL THE PACE. CONTROL THE ROUND.",
      "A MASTER MAKES HARD WORDS LOOK INEVITABLE.",
      "STAY SHARP. THE MARGIN FOR ERROR IS SMALLER NOW.",
    ],
  },
  9: {
    key: "legend",
    scale: 1.3,
    bubbleTone: "bg-orange-600",
    faceClass: "text-sm lg:text-[26px]",
    cardTone: "bg-orange-50",
    topIcon: "🔥",
    leftIcon: "🏆",
    rightIcon: "✦",
    bottomIcon: "🦁",
    backPlateClass: "bg-orange-600",
    aura: true,
    clouds: false,
    birds: false,
    sparkles: true,
    cosmicStars: true,
    balloonMode: "glow",
    stringOpacity: 0.18,
    defaultFace: "(✦‿✦)",
    hurtFace: "(•̀⤙•́)",
    focusFace: "(ง •̀_•́)ง",
    winFace: "ᕙ(⇀‸↼‶)ᕗ",
    masterWinFace: "ᕙ(⇀‸↼‶)ᕗ",
    mentorMessages: [
      "LEGENDS DO NOT RUSH. THEY DOMINATE.",
      "THE ARENA EXPECTS FEAR. GIVE IT CLARITY.",
      "MAKE THIS WORD REMEMBER YOU.",
    ],
  },
  10: {
    key: "wordpapa",
    scale: 1.34,
    bubbleTone: "bg-amber-500",
    faceClass: "text-sm lg:text-2xl",
    cardTone: "bg-amber-50",
    topIcon: "👑",
    leftIcon: "☀️",
    rightIcon: "✦",
    bottomIcon: "🌌",
    backPlateClass: "bg-red-600",
    aura: true,
    clouds: false,
    birds: false,
    sparkles: true,
    cosmicStars: true,
    balloonMode: "glow",
    stringOpacity: 0.12,
    defaultFace: "(ಠ‿↼)",
    hurtFace: "(•̀-•́)",
    focusFace: "(ಠಿ_ರೃ)",
    winFace: "(•̀ᴗ•́)و",
    masterWinFace: "(•̀ᴗ•́)و",
    mentorMessages: [
      "SHOW ME YOUR MASTERY OF THE LEXICON.",
      "YOU ARE BEYOND GUESSING NOW. DISCERN.",
      "LET PRECISION GUIDE YOUR NEXT CHOICE.",
    ],
  },
};

function getRankAppearance(rankLevel) {
  return RANK_APPEARANCES[rankLevel] || RANK_APPEARANCES[10];
}

export default function DynamicPapa({
  errors: errorsProp,
  wrongCount,
  maxErrors: maxErrorsProp = 5,
  maxTries,
  accent = "#75c32c",
  isWinner: isWinnerProp = false,
  isWon,
  isLost = false,
  secondsElapsed = 0,
  showMentorMsg = false,
  currentRankName = "Infant",
  rankLevel,
  streak = 0,
  wordLength = 0,
  compact = false,
  enableRefillFX = true,
}) {
  const errors = typeof errorsProp === "number" ? errorsProp : (wrongCount || 0);
  const maxErrors = typeof maxErrorsProp === "number" ? maxErrorsProp : (maxTries || 5);
  const isWinner = typeof isWinnerProp === "boolean" ? isWinnerProp : !!isWon;

  const [isMobile, setIsMobile] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [isRefilling, setIsRefilling] = useState(false);

  const resolvedRankLevel = useMemo(() => {
    if (typeof rankLevel === "number" && rankLevel > 0) return rankLevel;
    return RANK_NAME_TO_LEVEL[currentRankName] || 1;
  }, [rankLevel, currentRankName]);

  const rankAppearance = useMemo(
    () => getRankAppearance(resolvedRankLevel),
    [resolvedRankLevel],
  );

  const MILESTONES = [5, 11, 18, 26, 35, 45, 56, 68, 81, 95];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!enableRefillFX) {
      setIsRefilling(false);
      setCelebrate(false);
      return undefined;
    }

    if (streak > 0 && MILESTONES.includes(streak)) {
      setIsRefilling(true);
      setCelebrate(true);
      const timer = setTimeout(() => {
        setIsRefilling(false);
        setCelebrate(false);
      }, 3000);
      return () => clearTimeout(timer);
    }

    return undefined;
  }, [enableRefillFX, streak]);

  const frightenedByWord = resolvedRankLevel <= 2 && wordLength >= 12;
  const challengedByWord = resolvedRankLevel <= 4 && wordLength >= 10;
  const isDead = errors >= maxErrors || isLost;

  const getExpression = () => {
    if (isRefilling) return "o(>_<)o";
    if (isDead) return "(x_x)";
    if (isWinner && resolvedRankLevel >= 10) return rankAppearance.masterWinFace;
    if (isWinner) return rankAppearance.winFace;
    if (frightenedByWord) return rankAppearance.focusFace;
    if (challengedByWord) return rankAppearance.focusFace;
    if (resolvedRankLevel >= 5 && wordLength >= 10) return rankAppearance.focusFace;
    if (errors >= maxErrors * 0.8) return "(╥﹏╥)";
    if (errors >= 3) return "(O_O)";
    if (errors === 0 && secondsElapsed > 15 && resolvedRankLevel >= 3) return rankAppearance.focusFace;
    return errors > 0 ? rankAppearance.hurtFace : rankAppearance.defaultFace;
  };

  const mentorText = useMemo(() => {
    if (isRefilling) return "AIR REFILLED!";
    if (frightenedByWord) return "EEP! THAT WORD IS HUGE...";

    const options = rankAppearance.mentorMessages;
    if (options?.length) {
      return options[Math.floor(Math.random() * options.length)];
    }

    return getMentorMessage(currentRankName, streak >= 10);
  }, [currentRankName, frightenedByWord, isRefilling, rankAppearance, streak]);

  const sinkDistance = compact ? 28 : isMobile ? 35 : 80;
  const currentSink = (errors / maxErrors) * sinkDistance;
  const finalDrop = isDead ? (compact ? 35 : isMobile ? 55 : 130) : 0;

  const boxSize = compact ? "w-12 h-12" : "w-14 h-14 lg:w-20 lg:h-20";
  const wrapperSize = compact
    ? "h-[170px] max-w-[180px]"
    : "h-[200px] lg:h-[450px] lg:max-w-[300px]";
  const outerShadowClass = compact
    ? "shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
    : "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] lg:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]";
  const boxShadowClass = compact
    ? "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
    : "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]";

  return (
    <div
      className={`relative flex items-start justify-center ${wrapperSize} w-full overflow-hidden bg-gradient-to-r lg:bg-gradient-to-b from-sky-300 via-sky-100 to-white dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-950 rounded-2xl border-[3px] border-zinc-900 ${outerShadowClass} mx-auto`}
    >
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {rankAppearance.clouds && (
          <>
            <div className="absolute top-6 left-[-15%] animate-cloud-slow text-[30px] lg:text-[40px] opacity-30">
              ☁️
            </div>
            <div className="absolute top-20 left-[-20%] animate-cloud-med text-[25px] lg:text-[35px] opacity-20">
              ☁️
            </div>
            <div className="absolute top-40 right-[-15%] animate-cloud-fast text-[35px] lg:text-[50px] opacity-25">
              ☁️
            </div>
          </>
        )}

        {rankAppearance.birds && (
          <>
            <div className="absolute top-12 left-[-10%] animate-bird-one text-[14px] opacity-40">
              🐦
            </div>
            <div className="absolute top-28 left-[-10%] animate-bird-two text-[12px] opacity-30">
              🐦
            </div>
          </>
        )}

        {rankAppearance.aura && (
          <div
            className={`absolute inset-x-8 top-8 h-24 rounded-full blur-3xl opacity-25 ${rankAppearance.cosmicStars ? "animate-pulse" : ""}`}
            style={{ backgroundColor: accent }}
          />
        )}

        {rankAppearance.sparkles && (
          <>
            {Array.from({ length: compact ? 5 : 8 }).map((_, i) => (
              <div
                key={`spark-${i}`}
                className="absolute text-[10px] lg:text-sm text-white/70 animate-star-drift"
                style={{
                  left: `${10 + ((i * 13) % 75)}%`,
                  top: `${14 + ((i * 9) % 42)}%`,
                  animationDelay: `${i * 0.22}s`,
                }}
              >
                ✦
              </div>
            ))}
          </>
        )}

        {rankAppearance.cosmicStars && (
          <>
            {Array.from({ length: compact ? 8 : 14 }).map((_, i) => (
              <div
                key={i}
                className="absolute text-[10px] lg:text-sm text-amber-300 animate-star-drift"
                style={{
                  left: `${8 + ((i * 7) % 84)}%`,
                  top: `${10 + ((i * 11) % 55)}%`,
                  animationDelay: `${i * 0.18}s`,
                }}
              >
                ✦
              </div>
            ))}
          </>
        )}
      </div>

      <div
        className={`absolute left-1/2 z-40 transition-all duration-[1000ms] ease-out ${isRefilling ? "scale-110" : "scale-100"}`}
        style={{
          top: "50%",
          transform: `translate(-50%, calc(-50% + ${currentSink + finalDrop}px)) rotate(${isDead ? "25deg" : "0deg"})`,
        }}
      >
        <div className="absolute top-0 left-0 w-0 h-0 z-30">
          {Array.from({ length: maxErrors }).map((_, i) => {
            const isPopped = i < errors;
            if (isPopped) return null;

            const colsPerRow = compact ? 2 : 3;
            const row = Math.floor(i / colsPerRow);
            const col = i % colsPerRow;
            const tx = (col - (colsPerRow - 1) / 2) * (compact ? 24 : isMobile ? 28 : 40);
            const ty = compact ? -(row * 18 + 38) : isMobile ? -(row * 22 + 50) : -(row * 32 + 110);
            const length = Math.sqrt(tx * tx + ty * ty);
            const angle = Math.atan2(tx, -ty) * (180 / Math.PI);

            return (
              <div key={i} className="absolute pointer-events-none">
                <div
                  className="absolute bottom-0 left-0 w-[1.5px] bg-zinc-900/40 origin-bottom"
                  style={{
                    height: `${length}px`,
                    transform: `translateX(-50%) rotate(${angle}deg)`,
                      opacity: rankAppearance.stringOpacity,
                  }}
                />
                <div
                  className={`absolute ${compact ? "w-5 h-6" : "w-6 h-8 lg:w-8 lg:h-10"} rounded-full border-[2px] border-zinc-900 ${rankAppearance.balloonMode === "glow" ? "animate-orb-float" : "animate-float"} ${isRefilling ? "animate-pulse" : ""}`}
                  style={{
                      backgroundColor:
                        rankAppearance.balloonMode === "glow"
                          ? "rgba(255,255,255,0.82)"
                          : rankAppearance.balloonMode === "mist"
                            ? "rgba(255,255,255,0.62)"
                            : accent,
                    left: `${tx}px`,
                    top: `${ty}px`,
                    transform: "translateX(-50%)",
                    animationDelay: `${i * 0.15}s`,
                    boxShadow:
                        rankAppearance.balloonMode === "glow"
                        ? `0 0 18px ${accent}, inset -2px -2px 0px rgba(255,255,255,0.35)`
                          : rankAppearance.balloonMode === "mist"
                            ? `0 0 12px ${accent}, inset -2px -2px 0px rgba(255,255,255,0.25)`
                        : `inset -2px -2px 0px rgba(0,0,0,0.1)`,
                  }}
                >
                  <div className="absolute top-1 left-1.5 w-1.5 h-2 bg-white/40 rounded-full" />
                </div>
              </div>
            );
          })}
        </div>

        <div
          className={`absolute transition-all duration-500 ${isWinner || isRefilling ? "animate-bounce" : !isDead ? "animate-float" : ""}`}
          style={{ transform: `translate(-50%, -50%) scale(${rankAppearance.scale})` }}
        >
          {(showMentorMsg || isRefilling) && !isDead && (
            <div className={`absolute ${compact ? "top-[-48px]" : "top-[-55px] lg:top-[-75px]"} left-1/2 -translate-x-1/2 z-50 animate-bounce`}>
              <div className={`${rankAppearance.bubbleTone} text-white text-[8px] font-black px-3 py-1.5 rounded-xl border-2 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-max text-center uppercase whitespace-nowrap`}>
                {mentorText}
              </div>
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {rankAppearance.aura && (
              <div className="absolute -z-10 w-20 h-20 lg:w-24 lg:h-24 rounded-full blur-2xl opacity-45 animate-pulse" style={{ backgroundColor: accent }} />
            )}
            {rankAppearance.topIcon && <div className="absolute -top-4 lg:-top-5 text-sm lg:text-lg">{rankAppearance.topIcon}</div>}
            {rankAppearance.leftIcon && <div className="absolute -left-6 top-5 text-xs lg:text-base rotate-[-18deg]">{rankAppearance.leftIcon}</div>}
            {rankAppearance.rightIcon && <div className="absolute -right-6 top-5 text-xs lg:text-base rotate-[18deg]">{rankAppearance.rightIcon}</div>}
            {rankAppearance.bottomIcon && <div className="absolute -bottom-5 text-sm lg:text-lg">{rankAppearance.bottomIcon}</div>}
            {rankAppearance.backPlateClass && (
              <div className={`absolute -z-10 top-4 w-14 h-12 lg:w-16 lg:h-14 rounded-[18px] ${rankAppearance.backPlateClass} border-[3px] border-zinc-900`} />
            )}
          </div>

          <div className={`${boxSize} flex items-center justify-center rounded-2xl border-[3px] border-zinc-900 ${rankAppearance.cardTone} dark:bg-zinc-800 ${boxShadowClass} ${isRefilling ? "animate-inflate" : ""} ${errors >= maxErrors * 0.8 && !isDead ? "animate-shake" : ""}`}>
            <div
              className="absolute top-0 left-0 right-0 h-2.5 border-b-2 border-zinc-900 rounded-t-[0.8rem] lg:rounded-t-[1.1rem]"
              style={{ backgroundColor: accent }}
            />
            <span
              className={`${rankAppearance.faceClass} font-black text-zinc-900 dark:text-zinc-100 select-none`}
              style={{ textShadow: rankAppearance.cosmicStars ? `0 0 8px ${accent}` : "none" }}
            >
              {getExpression()}
            </span>
          </div>
        </div>
      </div>

      {celebrate && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute bottom-[-50px] animate-celebrate-balloon text-2xl lg:text-4xl"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: 0.8,
              }}
            >
              {rankAppearance.cosmicStars ? "✦" : "🎈"}
            </div>
          ))}
        </div>
      )}

      <div className="absolute bottom-0 left-0 w-full h-[9px] lg:h-[18px] flex justify-around items-end z-10 bg-zinc-200 dark:bg-zinc-800">
        {Array.from({ length: compact ? 12 : 20 }).map((_, i) => (
          <div
            key={i}
            className="w-0 h-0 border-l-[4px] lg:border-l-[8px] border-l-transparent border-r-[4px] lg:border-r-[8px] border-r-transparent border-b-[9px] lg:border-b-[18px] border-b-zinc-900 dark:border-b-white"
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes inflate {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translate(-50%, 0px) rotate(-1.5deg);
          }
          50% {
            transform: translate(-50%, -10px) rotate(1.5deg);
          }
        }
        @keyframes orb-float {
          0%,
          100% {
            transform: translateX(-50%) translateY(0px);
          }
          50% {
            transform: translateX(-50%) translateY(-6px);
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-3px);
          }
          75% {
            transform: translateX(3px);
          }
        }
        @keyframes celebrate-balloon {
          0% {
            transform: translateY(0) rotate(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-500px) rotate(20deg);
            opacity: 0;
          }
        }
        @keyframes bird-fly {
          0% {
            transform: translate3d(-50px, 0, 0);
          }
          50% {
            transform: translate3d(150px, -8px, 0);
          }
          100% {
            transform: translate3d(350px, 0, 0);
          }
        }
        @keyframes star-drift {
          0%,
          100% {
            transform: translateY(0px) scale(1);
            opacity: 0.35;
          }
          50% {
            transform: translateY(-8px) scale(1.15);
            opacity: 0.9;
          }
        }
        .animate-inflate {
          animation: inflate 0.4s ease-in-out infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-orb-float {
          animation: orb-float 2.6s ease-in-out infinite;
        }
        .animate-shake {
          animation: shake 0.15s ease-in-out infinite;
        }
        .animate-celebrate-balloon {
          animation: celebrate-balloon 3s ease-out forwards;
        }
        .animate-cloud-slow {
          animation: cloud-slow 75s linear infinite;
          will-change: transform;
        }
        .animate-cloud-med {
          animation: cloud-med 50s linear infinite;
          will-change: transform;
        }
        .animate-cloud-fast {
          animation: cloud-fast 35s linear infinite;
          will-change: transform;
        }
        .animate-bird-one {
          animation: bird-fly 20s linear infinite;
          will-change: transform;
        }
        .animate-bird-two {
          animation: bird-fly 28s linear infinite;
          animation-delay: 5s;
          will-change: transform;
        }
        .animate-star-drift {
          animation: star-drift 2.8s ease-in-out infinite;
        }
        @keyframes cloud-slow {
          0% {
            transform: translate3d(-150px, 0, 0);
          }
          100% {
            transform: translate3d(350px, 0, 0);
          }
        }
        @keyframes cloud-med {
          0% {
            transform: translate3d(-200px, 0, 0);
          }
          100% {
            transform: translate3d(400px, 0, 0);
          }
        }
        @keyframes cloud-fast {
          0% {
            transform: translate3d(350px, 0, 0);
          }
          100% {
            transform: translate3d(-250px, 0, 0);
          }
        }
      `}</style>
    </div>
  );
}
