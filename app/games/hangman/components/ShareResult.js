'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check, Send } from "lucide-react";

export default function ShareResult({ 
  word, 
  category, 
  isWon, 
  streak = 0, 
  mode = 'classic',
  opponentName = null,
  myScore = 0,
  oppScore = 0
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const isOnline = mode === 'online';
    const wordLength = word.length;
    
    // 1. Create the Visual Word Grid (🟩 for win, ⬜ for loss)
    // This creates a spoiler-free block representation of the word length
    const grid = isWon ? "🟩".repeat(wordLength) : "⬜".repeat(wordLength);

    // 2. Mode Specific Content
    let modeHeader = isOnline ? `WordPapa Duel ⚔️` : `WordPapa Training ⚡`;
    let scoreDetail = isOnline 
      ? `Me: ${myScore} | ${opponentName || 'Rival'}: ${oppScore}\nResult: ${myScore >= oppScore ? '🏆 WIN' : '💀 LOSS'}`
      : `Streak: ${streak} 🔥\nResult: ${isWon ? 'MASTERED' : 'TRY AGAIN'}`;

    const shareData = {
      title: 'WordPapa Progress',
      text: `${modeHeader}\n🏷️ Topic: ${category}\n${grid}\n\n${scoreDetail}\n\nJoin the challenge:`,
      url: 'https://wordpapa.com'
    };

    // 3. Try Native Share, Fallback to Clipboard
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        throw new Error('Web Share not supported');
      }
    } catch (err) {
      const fullText = `${shareData.text} ${shareData.url}`;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(fullText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  return (
    <Button 
      variant="outline"
      onClick={handleShare}
      className={`w-full sm:w-auto rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] h-12 px-8 transition-all duration-300 border-2 active:scale-95 shadow-lg shadow-[#75c32c]/5 ${
        copied 
        ? 'bg-[#75c32c] border-[#75c32c] text-white' 
        : 'bg-white dark:bg-gray-950 border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-[#75c32c] hover:text-[#75c32c]'
      }`}
    >
      {copied ? (
        <><Check className="mr-2 w-4 h-4" strokeWidth={3} /> Result Copied!</>
      ) : (
        <><Send className="mr-2 w-4 h-4" strokeWidth={3} /> Share Progress</>
      )}
    </Button>
  );
}
