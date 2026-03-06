'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Share2, Check } from "lucide-react";

export default function ShareResult({ word, category, guessedLetters, isWon }) {
  const [copied, setCopied] = useState(false);

  const generateShareText = () => {
    const wordLetters = word.toUpperCase().split('');
    const wrongCount = guessedLetters.filter(l => !wordLetters.includes(l)).length;
    
    // Create the emoji string
    let grid = "";
    wordLetters.forEach(l => {
      grid += guessedLetters.includes(l) ? "🟩" : "⬜";
    });
    
    const text = `WordPapa Hangman 🧔\n🏷️ Topic: ${category}\n${grid}\n${isWon ? '🏆 Saved!' : '💀 Lost'}\nErrors: ${wrongCount}/6\n\nPlay at: wordpapa.com/hangman`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Button 
      variant="outline"
      onClick={generateShareText}
      className={`rounded-full font-black uppercase tracking-widest text-xs py-6 px-8 transition-all duration-300 ${copied ? 'bg-green-50 border-green-200 text-green-600' : 'hover:border-[#75c32c] hover:text-[#75c32c]'}`}
    >
      {copied ? (
        <><Check className="mr-2 w-4 h-4" /> Result Copied!</>
      ) : (
        <><Share2 className="mr-2 w-4 h-4" /> Share Score</>
      )}
    </Button>
  );
}