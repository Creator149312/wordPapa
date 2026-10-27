"use client";
import { useCallback } from "react";

export function useAudio() {
  const playSynth = useCallback((type) => {
    if (typeof window === "undefined") return;
    const isMuted = localStorage.getItem("wordpapa_muted") === "true";
    if (isMuted) return;

    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;

    if (type === "CORRECT") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start();
      osc.stop(now + 0.1);
    } else if (type === "POP") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "square";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start();
      osc.stop(now + 0.1);
    } else if (type === "MILESTONE") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start();
      osc.stop(now + 0.3);
    } else if (type === "LEVEL_UP") {
      const frequencies = [261.63, 329.63, 392.0, 523.25, 659.25];
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.connect(g);
        g.connect(ctx.destination);
        const start = now + i * 0.1;
        osc.frequency.setValueAtTime(freq, start);
        g.gain.setValueAtTime(0, start);
        g.gain.linearRampToValueAtTime(0.1, start + 0.05);
        g.gain.exponentialRampToValueAtTime(0.01, start + 0.5);
        osc.start(start);
        osc.stop(start + 0.5);
      });
    } else if (type === "COIN") {
    /* --- NEW COIN SOUND --- */
      // Arcade "Ching" effect using two notes
      [987.77, 1318.51].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.connect(gain);
        gain.connect(ctx.destination);

        const start = now + i * 0.05; // Slight delay for the second note
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.1, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);

        osc.start(start);
        osc.stop(start + 0.4);
      });
    } else if (type === "FREEZE") {
      // Ice crackle & crystalline freeze sound
      [600, 420, 280].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.connect(gain);
        gain.connect(ctx.destination);
        const start = now + i * 0.06;
        osc.frequency.setValueAtTime(freq, start);
        osc.frequency.exponentialRampToValueAtTime(100, start + 0.15);
        gain.gain.setValueAtTime(0.08, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);
        osc.start(start);
        osc.stop(start + 0.15);
      });
    } else if (type === "SHIELD") {
      // Harmonic protective resonance
      [330, 440, 660].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.connect(gain);
        gain.connect(ctx.destination);
        const start = now + i * 0.04;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.07, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
        osc.start(start);
        osc.stop(start + 0.4);
      });
    } else if (type === "SHIELD_BLOCK") {
      // Metallic deflection clang
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.2);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === "REVEAL") {
      // Magical ascending sparkles
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.connect(gain);
        gain.connect(ctx.destination);
        const start = now + i * 0.07;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.09, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
        osc.start(start);
        osc.stop(start + 0.3);
      });
    } else if (type === "SCRAMBLE") {
      // Wobbly dissonance
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(320, now + 0.1);
      osc.frequency.linearRampToValueAtTime(180, now + 0.25);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === "ELIXIR_EMPTY") {
      // Short buzzer for insufficient elixir
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(130, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === "SUDDEN_DEATH") {
      // Clash Royale Battle Horn / Royal Trumpet fanfare
      [220, 293.66, 369.99, 440].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.connect(gain);
        gain.connect(ctx.destination);
        const start = now + i * 0.12;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.12, start + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);
        osc.start(start);
        osc.stop(start + 0.5);
      });
    }
  }, []);

  return { playSynth };
}
