"use client";
import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Trophy, Star, Medal, Award, Flame, Zap, Map } from "lucide-react";

// Tab configuration — 3 simple tabs: Global XP, Endless best run, Journey cumulative.
const TABS = [
  {
    id: "global",
    label: "Global",
    icon: Trophy,
    color: "text-yellow-500",
    activeBg: "bg-yellow-400 text-zinc-900",
    description: "Total XP (Journey + Endless)",
    metricKey: "xp",
    metricLabel: "Global XP",
    metricIcon: Star,
  },
  {
    id: "endless",
    label: "Endless",
    icon: Flame,
    color: "text-orange-500",
    activeBg: "bg-orange-500 text-white",
    description: "Best Single Run",
    metricKey: "highestEndlessXP",
    metricLabel: "Best Run XP",
    metricIcon: Flame,
  },
  {
    id: "journey",
    label: "Journey",
    icon: Map,
    color: "text-[#75c32c]",
    activeBg: "bg-[#75c32c] text-white",
    description: "Structured Learning XP",
    metricKey: "journeyXP",
    metricLabel: "Journey XP",
    metricIcon: Zap,
  },
];

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("global");
  const [tabData, setTabData] = useState({}); // cached per tab: { [tabId]: leaderboard[] }
  const [tabUserEntry, setTabUserEntry] = useState({}); // cached per tab: { [tabId]: entry | null }
  const [isLoading, setIsLoading] = useState(true);

  const leaderboardData = tabData[activeTab] || [];
  const currentUserEntry = tabUserEntry[activeTab] ?? null;
  const tabConfig = TABS.find((t) => t.id === activeTab);

  useEffect(() => {
    // Skip if already cached for this tab
    if (tabData[activeTab]) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`/api/leaderboard?tab=${activeTab}`);
        const data = await response.json();
        if (data.success) {
          setTabData((prev) => ({ ...prev, [activeTab]: data.leaderboard }));
          setTabUserEntry((prev) => ({ ...prev, [activeTab]: data.currentUserEntry || null }));
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, [activeTab]);

  const currentUserIndex = useMemo(
    () => leaderboardData.findIndex((p) => p.isCurrentUser),
    [leaderboardData]
  );

  const nearbyRows = useMemo(() => {
    if (!currentUserEntry) return [];
    const rank = currentUserEntry.rank;
    return leaderboardData
      .filter((p) => Math.abs(p.rank - rank) <= 2)
      .slice(0, 5);
  }, [currentUserEntry, leaderboardData]);

  // Get the primary metric value for a player in the current tab
  const getPrimaryMetric = (player) => {
    const key = tabConfig?.metricKey;
    return player[key] ?? 0;
  };

  if (isLoading && !tabData[activeTab]) {
    return (
      <div className="w-full max-w-4xl mx-auto animate-pulse space-y-4">
        <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded-[2.5rem] border-[4px] border-zinc-300" />
      </div>
    );
  }

  const medalColors = ["text-yellow-400", "text-zinc-300", "text-orange-400"];
  const MetricIcon = tabConfig?.metricIcon || Star;

  const PlayerRow = ({ player, i, variant = "default" }) => {
    const isTop3 = i < 3;
    const isHero = variant === "hero";
    const isYou = player.isCurrentUser;
    const primaryMetric = getPrimaryMetric(player);

    return (
      <div
        className={`relative flex items-center justify-between p-4 border-2 rounded-2xl transition-all ${
          isHero
            ? "bg-[#75c32c] text-white border-zinc-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            : isYou
            ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500 shadow-[4px_4px_0px_0px_rgba(59,130,246,0.4)]"
            : "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-900"
        }`}
      >
        {isYou && !isHero && (
          <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full">
            YOU
          </span>
        )}

        <div className="flex items-center gap-4">
          <div className="w-8 flex justify-center">
            {isTop3 && i !== undefined && i < 3 ? (
              <Medal
                className={isHero ? "text-white" : medalColors[i]}
                size={28}
                fill="currentColor"
              />
            ) : (
              <span className="text-xl font-black italic opacity-30">
                #{player.rank}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <span className="font-black uppercase italic tracking-tight leading-none text-lg">
              {player.name}
            </span>

            <div className="flex items-center gap-1 mt-1 flex-wrap">
              {/* Current rank badge */}
              <span
                className={`text-[8px] font-black px-2 py-0.5 rounded-md border-2 border-zinc-900/10 uppercase italic ${
                  isHero ? "bg-white/20 text-white" : "text-white"
                }`}
                style={!isHero ? { backgroundColor: player.currentRank?.rankColor || "#75c32c" } : {}}
              >
                {player.currentRank?.rankName || "Infant"}
              </span>

              {/* Words solved count */}
              <span
                className={`flex items-center gap-1 text-[8px] font-black px-2 py-0.5 rounded-md border-2 border-zinc-900/10 uppercase italic ${
                  isHero
                    ? "bg-white/20 text-white"
                    : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
                }`}
              >
                <Award size={8} /> {player.totalWordsSolved || 0} Words
              </span>

              {/* Secondary metrics: show mode-specific XP on Global tab */}
              {activeTab === "global" && player.endlessXP > 0 && (
                <span className="flex items-center gap-1 text-[8px] font-black px-2 py-0.5 rounded-md border-2 border-orange-200 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 uppercase italic">
                  <Flame size={8} /> {player.endlessXP.toLocaleString()} Endless
                </span>
              )}
              {activeTab === "global" && player.journeyXP > 0 && (
                <span className="flex items-center gap-1 text-[8px] font-black px-2 py-0.5 rounded-md border-2 border-green-200 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 uppercase italic">
                  <Zap size={8} /> {player.journeyXP.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Primary metric display */}
        <div className="text-right">
          <div className="flex items-center justify-end gap-1">
            <MetricIcon
              size={14}
              fill={activeTab !== "journey" ? "currentColor" : "none"}
              className={isHero ? "text-white" : activeTab === "endless" ? "text-orange-500" : activeTab === "journey" ? "text-[#75c32c]" : "text-yellow-500"}
            />
            <span className="text-2xl font-black italic tracking-tighter leading-none">
              {primaryMetric.toLocaleString()}
            </span>
          </div>
          <span className="text-[9px] font-black uppercase opacity-60">
            {tabConfig?.metricLabel}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter flex items-center justify-center gap-3 mb-2">
          <Trophy className="text-yellow-500 w-10 h-10" />
          Leaderboard
        </h1>
        <p className="text-lg font-bold uppercase tracking-widest opacity-70">
          Top WordPapa Champions
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-2xl border-2 border-zinc-900">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center py-2.5 px-2 rounded-xl font-black uppercase italic text-sm transition-all border-2 ${
                isActive
                  ? `${tab.activeBg} border-zinc-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`
                  : "border-transparent hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              <Icon size={16} className={isActive ? "" : tab.color} />
              <span className="text-[10px] mt-0.5 leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab description */}
      <div className="text-center">
        <p className="text-[11px] font-bold uppercase tracking-widest opacity-50">
          {tabConfig?.description}
        </p>
      </div>

      {/* YOUR RANK CARD */}
      {currentUserEntry && (
        <div className="p-5 bg-blue-50 dark:bg-blue-950/30 border-[3px] border-blue-500 rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(59,130,246,0.35)]">
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-3">
            Your Standing
          </p>
          <PlayerRow player={currentUserEntry} i={currentUserEntry.rank - 1} variant="you" />
          {nearbyRows.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2">
                Players around you
              </p>
              {nearbyRows.map((p) => (
                <PlayerRow key={p.rank} player={p} i={p.rank - 1} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main leaderboard card */}
      <div className="p-4 md:p-8 bg-white dark:bg-zinc-900 border-[4px] border-zinc-900 rounded-[2.5rem] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter flex items-center justify-center gap-3">
            <Award className="text-[#75c32c] w-8 h-8" />
            Hall of Fame
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mt-1">
            {tabConfig?.description}
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboardData && leaderboardData.length > 0 ? (
              leaderboardData.map((player, i) => (
                <PlayerRow
                  key={i}
                  player={player}
                  i={i}
                  variant={i === 0 ? "hero" : "default"}
                />
              ))
            ) : (
              <div className="py-20 text-center">
                <div className="opacity-10 mb-2 flex justify-center">
                  <Trophy size={48} />
                </div>
                <p className="opacity-30 font-black uppercase italic">
                  No champions yet... start practicing!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}