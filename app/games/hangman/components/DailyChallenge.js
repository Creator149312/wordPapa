'use client';
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Lock, Trophy, Star } from "lucide-react";
import { getDailyMetadata, formatTimeLeft } from '../lib/daily';

export default function DailyChallenge({ onPlay, profile }) {
  const [meta, setMeta] = useState(getDailyMetadata());
  const [hasPlayed, setHasPlayed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(meta.secondsLeft);

  useEffect(() => {
    const status = localStorage.getItem(`daily_${meta.dateKey}`);
    if (status) setHasPlayed(true);

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [meta.dateKey]);

  if (hasPlayed) {
    return (
      <Card className="p-8 text-center bg-gray-900 border-gray-800 text-white rounded-[2rem] space-y-6">
        <div className="flex justify-center">
          <div className="bg-gray-800 p-4 rounded-full">
            <Lock className="text-gray-400" size={32} />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter">Daily Attempt Used</h2>
          <p className="text-gray-400 text-sm mt-1">You've already tackled Daily #{meta.dayNumber}.</p>
        </div>
        
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Next Challenge In</p>
          <div className="flex items-center justify-center gap-2 text-xl font-mono font-bold text-[#75c32c]">
            <Clock size={18} />
            {formatTimeLeft(timeLeft)}
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full rounded-xl border-gray-700 hover:bg-white/5 text-xs font-black uppercase tracking-widest"
          onClick={() => window.location.reload()}
        >
          Check Leaderboard
        </Button>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden p-8 border-2 border-[#75c32c] bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl group">
      {/* Background Decorative Star */}
      <Star className="absolute -right-4 -top-4 text-[#75c32c]/10 rotate-12" size={160} />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
        <div className="bg-[#75c32c]/10 p-5 rounded-[2rem]">
          <Calendar className="text-[#75c32c]" size={40} />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
            <span className="bg-[#75c32c] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Active</span>
            <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Daily #{meta.dayNumber}</span>
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">
            Global Challenge
          </h2>
          <p className="text-gray-500 text-sm font-medium">One word. One chance. Double rewards.</p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-2">
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-lg border border-amber-100 dark:border-amber-900/50">
              <span className="text-amber-600 font-black text-sm">+20 🪙</span>
            </div>
            <div className="flex items-center gap-1 bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-lg border border-purple-100 dark:border-purple-900/50">
              <span className="text-purple-600 font-black text-sm">+50 🧪</span>
            </div>
          </div>
          
          <Button 
            onClick={() => onPlay('daily')}
            className="bg-[#75c32c] hover:bg-black hover:scale-105 text-white font-black px-10 h-14 rounded-2xl uppercase text-xs tracking-[0.2em] transition-all shadow-lg active:scale-95"
          >
            Play Now
          </Button>
        </div>
      </div>
    </Card>
  );
}