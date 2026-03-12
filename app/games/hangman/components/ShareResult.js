'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Share2, Check } from "lucide-react";

export default function ShareResult({ 
  word, 
  category, 
  guessedLetters, 
  isWon, 
  streak = 0, 
  mode = 'classic',
  opponentName = null,
  myScore = 0,
  oppScore = 0
}) {
  const [copied, setCopied] = useState(false);

  const generateShareText = () => {
    const isOnline = mode === 'online';
    const wordLetters = word.toUpperCase().split('');
    
    // 1. Create the Visual Word Grid
    let grid = "";
    wordLetters.forEach(l => {
      grid += guessedLetters.includes(l) ? "🟩" : "⬜";
    });

    // 2. Mode Specific Content
    let modeHeader = "";
    let scoreDetail = "";
    let footerSignoff = "";

    if (isOnline) {
      const didIWin = myScore > oppScore || (myScore === oppScore && isWon);
      modeHeader = `WordPapa 1vs1 Duel ⚔️`;
      scoreDetail = `Me: ${myScore} 🎯 | ${opponentName || 'Rival'}: ${oppScore} 🎯\nResult: ${didIWin ? '🏆 WINNER' : '💀 DEFEATED'}`;
    } else {
      modeHeader = `WordPapa Classic 🧔`;
      scoreDetail = `🔥 Final Streak: ${streak}\nResult: ${streak > 0 ? 'Legendary!' : 'Game Over'}`;
    }

    // 3. Combine everything
    const text = `${modeHeader}\n🏷️ Topic: ${category}\n${grid}\n\n${scoreDetail}\n\nPlay at: wordpapa.com/hangman`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <Button 
      variant="outline"
      onClick={generateShareText}
      className={`rounded-2xl font-black uppercase tracking-widest text-[10px] h-14 px-8 transition-all duration-300 border-2 shadow-sm active:scale-95 ${
        copied 
        ? 'bg-[#75c32c]/10 border-[#75c32c] text-[#75c32c]' 
        : 'bg-white dark:bg-gray-900 hover:border-gray-900 dark:hover:border-white'
      }`}
    >
      {copied ? (
        <><Check className="mr-2 w-4 h-4" /> Copied!</>
      ) : (
        <><Share2 className="mr-2 w-4 h-4" /> Share Result</>
      )}
    </Button>
  );
}