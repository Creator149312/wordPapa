"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";
import Toast from "@components/Toast";

export default function ShareProfileCard({ name, username }) {
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = `${name}'s WordPapa Showcase`;
    const text = `Check out ${name}'s vocabulary mastery and arena rank on WordPapa!`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        // User cancelled or share failed, fallback to copy
        copyUrl(url);
      }
    } else {
      copyUrl(url);
    }
  };

  const copyUrl = (url) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setToastMessage("Profile link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      )}
      <button
        onClick={handleShare}
        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-black text-xs uppercase tracking-wider hover:border-[#75c32c] dark:hover:border-[#75c32c] transition-all active:scale-95 shadow-sm"
      >
        {copied ? (
          <Check size={16} className="text-[#75c32c]" />
        ) : (
          <Share2 size={16} className="text-[#75c32c]" />
        )}
        <span>{copied ? "Link Copied!" : "Share Profile"}</span>
      </button>
    </>
  );
}
