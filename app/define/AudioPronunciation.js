// components/AudioPronunciation.jsx
"use client";

import { useEffect, useState } from "react";
import { Volume2 } from "lucide-react";

export default function AudioPronunciation({ word }) {
  const [brianVoice, setBrianVoice] = useState(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      const brian = availableVoices.find(
        (v) =>
          v.name ===
            "Microsoft Brian Online (Natural) - English (United States)" &&
          v.lang === "en-US",
      );
      setBrianVoice(brian || null);
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const playAudio = () => {
    if (!word) return;

    const utterance = new SpeechSynthesisUtterance(word);
    if (brianVoice) {
      utterance.voice = brianVoice;
    }
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={playAudio}
        className="p-2 rounded-md bg-transparent text-blue-600 hover:text-blue-800 
             dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
      >
        <Volume2 className="w-6 h-6" />
      </button>
    </div>
  );
}
