"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { Bookmark, BookmarkCheck, Gamepad2, Loader2, Plus, Sparkles } from "lucide-react";
import AddToMyListsButton from "@components/AddToMyListsButton";
import Toast from "@components/Toast";

/**
 * WordActionButtons
 *
 * Provides a high-converting, streamlined learning funnel right on the definition page:
 * 1. "Quick Save" -> One tap adds to "My Saved Words" immediately (or prompts sign-in).
 * 2. "Save to List..." -> Opens custom list modal for deep organization.
 * 3. "Test Drive" -> Opens Hangman with this word & its context clue immediately.
 */
export default function WordActionButtons({ word, definition }) {
  const { status } = useSession();
  const [isQuickSaving, setIsQuickSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleQuickSave = async () => {
    if (status !== "authenticated") {
      signIn("google");
      return;
    }

    if (isSaved) {
      setToastMessage(`"${word}" is already in My Saved Words!`);
      return;
    }

    setIsQuickSaving(true);
    try {
      const res = await fetch("/api/list/quick-save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word,
          definition: definition || "",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsSaved(true);
        setToastMessage(data.message || `Saved to My Saved Words!`);
      } else {
        setToastMessage(data.error || "Could not save word");
      }
    } catch (e) {
      setToastMessage("Network error saving word");
    } finally {
      setIsQuickSaving(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {/* 1. Quick Save to Word Bank */}
      <button
        onClick={handleQuickSave}
        disabled={isQuickSaving}
        aria-label="Save to My Saved Words"
        className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 shadow-md ${
          isSaved
            ? "bg-[#75c32c]/15 text-[#75c32c] border-2 border-[#75c32c]/40"
            : "bg-[#75c32c] hover:bg-[#66aa26] text-white shadow-[#75c32c]/20"
        }`}
      >
        {isQuickSaving ? (
          <Loader2 size={16} className="animate-spin" />
        ) : isSaved ? (
          <BookmarkCheck size={16} className="text-[#75c32c]" />
        ) : (
          <Bookmark size={16} />
        )}
        <span>{isSaved ? "Saved" : "Save Word"}</span>
      </button>

      {/* 2. Test Drive in Hangman */}
      <Link
        href={`/games/hangman?word=${encodeURIComponent(word)}`}
        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 transition-all active:scale-95"
      >
        <Gamepad2 size={16} />
        <span>Test Drive</span>
      </Link>

      {/* 3. Deep Add to Custom Collections */}
      <AddToMyListsButton
        word={word}
        definition={definition}
        compact={true}
      />

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      )}
    </div>
  );
}
