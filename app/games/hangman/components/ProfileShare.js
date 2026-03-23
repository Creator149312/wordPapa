"use client";
import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import {
  Share2,
  Trophy,
  Flame,
  Target,
  Star,
  Loader2,
  Link2,
  Check,
} from "lucide-react";

export default function ProfileShare({
  userStats = {
    name: "Word Explorer",
    rankName: "Sage",
    rankColor: "#4f46e5",
    totalXP: 1250,
    wordsMastered: 142,
    bestStreak: 24,
    level: 5,
  },
}) {
  const cardRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateImage = async () => {
    if (!cardRef.current) return;
    setLoading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3, // High-res for social media
        backgroundColor: "#ffffff",
      });

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "wordpapa-profile.png", {
        type: "image/png",
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${userStats.name}'s WordPapa Profile`,
          text: `Check out my progress on WordPapa! I'm currently a ${userStats.rankName}.`,
        });
      } else {
        const link = document.createElement("a");
        link.download = "my-wordpapa-profile.png";
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error("Share failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 w-full max-w-md mx-auto">
      {/* 1. VISUAL SHARE BUTTON */}
      <Button
        onClick={generateImage}
        disabled={loading}
        className="w-full h-16 rounded-[2rem] bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 text-white font-black uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-black/10"
      >
        {loading ? <Loader2 className="animate-spin" /> : <Share2 size={20} />}
        {loading ? "Generating Card..." : "Share Profile Card"}
      </Button>

      {/* 2. THE HIDDEN PROFILE TEMPLATE */}
      <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
        <div
          ref={cardRef}
          className="w-[800px] h-[500px] bg-white flex overflow-hidden border-[16px] border-zinc-100"
          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
        >
          {/* Left Side: Avatar/Rank */}
          <div
            className="w-1/3 h-full flex flex-col items-center justify-center relative p-8 text-white"
            style={{ backgroundColor: userStats.rankColor }}
          >
            <div className="absolute top-4 left-4 opacity-20">
              <Star size={40} fill="white" />
            </div>

            <div className="w-32 h-32 rounded-[2.5rem] bg-white/20 backdrop-blur-md border-4 border-white/50 flex items-center justify-center mb-4 shadow-2xl">
              <Trophy size={60} />
            </div>

            <h2 className="text-4xl font-black uppercase tracking-tighter">
              {userStats.rankName}
            </h2>
            <p className="text-white/80 font-bold tracking-[0.2em] text-sm mt-1">
              LEVEL {userStats.level}
            </p>
          </div>

          {/* Right Side: Stats Grid */}
          <div className="w-2/3 h-full bg-white p-12 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-zinc-400 font-black uppercase text-[12px] tracking-widest">
                  Player Profile
                </p>
                <h3 className="text-4xl font-black text-zinc-900 tracking-tight mt-1">
                  {userStats.name}
                </h3>
              </div>
              <div className="bg-[#75c32c] text-white px-4 py-2 rounded-xl font-black text-xl italic shadow-lg">
                WORDPAPA
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1 text-orange-500">
                  <Flame size={18} fill="currentColor" />
                  <span className="text-[10px] font-black uppercase">
                    Best Streak
                  </span>
                </div>
                <span className="text-3xl font-black text-zinc-900">
                  {userStats.bestStreak}
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1 text-blue-500">
                  <Target size={18} fill="currentColor" />
                  <span className="text-[10px] font-black uppercase">
                    Words Solved
                  </span>
                </div>
                <span className="text-3xl font-black text-zinc-900">
                  {userStats.wordsMastered}
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1 text-purple-500">
                  <Star size={18} fill="currentColor" />
                  <span className="text-[10px] font-black uppercase">
                    Total XP
                  </span>
                </div>
                <span className="text-3xl font-black text-zinc-900">
                  {userStats.totalXP}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center border-t-2 border-zinc-50 pt-6">
              <p className="text-[11px] font-bold text-zinc-400 max-w-[200px]">
                Join thousands of players and challenge your vocabulary!
              </p>
              <div className="text-right">
                <p className="text-[9px] font-black text-zinc-300 uppercase">
                  Play Free Online
                </p>
                <p className="text-lg font-black text-[#75c32c]">
                  WORDPAPA.COM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
