"use client";

import { useState, useEffect } from "react";
import { Trophy, Target, TrendingUp, Clock } from "lucide-react";

export default function PracticeProgress({ listId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    if (listId) {
      fetchStats();
    }
  }, [listId]);

  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
          <div className="flex gap-4">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-4 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3">
          <Target className="text-blue-500 w-5 h-5" />
          <div>
            <p className="text-sm font-bold text-blue-700 dark:text-blue-300">
              Ready to Practice?
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Take your first quiz to start tracking progress!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const formatLastPracticed = (date) => {
    if (!date) return "Never";
    const now = new Date();
    const diffTime = Math.abs(now - new Date(date));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl p-4 border border-blue-200 dark:border-blue-800">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="text-blue-600 w-4 h-4" />
        <p className="text-sm font-black text-blue-700 dark:text-blue-300 uppercase tracking-wider">
          Your Progress
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="text-center">
          <div className="text-lg font-black text-blue-600 dark:text-blue-400">
            {stats.attempts}
          </div>
          <div className="text-[10px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider">
            Attempts
          </div>
        </div>

        <div className="text-center">
          <div className="text-lg font-black text-green-600 dark:text-green-400">
            {stats.bestScore}%
          </div>
          <div className="text-[10px] font-bold text-green-500 dark:text-green-400 uppercase tracking-wider">
            Best Score
          </div>
        </div>

        <div className="text-center">
          <div className="text-lg font-black text-purple-600 dark:text-purple-400">
            {stats.lastScore}%
          </div>
          <div className="text-[10px] font-bold text-purple-500 dark:text-purple-400 uppercase tracking-wider">
            Last Score
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Clock className="text-gray-400 w-3 h-3" />
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Last practiced: {formatLastPracticed(stats.lastPracticed)}
          </span>
        </div>

        {stats.bestScore >= 80 && (
          <div className="flex items-center gap-1.5 bg-yellow-100 dark:bg-yellow-900/20 px-2 py-1 rounded-full">
            <Trophy className="text-yellow-500 w-3 h-3" fill="currentColor" />
            <span className="text-xs font-black text-yellow-700 dark:text-yellow-300 uppercase tracking-wider">
              Mastered
            </span>
          </div>
        )}
      </div>
    </div>
  );
}