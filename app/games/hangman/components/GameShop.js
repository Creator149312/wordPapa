'use client';

import React, { useState } from 'react';
import { Zap, Palette, CheckCircle2, Coins, Lock } from 'lucide-react';
import { useProfile } from '../../../ProfileContext';

const THEMES = [
  { id: 'classic', name: 'Classic Chalk', price: 0, color: 'bg-slate-700' },
  { id: 'cyberpunk', name: 'Cyber Neon', price: 500, color: 'bg-purple-600' },
  { id: 'forest', name: 'Nature Wild', price: 500, color: 'bg-emerald-600' },
  { id: 'ocean', name: 'Deep Sea', price: 1000, color: 'bg-blue-600' },
];

export default function GameShop() {
  const { profile, purchaseTheme, updateLocalProfile } = useProfile();
  const [syncing, setSyncing] = useState(null);

  const handlePurchase = async (type, id, price) => {
    // 1. Validation
    if (profile.papaPoints < price) return alert("Not enough Papa Points!");
    if (type === 'life' && profile.lives >= 10) return alert("Energy is already full!");

    setSyncing(id);

    // 2. Local State Update (Instant Feedback)
    let updatedProfile = { ...profile };

    if (type === 'life') {
      updatedProfile.papaPoints -= price;
      updatedProfile.lives = Math.min(10, profile.lives + 1);
    } else if (type === 'theme') {
      const success = purchaseTheme(id, price); // This calls the context function
      if (!success) { setSyncing(null); return; }
      updatedProfile.papaPoints -= price;
      updatedProfile.unlockedThemes = [...profile.unlockedThemes, id];
    }

    // 3. Database Sync (Make it permanent)
    try {
      const res = await fetch('/api/game/hangman/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile)
      });
      const data = await res.json();
      if (data.success) {
        updateLocalProfile(data.profile); // Sync back fresh DB data
      }
    } catch (err) {
      console.error("Purchase sync failed:", err);
    } finally {
      setSyncing(null);
    }
  };

  return (
    <section className="mt-10">
      <div className="flex items-center gap-3 mb-6 ml-2">
        <div className="h-6 w-1.5 bg-yellow-400 rounded-full" />
        <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 tracking-tight">
          Papa's Shop
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LIVES SECTION */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center">
              <Zap size={24} fill="currentColor" />
            </div>
            <div>
              <h3 className="font-black dark:text-white">Life Energy</h3>
              <p className="text-xs text-gray-400">Restore 1 Life instantly</p>
            </div>
          </div>
          <button
            onClick={() => handlePurchase('life', 'life-refill', 100)}
            disabled={syncing === 'life-refill' || profile.lives >= 10 || profile.papaPoints < 100}
            className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-800 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-gray-100"
          >
            <Coins size={18} />
            100 Points
          </button>
        </div>

        {/* THEMES SECTION */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center">
              <Palette size={24} />
            </div>
            <div>
              <h3 className="font-black dark:text-white">Game Themes</h3>
              <p className="text-xs text-gray-400">New looks for Hangman</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {THEMES.map((theme) => {
              const isUnlocked = profile.unlockedThemes.includes(theme.id);
              const canAfford = profile.papaPoints >= theme.price;

              return (
                <div key={theme.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${theme.color} shadow-inner`} />
                    <span className="text-sm font-bold dark:text-gray-200">{theme.name}</span>
                  </div>
                  
                  {isUnlocked ? (
                    <span className="text-[#75c32c] px-3"><CheckCircle2 size={20} /></span>
                  ) : (
                    <button
                      onClick={() => handlePurchase('theme', theme.id, theme.price)}
                      disabled={syncing === theme.id || !canAfford}
                      className="px-4 py-2 bg-[#75c32c] text-white text-xs font-black rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:bg-gray-400"
                    >
                      {theme.price} PTS
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}