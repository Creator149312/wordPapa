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
  BookOpen,
  Target,
  ChevronRight,
  CheckCircle2,
  Shield,
  PartyPopper,
  Map,
  Zap,
} from "lucide-react";
import { useProfile } from "../ProfileContext";
import {
  calculateLevel,
  calculateProgress,
  getNextRank,
} from "../games/hangman/lib/progression";
import { useState, useEffect } from "react";

export default function Page() {
  const { status, data: session } = useSession();
  const { profile, isLoaded } = useProfile();
  const router = useRouter();

  // Fetch practice statistics (includes streak, recent activity, due-for-review).
  // A single API call returns everything the Practice Progress section needs.
  const [practiceStats, setPracticeStats] = useState(null);
  const [practiceLoading, setPracticeLoading] = useState(true);

  // Lightweight journey snapshot — only rank + current-node progress.
  // Reuses the same /api/journey endpoint that the Journey page uses.
  const [journeySnap, setJourneySnap] = useState(null);

  // Lists assigned to the user's current journey node.
  // Fetched reactively after journeySnap resolves so we know rank + node.
  const [nodeLists, setNodeLists] = useState([]);
  const [nodeListsLoading, setNodeListsLoading] = useState(false);

  useEffect(() => {
    if (!session?.user?.email) return;

    // Fire both fetches in parallel Ã¢â‚¬â€ they're independent.
    const fetchPracticeStats = fetch("/api/user/practice-stats")
      .then((r) => r.ok ? r.json() : null)
      .catch(() => null);

    const fetchJourney = fetch("/api/journey")
      .then((r) => r.ok ? r.json() : null)
      .catch(() => null);

    Promise.all([fetchPracticeStats, fetchJourney]).then(([stats, journey]) => {
      if (stats) setPracticeStats(stats);
      if (journey) setJourneySnap(journey);
      setPracticeLoading(false);
    });
  }, [session?.user?.email]);

  // Once journeySnap is available, fetch the lists for the current node.
  useEffect(() => {
    // Prefer the canonical currentNodeId string ("rank-node"), fall back to legacy integer.
    // currentNodeId format: "2-3" → rank=2, node=3
    let rank, nodeInRank;
    if (journeySnap?.currentNodeId && journeySnap.currentNodeId.includes("-")) {
      const parts = journeySnap.currentNodeId.split("-");
      rank = parseInt(parts[0], 10);
      nodeInRank = parseInt(parts[1], 10);
    } else if (journeySnap?.rankLevel && journeySnap?.currentNode) {
      // Legacy fallback: currentNode is a flat integer (1-40)
      rank = journeySnap.rankLevel;
      nodeInRank = ((journeySnap.currentNode - 1) % 5) + 1;
    } else {
      return;
    }
    if (!rank || !nodeInRank) return;
    setNodeListsLoading(true);
    fetch(`/api/journey/node-lists?rank=${rank}&node=${nodeInRank}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.lists) setNodeLists(data.lists);
      })
      .catch(() => {})
      .finally(() => setNodeListsLoading(false));
  }, [journeySnap?.currentNodeId, journeySnap?.rankLevel, journeySnap?.currentNode]);

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

  // Derive streak state from the practice-stats API response.
  // streak = consecutive practice days; lastPracticeDay = "YYYY-MM-DD" string.
  const streak = practiceStats?.streak || 0;
  const lastPracticeDay = practiceStats?.lastPracticeDay || null;
  const todayStr = new Date().toISOString().split("T")[0];
  const practicedToday = lastPracticeDay === todayStr;

  // Streak shields — each shield absorbs one missed day without breaking the streak.
  // Shields are awarded at every 7-day milestone and capped at 2.
  const streakShields = practiceStats?.streakShields || 0;

  // Daily goal: the number of distinct lists the user needs to practice today.
  // DAILY_GOAL is deliberately small (3) so it feels achievable every day.
  const DAILY_GOAL = 3;
  const listsToday = practiceStats?.listsToday || 0;
  const goalProgress = Math.min(listsToday, DAILY_GOAL); // cap display at goal
  const goalComplete = listsToday >= DAILY_GOAL;
  const goalPercent = Math.min(Math.round((goalProgress / DAILY_GOAL) * 100), 100);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-500 pb-20">
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-4">
            {/* Left: greeting + rank badge */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[#75c32c] font-black text-[10px] uppercase tracking-[0.2em] mb-0.5">
                <LayoutDashboard size={12} />
                Dashboard
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight truncate">
                Hey,{" "}
                <span className="text-[#75c32c]">
                  {session?.user?.name?.split(" ")[0] || "Learner"}!
                </span>
              </h1>
              {/* <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 bg-[#75c32c]/10 text-[#75c32c] text-[10px] font-black px-2.5 py-0.5 rounded-xl border border-[#75c32c]/20">
                  <Trophy size={10} />
                  {currentRank.name}
                </span>
                <span className="text-[10px] font-bold text-gray-400 hidden sm:inline">
                  {(profile.xp || 0).toLocaleString()} XP
                </span>
              </div> */}
            </div>

            {/* Right: 2 action buttons */}
            <div className="flex gap-2 sm:gap-3 shrink-0">
              <Link
                href="/games/hangman"
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 sm:px-6 py-2.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-sm sm:text-base"
              >
                <Gamepad2 size={18} />
                <span className="hidden sm:inline">Play Arena</span>
              </Link>
              <Link
                href="./lists/addList"
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-[#75c32c] text-white px-3 sm:px-6 py-2.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold shadow-lg shadow-[#75c32c]/30 hover:bg-[#66aa26] transition-all hover:scale-105 active:scale-95 text-sm sm:text-base"
              >
                <Plus size={18} strokeWidth={3} />
                <span className="hidden sm:inline">New List</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 space-y-8">

        {/* ── SECTION 1: YOUR PROGRESS (Rank + Coins + Streak) ──────── */}
        <section>
          <div className="flex items-center gap-3 mb-5 ml-1">
            <div className="h-5 w-1 bg-[#75c32c] rounded-full" />
            <h2 className="text-lg font-black text-gray-800 dark:text-gray-100 tracking-tight uppercase">
              Your Progress
            </h2>
          </div>

          {/* 3-column row — stacks on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Rank + XP */}
            <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                    Rank
                  </p>
                  <p className="text-xl font-black text-[#75c32c] leading-tight">
                    {currentRank.name}
                  </p>
                  <p className="text-xs font-bold text-gray-400 mt-0.5">
                    Level {currentRank.level} · {(profile.xp || 0).toLocaleString()} XP
                  </p>
                </div>
                <Trophy className="text-[#75c32c] w-8 h-8 opacity-20" />
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#75c32c] transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[10px] font-bold text-gray-400 mt-1.5">
                {nextRank ? `${xpNeeded} XP to ${nextRank.name}` : "Max rank!"}
              </p>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#75c32c]/5 rounded-full blur-2xl" />
            </div>

            {/* Coins */}
            <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-400/10 text-yellow-500 rounded-2xl flex items-center justify-center shrink-0">
                <Coins size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Papa Coins
                </p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">
                  {profile.papaPoints?.toLocaleString() ?? 0}
                </p>
              </div>
            </div>

            {/* Streak */}
            <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  practicedToday ? "bg-orange-500/10 text-orange-500" : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                }`}
              >
                <Flame size={24} fill={practicedToday ? "currentColor" : "none"} className="transition-colors duration-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Daily Streak
                </p>
                <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">
                  {practiceLoading ? "…" : streak}
                  <span className="text-sm font-bold text-gray-400 ml-1">days</span>
                </p>
                <p className={`text-[10px] font-bold mt-0.5 ${practicedToday ? "text-green-500" : streak > 0 ? "text-orange-400" : "text-gray-400"}`}>
                  {practiceLoading ? "" : practicedToday ? "Practiced today ✓" : streak > 0 ? "Practice to keep streak!" : "Start your streak!"}
                </p>
                {!practiceLoading && streakShields > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: streakShields }).map((_, i) => (
                      <div key={i} className="w-5 h-5 bg-blue-500/10 text-blue-500 rounded-md flex items-center justify-center" title="Streak Shield">
                        <Shield size={11} fill="currentColor" />
                      </div>
                    ))}
                    <span className="text-[9px] font-black text-blue-400 uppercase tracking-wide ml-0.5">
                      {streakShields} shield{streakShields > 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: JOURNEY ────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-5 ml-1">
            <div className="h-5 w-1 bg-purple-500 rounded-full" />
            <h2 className="text-lg font-black text-gray-800 dark:text-gray-100 tracking-tight uppercase">
              Journey
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            {/* Journey overall progress bar */}
            <div className="px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Map size={14} className="text-purple-500" />
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {journeySnap
                      ? `${journeySnap.rankName} · Node ${journeySnap.currentNode} of 40`
                      : "Journey Progress"}
                  </p>
                </div>
                <Link href="/games/hangman" className="text-xs font-bold text-purple-500 hover:underline whitespace-nowrap">
                  Open Journey →
                </Link>
              </div>
              <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-1000"
                  style={{
                    width: journeySnap?.currentNode
                      ? `${Math.round(((journeySnap.currentNode - 1) / 40) * 100)}%`
                      : "0%",
                  }}
                />
              </div>
              <p className="text-[10px] font-bold text-gray-400 mt-1">
                {journeySnap?.currentNode
                  ? `${Math.round(((journeySnap.currentNode - 1) / 40) * 100)}% overall complete`
                  : "Start your Journey"}
              </p>
            </div>

            {/* Today's goal progress */}
            <div className={`px-6 py-4 border-b border-gray-100 dark:border-gray-800 ${goalComplete ? "bg-green-50 dark:bg-green-950/20" : ""}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {goalComplete ? <PartyPopper size={14} className="text-green-500" /> : <Target size={14} className="text-[#75c32c]" />}
                  <p className={`text-xs font-bold uppercase tracking-wider ${goalComplete ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}>
                    {goalComplete ? "Daily goal complete!" : `Today's Goal · ${DAILY_GOAL} lists`}
                  </p>
                </div>
                <span className={`text-xs font-black px-3 py-1 rounded-xl ${goalComplete ? "bg-green-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"}`}>
                  {practiceLoading ? "…" : `${goalProgress} / ${DAILY_GOAL}`}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${goalComplete ? "bg-green-500" : "bg-[#75c32c]"}`}
                  style={{ width: practiceLoading ? "0%" : `${goalPercent}%` }}
                />
              </div>
            </div>

            {/* Continue where you left off */}
            {!practiceLoading && practiceStats?.recentActivity?.length > 0 && (() => {
              const last = practiceStats.recentActivity.find((a) => !a.mastered) ?? practiceStats.recentActivity[0];
              const daysSince = last.lastPracticed ? Math.floor((Date.now() - new Date(last.lastPracticed)) / 86400000) : null;
              return (
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                      <BookOpen size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Continue where you left off</p>
                      <p className="text-sm font-black text-gray-900 dark:text-white truncate">{last.title}</p>
                      <p className="text-[10px] font-bold text-gray-400">
                        Best: {last.bestScore}%
                        {daysSince !== null && ` · ${daysSince === 0 ? "Today" : daysSince === 1 ? "Yesterday" : `${daysSince}d ago`}`}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/lists/${last.listId}`}
                    className="shrink-0 inline-flex items-center gap-1.5 bg-blue-500 text-white px-4 py-2.5 rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                  >
                    Continue <ChevronRight size={14} />
                  </Link>
                </div>
              );
            })()}

            {/* Node lists */}
            <div className="px-6 py-4">
              {nodeListsLoading || practiceLoading ? (
                <div className="flex flex-col gap-2.5">
                  {[1, 2].map((i) => <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
                </div>
              ) : nodeLists.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {nodeLists.map((list) => {
                    const rankProgress = journeySnap?.progress?.find((r) => r.rankId === journeySnap.rankLevel);
                    const nodeInRank = ((journeySnap.currentNode - 1) % 5) + 1;
                    const nodeProgress = rankProgress?.nodes?.find((n) => n.nodeId === nodeInRank);
                    const listProgress = nodeProgress?.lists?.find((l) => l.listId === list.listId?.toString());
                    const pct = listProgress?.percent || 0;
                    const mastered = pct >= 90;
                    return (
                      <Link
                        key={list.listId}
                        href={`/lists/${list.listId}`}
                        className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-[#75c32c]/10 dark:hover:bg-[#75c32c]/10 transition-colors group border border-transparent hover:border-[#75c32c]/20"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {mastered
                            ? <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                            : <Zap size={14} className="text-[#75c32c] shrink-0" />}
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-700 dark:text-gray-200 truncate group-hover:text-[#75c32c] transition-colors">{list.title}</p>
                            <p className="text-[10px] font-bold text-gray-400">{list.wordCount} words</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          {pct > 0 && (
                            <span className={`text-xs font-black px-2.5 py-1 rounded-xl ${mastered ? "bg-green-500/15 text-green-600 dark:text-green-400" : "bg-[#75c32c]/10 text-[#75c32c]"}`}>
                              {pct}%
                            </span>
                          )}
                          <ChevronRight size={14} className="text-gray-300 group-hover:text-[#75c32c] group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-400 font-bold mb-2">No lists assigned to this node yet.</p>
                  <Link href="/lists" className="text-xs font-bold text-[#75c32c] hover:underline">Browse all collections →</Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── SECTION 3: PRACTICE PROGRESS (commented out) ─────────── */}
        {/*
        <section>
          <div className="flex items-center gap-3 mb-5 ml-1">
            <div className="h-5 w-1 bg-blue-500 rounded-full" />
            <h2 className="text-lg font-black text-gray-800 dark:text-gray-100 tracking-tight uppercase">
              Practice Progress
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center">
                <BookOpen size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lists Practiced</p>
                <p className="text-2xl font-black dark:text-white">{practiceLoading ? "…" : (practiceStats?.totalLists || 0)}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center">
                <Target size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Attempts</p>
                <p className="text-2xl font-black dark:text-white">{practiceLoading ? "…" : (practiceStats?.totalAttempts || 0)}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center">
                <Trophy size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lists Mastered</p>
                <p className="text-2xl font-black dark:text-white">{practiceLoading ? "…" : (practiceStats?.masteredLists || 0)}</p>
              </div>
            </div>
          </div>
        </section>
        */}

        {/* ── SECTION 4: MY COLLECTIONS ─────────────────────────────── */}
        <div className="space-y-5 pb-4">
          <div className="flex items-center justify-between gap-3 ml-1">
            <div className="flex items-center gap-3">
              <div className="h-5 w-1 bg-[#75c32c] rounded-full" />
              <h2 className="text-lg font-black text-gray-800 dark:text-gray-100 tracking-tight uppercase">
                My Collections
              </h2>
            </div>
            <Link href="/lists" className="text-sm font-bold text-[#75c32c] hover:underline whitespace-nowrap">
              View All →
            </Link>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 md:p-8 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none">
            <WordLists createdBy={session?.user?.email} limit={9} />
          </div>
        </div>

      </main>
    </div>
  );
}
