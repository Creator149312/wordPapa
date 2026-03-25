"use client";

import { useSession } from "next-auth/react";
import WordLists from "@components/WordLists";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  LayoutDashboard,
  Flame,
  Coins,
  Trophy,
  Gamepad2,
  Zap,
} from "lucide-react";
import { useProfile } from "../ProfileContext";
import {
  calculateLevel,
  calculateProgress,
  getNextRank,
} from "../games/hangman/lib/progression";
import GameShop from "../games/hangman/components/GameShop";

export default function Page() {
  const { status, data: session } = useSession();
  const { profile, isLoaded } = useProfile();
  const router = useRouter();

  // Loading State - Wait for both Auth and Profile Data
  if (status === "loading" || !isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="w-12 h-12 border-4 border-[#75c32c]/20 border-t-[#75c32c] rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">
          Syncing Your Progress...
        </p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  // Official Progression Logic
  const currentRank = calculateLevel(profile.xp);
  const nextRank = getNextRank(profile.xp);
  const progressPercent = calculateProgress(profile.xp);
  const xpNeeded = nextRank ? nextRank.minXP - profile.xp : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-500 pb-20">
      {/* Top Header Section */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#75c32c] font-black text-xs uppercase tracking-[0.2em]">
                <LayoutDashboard size={14} />
                Learner Dashboard
              </div>
              <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                Hey,{" "}
                <span className="text-[#75c32c]">
                  {session?.user?.name?.split(" ")[0] || "Learner"}!
                </span>
              </h1>
            </div>

            <div className="flex gap-3">
              <Link
                href="/games/hangman"
                className="inline-flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-6 py-4 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                <Gamepad2 size={20} />
                Play Games
              </Link>
              <Link
                href="./lists/addList"
                className="inline-flex items-center justify-center gap-2 bg-[#75c32c] text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-[#75c32c]/30 hover:bg-[#66aa26] transition-all hover:scale-105 active:scale-95"
              >
                <Plus size={20} strokeWidth={3} />
                New List
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 mt-10">
        {/* GAME PROGRESS SECTION */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6 ml-2">
            <div className="h-6 w-1.5 bg-orange-500 rounded-full" />
            <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 tracking-tight">
              Game Progress
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Level Card */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                      {currentRank.name}
                    </p>
                    <h3 className="text-3xl font-black text-[#75c32c]">
                      Level {currentRank.level}
                    </h3>
                  </div>
                  <Trophy className="text-[#75c32c] w-10 h-10 opacity-20" />
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#75c32c] transition-all duration-1000"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex justify-between mt-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                    {profile.xp} Total XP
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                    {nextRank
                      ? `${xpNeeded} XP to ${nextRank.name}`
                      : "Maximum Rank Achieved"}
                  </p>
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-[#75c32c]/5 rounded-full blur-3xl" />
            </div>

            {/* Stats Grid - High Streak */}
            {/* <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center">
                  <Flame size={24} fill="currentColor" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Best Streak
                  </p>
                  <p className="text-2xl font-black dark:text-white">
                    {profile.highestStreak}
                  </p>
                </div>
              </div>
            </div> */}

            {/* Stats Grid - Papa Points */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-400/10 text-yellow-500 rounded-2xl flex items-center justify-center">
                  <Coins size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Coins
                  </p>
                  <p className="text-2xl font-black dark:text-white">
                    {profile.papaPoints?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Grid - Energy (Added for visibility) */}
            {/* <div className="lg:col-span-4 bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center">
                    <Zap size={20} fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Energy Recovery
                    </p>
                    <p className="text-sm font-bold dark:text-white">
                      {profile.lives} / 10 Lives Available
                    </p>
                  </div>
                </div>
                {profile.lives < 10 && (
                  <span className="text-[10px] font-black text-orange-500 uppercase animate-pulse">
                    Recovering...
                  </span>
                )}
              </div>
            </div> */}
          </div>
        </section>
        {/* <div className="space-y-6">
          <GameShop />
        </div> */}
        {/* COLLECTIONS SECTION */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 ml-2">
            <div className="h-6 w-1.5 bg-[#75c32c] rounded-full" />
            <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 tracking-tight">
              My Collections
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-4 md:p-8 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none">
            <WordLists createdBy={session?.user?.email} />
          </div>
        </div>
      </main>
    </div>
  );
}
