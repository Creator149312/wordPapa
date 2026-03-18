"use client";
import { useCallback } from "react";

export function useAudio() {
  const playSynth = useCallback((type) => {
    // Check if we're in the browser and if muted
    if (typeof window === "undefined") return;
    const isMuted = localStorage.getItem("wordpapa_muted") === "true";
    if (isMuted) return;

    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === "CORRECT") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start();
      osc.stop(now + 0.1);
    } else if (type === "POP") {
      osc.type = "square";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start();
      osc.stop(now + 0.1);
    } else if (type === "MILESTONE") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start();
      osc.stop(now + 0.3);
    }
else if (type === "LEVEL_UP") {
  const frequencies = [261.63, 329.63, 392.00, 523.25, 659.25]; // C major arpeggio
  frequencies.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.connect(g);
    g.connect(ctx.destination);
    
    const start = now + (i * 0.1);
    osc.frequency.setValueAtTime(freq, start);
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(0.1, start + 0.05);
    g.gain.exponentialRampToValueAtTime(0.01, start + 0.5);
    
    osc.start(start);
    osc.stop(start + 0.5);
  });
}
  }, []);

  return { playSynth };
}

// "use client";
// import { useCallback, useRef } from "react";

// const SOUNDS = {
//   SCRIBBLE: "/sounds/scribble.mp3",
//   POP: "/sounds/pop.mp3",
//   SLIDE: "/sounds/slide.mp3",
//   SUCCESS: "/sounds/success.mp3",
//   FALL: "/sounds/fall.mp3",
//   REVIVE: "/sounds/revive.mp3"
// };

// export function useAudio() {
//   const audioRefs = useRef({});

//   const playSound = useCallback((soundKey) => {
//     const src = SOUNDS[soundKey];
//     if (!src) return;

//     // Create or reuse audio object
//     if (!audioRefs.current[soundKey]) {
//       audioRefs.current[soundKey] = new Audio(src);
//     }

//     const sound = audioRefs.current[soundKey];
    
//     // Reset to start so it can play rapidly (e.g., fast typing)
//     sound.currentTime = 0;
//     sound.play().catch(e => console.log("Audio play blocked", e));
//   }, []);

//   return { playSound };
// }