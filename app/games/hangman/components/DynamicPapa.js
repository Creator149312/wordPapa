"use client";
import React, { useMemo, useState, useEffect } from "react";
import { getMentorMessage } from "../constants/mentorMessages";

export default function DynamicPapa({
  errors,
  maxErrors = 5,
  accent = "#75c32c",
  isWinner = false,
  secondsElapsed = 0,
  showMentorMsg = false,
  currentRankName = "Infant",
  streak = 0,
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [isRefilling, setIsRefilling] = useState(false);

  const MILESTONES = [5, 11, 18, 26, 35, 45, 56, 68, 81, 95];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (streak > 0 && MILESTONES.includes(streak)) {
      setIsRefilling(true);
      setCelebrate(true);
      const timer = setTimeout(() => {
        setIsRefilling(false);
        setCelebrate(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [streak]);

  const getExpression = () => {
    if (isRefilling) return "o(>_<)o";
    if (errors >= maxErrors) return "(x_x)";
    if (isWinner) return "٩(^‿^)۶";
    if (errors >= maxErrors * 0.8) return "(╥﹏╥)";
    if (errors >= 3) return "(O_O)";
    if (errors === 0 && secondsElapsed > 15) return "(¬_¬)";
    if (errors > 0 && errors < 3) return "(•_•)";
    return "(•‿•)";
  };

  const mentorText = useMemo(() => {
    if (isRefilling) return "AIR REFILLED!";
    return getMentorMessage(currentRankName, streak >= 10);
  }, [currentRankName, streak, isRefilling]);

  const isDead = errors >= maxErrors;

  // PHYSICS: Proportions for 200px vs 450px height
  const sinkDistance = isMobile ? 35 : 80;
  const currentSink = (errors / maxErrors) * sinkDistance;
  const finalDrop = isDead ? (isMobile ? 55 : 130) : 0;

  return (
    <div className="relative flex items-start justify-center h-[200px] lg:h-[450px] w-full lg:max-w-[300px] overflow-hidden bg-gradient-to-r lg:bg-gradient-to-b from-sky-300 via-sky-100 to-white dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-950 rounded-2xl border-[3px] border-zinc-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] lg:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mx-auto">
      {/* BACKGROUND DECORATIONS */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-6 left-[-15%] animate-cloud-slow text-[30px] lg:text-[40px] opacity-30">
          ☁️
        </div>
        <div className="absolute top-20 left-[-20%] animate-cloud-med text-[25px] lg:text-[35px] opacity-20">
          ☁️
        </div>
        <div className="absolute top-40 right-[-15%] animate-cloud-fast text-[35px] lg:text-[50px] opacity-25">
          ☁️
        </div>

        {/* Adjusted bird heights for 200px fixed height */}
        <div className="absolute top-12 left-[-10%] animate-bird-one text-[14px] opacity-40">
          🐦
        </div>
        <div className="absolute top-28 left-[-10%] animate-bird-two text-[12px] opacity-30">
          🐦
        </div>
      </div>

      {/* ASSEMBLY GROUP */}
      <div
        className={`absolute left-1/2 z-40 transition-all duration-[1000ms] ease-out 
          ${isRefilling ? "scale-110" : "scale-100"}`}
        style={{
          top: "50%",
          transform: `translate(-50%, calc(-50% + ${currentSink + finalDrop}px)) rotate(${isDead ? "25deg" : "0deg"})`,
        }}
      >
        {/* BALLOON ANCHOR */}
        <div className="absolute top-0 left-0 w-0 h-0 z-30">
          {Array.from({ length: maxErrors }).map((_, i) => {
            const isPopped = i < errors;
            if (isPopped) return null;

            // GRID OF 3 BALLOONS
            const colsPerRow = 3;
            const row = Math.floor(i / colsPerRow);
            const col = i % colsPerRow;

            // Positioning for clean grid
            const tx = (col - (colsPerRow - 1) / 2) * (isMobile ? 28 : 40);
            const ty = isMobile ? -(row * 22 + 50) : -(row * 32 + 110);

            const length = Math.sqrt(tx * tx + ty * ty);
            const angle = Math.atan2(tx, -ty) * (180 / Math.PI);

            return (
              <div key={i} className="absolute pointer-events-none">
                <div
                  className="absolute bottom-0 left-0 w-[1.5px] bg-zinc-900/40 origin-bottom"
                  style={{
                    height: `${length}px`,
                    transform: `translateX(-50%) rotate(${angle}deg)`,
                  }}
                />
                <div
                  className={`absolute w-6 h-8 lg:w-8 lg:h-10 rounded-full border-[2px] border-zinc-900 animate-float
                    ${isRefilling ? "animate-pulse" : ""}`}
                  style={{
                    backgroundColor: accent,
                    left: `${tx}px`,
                    top: `${ty}px`,
                    transform: "translateX(-50%)",
                    animationDelay: `${i * 0.15}s`,
                    boxShadow: `inset -2px -2px 0px rgba(0,0,0,0.1)`,
                  }}
                >
                  <div className="absolute top-1 left-1.5 w-1.5 h-2 bg-white/40 rounded-full" />
                </div>
              </div>
            );
          })}
        </div>

        {/* THE CHARACTER */}
        <div
          className={`absolute transition-all duration-500 
            ${isWinner || isRefilling ? "animate-bounce" : !isDead ? "animate-float" : ""}`}
          style={{ transform: "translate(-50%, -50%)" }}
        >
          {(showMentorMsg || isRefilling) && !isDead && (
            <div className="absolute top-[-55px] lg:top-[-75px] left-1/2 -translate-x-1/2 z-50 animate-bounce">
              <div
                className={`bg-zinc-900 text-white text-[8px] font-black px-3 py-1.5 rounded-xl border-2 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-max text-center uppercase whitespace-nowrap
                ${isRefilling ? "bg-[#75c32c] text-white" : ""}`}
              >
                {mentorText}
              </div>
            </div>
          )}

          <div
            className={`w-14 h-14 lg:w-20 lg:h-20 flex items-center justify-center rounded-2xl border-[3px] border-zinc-900 bg-white dark:bg-zinc-800 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] 
            ${isRefilling ? "animate-inflate" : ""} 
            ${errors >= maxErrors * 0.8 && !isDead ? "animate-shake" : ""}`}
          >
            <div
              className="absolute top-0 left-0 right-0 h-2.5 border-b-2 border-zinc-900 rounded-t-[0.8rem] lg:rounded-t-[1.1rem]"
              style={{ backgroundColor: accent }}
            />
            <span className="text-xl lg:text-2xl font-black text-zinc-900 dark:text-zinc-100 select-none">
              {getExpression()}
            </span>
          </div>
        </div>
      </div>

      {/* CELEBRATION */}
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
              🎈
            </div>
          ))}
        </div>
      )}

      {/* Ground Spikes */}
      <div className="absolute bottom-0 left-0 w-full h-[18px] flex justify-around items-end z-10 bg-zinc-200 dark:bg-zinc-800">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[18px] border-b-zinc-900 dark:border-b-white"
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

        /* Adjusted bird-fly to dip less vertically for 200px mobile view */
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

        .animate-inflate {
          animation: inflate 0.4s ease-in-out infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
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
