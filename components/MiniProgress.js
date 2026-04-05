"use client";

import { useState, useEffect } from "react";
import { Trophy, Target } from "lucide-react";

export default function MiniProgress({ listId }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/lists/${listId}/practice-stats`);
        if (response.ok) {
          const data = await response.json();
          setStats(data.practiceStats);
        }
      } catch (error) {
        console.error("Failed to fetch practice stats:", error);
      }
    };

    if (listId) {
      fetchStats();
    }
  }, [listId]);

  if (!stats) {
    return null; // Don't show anything if no progress yet
  }

  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex items-center gap-1">
        <Target className="text-blue-500 w-3 h-3" />
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
          {stats.attempts}× • {stats.bestScore}%
        </span>
      </div>

      {stats.bestScore >= 80 && (
        <div className="flex items-center gap-1">
          <Trophy className="text-yellow-500 w-3 h-3" fill="currentColor" />
          <span className="text-xs font-black text-yellow-600 dark:text-yellow-400 uppercase tracking-wider">
            Mastered
          </span>
        </div>
      )}
    </div>
  );
}