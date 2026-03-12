'use client';
import { useState, useEffect } from 'react';
import HangmanGame from '../Hangman'; // Import your main game component
import { getDailyMetadata } from '../lib/daily';
import { Card } from "@/components/ui/card";
import { Clock, Lock } from "lucide-react";

export default function DailyChallengePage() {
  const [meta, setMeta] = useState(null);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    const dailyData = getDailyMetadata();
    setMeta(dailyData);
    
    // Check if already played today
    const played = localStorage.getItem(`daily_${dailyData.dateKey}`);
    if (played) setHasPlayed(true);
  }, []);

  if (!meta) return null;

  if (hasPlayed) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4 bg-gray-50 dark:bg-black">
        <Card className="max-w-md w-full p-8 text-center rounded-[2.5rem] shadow-2xl">
          <div className="mb-6 flex justify-center">
            <div className="p-4 bg-amber-100 dark:bg-amber-900/30 rounded-full">
              <Lock className="text-amber-600" size={40} />
            </div>
          </div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">See you tomorrow!</h1>
          <p className="text-gray-500 mt-2 font-medium">You've already attempted Daily #{meta.dayNumber}.</p>
          
          <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl">
            <p className="text-[10px] font-black uppercase text-gray-400">Next Word In</p>
            <p className="text-2xl font-mono font-bold text-[#75c32c]">Coming Soon</p>
          </div>
        </Card>
      </div>
    );
  }

  // Pass a 'daily' flag to your main component
  return (
    <HangmanGame 
      initialMode="daily" 
      dailyWord={meta.wordObj} 
      onComplete={() => localStorage.setItem(`daily_${meta.dateKey}`, 'true')}
    />
  );
}