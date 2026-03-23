"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Share2, Copy } from "lucide-react";

export default function ShareResult({
  word,
  isWon,
  streak = 0,
  xpEarned = 0,
  mistakes = 0,
  maxMistakes = 5,
  currentRank = "Infant",
  variant = "full",
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const balloonsSaved = maxMistakes - mistakes;
    const MILESTONES = [5, 11, 18, 26, 35, 45, 56];
    const isMilestone = MILESTONES.includes(streak);
    const balloonGrid = "🎈".repeat(balloonsSaved) + "💥".repeat(mistakes);

    const shareText = [
      `☁️  WORDPAPA CHALLENGE  ☁️`,
      isMilestone ? `⭐ NEW MILESTONE REACHED! ⭐` : ``,
      `━━━━━━━━━━━━━━━━━━━━`,
      `🏆 RANK: ${currentRank.toUpperCase()}`,
      `🔥 STREAK: ${streak} Words`,
      `✨ XP: +${xpEarned}`,
      `🎈 BALLOONS: ${balloonsSaved}/${maxMistakes}`,
      `📦 WORD: ${isWon ? "SOLVED ✅" : "POPPED ❌"}`,
      `${balloonGrid}`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `Think you can fly higher than me?`,
      `Play now: https://words.englishbix.com/games/hangman`,
    ]
      .filter(Boolean)
      .join("\n");

    const shareData = {
      title: "HangMan Challenge",
      text: shareText,
      url: "https://words.englishbix.com/games/hangman",
    };

    // 1. Check if the browser supports the Share API and can share this data
    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare(shareData)
    ) {
      try {
        await navigator.share(shareData);
        return; // Success!
      } catch (err) {
        // If user cancelled, don't show the "Copied" alert
        if (err.name === "AbortError") return;
        console.error("Share failed:", err);
      }
    }

    // 2. Fallback to Clipboard (Desktop / Chrome / Unsecured)
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(
          shareText + "\nhttps://words.englishbix.com/games/hangman",
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // 3. Last resort fallback for non-secure contexts (e.g., testing on mobile via IP)
        const textArea = document.createElement("textarea");
        textArea.value = shareText + "\nhttps://words.englishbix.com/games/hangman";
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand("copy");
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error("Fallback copy failed", err);
        }
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error("Clipboard failed:", err);
    }
  };

  if (variant === "icon") {
    return (
      <Button
        variant="outline"
        onClick={handleShare}
        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 border-2 ${
          copied
            ? "bg-[#75c32c] border-[#75c32c] text-white"
            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
        }`}
      >
        {copied ? (
          <Check size={18} strokeWidth={3} />
        ) : (
          <Share2 size={18} strokeWidth={3} />
        )}
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={handleShare}
      className={`w-full sm:w-auto rounded-2xl font-black uppercase tracking-widest text-[10px] h-12 px-8 transition-all duration-300 border-2 active:scale-95 shadow-lg ${
        copied
          ? "bg-[#75c32c] border-[#75c32c] text-white shadow-[#75c32c]/20"
          : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:border-[#75c32c] hover:text-[#75c32c]"
      }`}
    >
      {copied ? (
        <>
          <Check className="mr-2 w-4 h-4" strokeWidth={3} /> Copied to
          Clipboard!
        </>
      ) : (
        <>
          <Share2 className="mr-2 w-4 h-4" strokeWidth={3} /> Challenge Friends
        </>
      )}
    </Button>
  );
}
