"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Eye, Lock, Sparkles, Trophy } from "lucide-react";
import { ARENAS } from "../constants";

const RANK_THEME = {
  1: {
    gradient: "from-lime-300 to-emerald-400",
    arena: "from-lime-50 via-emerald-50 to-white dark:from-lime-950/40 dark:via-emerald-950/30 dark:to-zinc-950",
    badge: "bg-lime-500",
    terrain: ["🌱", "☁️", "🪨"],
  },
  2: {
    gradient: "from-emerald-300 to-teal-400",
    arena: "from-emerald-50 via-teal-50 to-white dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-zinc-950",
    badge: "bg-emerald-500",
    terrain: ["🌿", "🐝", "🌤️"],
  },
  3: {
    gradient: "from-sky-300 to-cyan-400",
    arena: "from-sky-50 via-cyan-50 to-white dark:from-sky-950/40 dark:via-cyan-950/30 dark:to-zinc-950",
    badge: "bg-sky-500",
    terrain: ["🌲", "📘", "🕊️"],
  },
  4: {
    gradient: "from-blue-300 to-indigo-400",
    arena: "from-blue-50 via-indigo-50 to-white dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-zinc-950",
    badge: "bg-blue-500",
    terrain: ["⛰️", "🛤️", "📚"],
  },
  5: {
    gradient: "from-violet-300 to-fuchsia-400",
    arena: "from-violet-50 via-fuchsia-50 to-white dark:from-violet-950/40 dark:via-fuchsia-950/30 dark:to-zinc-950",
    badge: "bg-violet-500",
    terrain: ["✨", "🔮", "🪔"],
  },
  6: {
    gradient: "from-purple-300 to-pink-400",
    arena: "from-purple-50 via-pink-50 to-white dark:from-purple-950/40 dark:via-pink-950/30 dark:to-zinc-950",
    badge: "bg-purple-500",
    terrain: ["🌌", "⚗️", "🧭"],
  },
  7: {
    gradient: "from-rose-300 to-orange-400",
    arena: "from-rose-50 via-orange-50 to-white dark:from-rose-950/40 dark:via-orange-950/30 dark:to-zinc-950",
    badge: "bg-rose-500",
    terrain: ["🏛️", "🔥", "🦅"],
  },
  8: {
    gradient: "from-amber-300 to-yellow-400",
    arena: "from-amber-50 via-yellow-50 to-white dark:from-amber-950/40 dark:via-yellow-950/30 dark:to-zinc-950",
    badge: "bg-amber-500",
    terrain: ["👑", "✦", "🌞"],
  },
};

export default function JourneyNodeSelector({
  profile,
  onSelectNode,
  onCancel,
  isLoading = false,
}) {
  const [rankNodes, setRankNodes] = useState({});
  const [loadingRanks, setLoadingRanks] = useState({});
  const [loadedRanks, setLoadedRanks] = useState([1]);
  const [selectedNode, setSelectedNode] = useState(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchNodesForRank = async (rank) => {
      if (rankNodes[rank] || loadingRanks[rank]) return;

      setLoadingRanks((prev) => ({ ...prev, [rank]: true }));
      try {
        const response = await fetch(`/api/journey/nodes?rank=${rank}`);
        const data = await response.json();
        if (data.success) {
          setRankNodes((prev) => ({ ...prev, [rank]: data.nodes || [] }));
          const preferredNode =
            (data.nodes || []).find((node) => node.isCurrent) ||
            (data.nodes || []).find((node) => node.isUnlocked) ||
            (data.nodes || [])[0] ||
            null;
          if (preferredNode && !selectedNode) {
            setSelectedNode(preferredNode);
          }
        }
      } catch (error) {
        console.error("Failed to fetch nodes:", error);
      } finally {
        setLoadingRanks((prev) => ({ ...prev, [rank]: false }));
      }
    };

    loadedRanks.forEach((rank) => {
      fetchNodesForRank(rank);
    });
  }, [loadedRanks, loadingRanks, rankNodes, selectedNode]);

  const loadNextRank = () => {
    setLoadedRanks((prev) => {
      const lastLoaded = prev[prev.length - 1] || 1;
      if (lastLoaded >= 8) return prev;
      const nextRank = lastLoaded + 1;
      if (prev.includes(nextRank)) return prev;
      return [...prev, nextRank];
    });
  };

  useEffect(() => {
    const element = scrollContainerRef.current;
    if (!element) return;

    const shouldLoadMore =
      element.scrollHeight <= element.clientHeight + 40 &&
      loadedRanks[loadedRanks.length - 1] < 8;

    if (shouldLoadMore) {
      const timer = setTimeout(() => loadNextRank(), 50);
      return () => clearTimeout(timer);
    }
  }, [loadedRanks, rankNodes]);

  const continuousNodes = useMemo(
    () =>
      loadedRanks.flatMap((rank) =>
        (rankNodes[rank] || []).map((node) => ({ ...node, rankId: rank })),
      ),
    [loadedRanks, rankNodes],
  );

  const rankSections = useMemo(
    () =>
      loadedRanks.map((rank) => ({
        rank,
        nodes: (rankNodes[rank] || []).map((node) => ({ ...node, rankId: rank })),
      })),
    [loadedRanks, rankNodes],
  );

  const activeNode =
    selectedNode ||
    continuousNodes.find((node) => node.isCurrent) ||
    continuousNodes.find((node) => node.isUnlocked) ||
    continuousNodes[0] ||
    null;

  const nextTargetNode = continuousNodes.find(
    (node) => node.isUnlocked && !node.isCompleted,
  );

  const handleScroll = (event) => {
    const element = event.currentTarget;
    const distanceToBottom = element.scrollHeight - element.scrollTop - element.clientHeight;
    if (distanceToBottom < 220) {
      loadNextRank();
    }
  };

  const handleNodeTap = (node) => {
    if (node.isUnlocked && !isLoading) {
      onSelectNode({ nodeId: node.nodeId, rankId: node.rankId });
    } else {
      setSelectedNode(node);
    }
  };

  const handlePracticeSelected = () => {
    if (!activeNode || !activeNode.isUnlocked || isLoading) return;
    onSelectNode({ nodeId: activeNode.nodeId, rankId: activeNode.rankId });
  };

  return (
    <div className="fixed inset-0 bg-black/55 dark:bg-black/75 flex items-center justify-center z-[110] p-3 md:p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] max-w-3xl w-full h-[88vh] shadow-2xl border border-white/20 overflow-hidden flex flex-col">
        <div className="shrink-0 px-4 md:px-6 pt-4 md:pt-5 pb-3 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-[#75c32c]/15 via-cyan-50 to-white dark:from-[#75c32c]/10 dark:via-zinc-800 dark:to-zinc-900">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-zinc-800/80 border border-[#75c32c]/20 mb-2">
                <Sparkles size={13} className="text-[#75c32c]" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#75c32c]">
                  Journey Map
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white leading-tight">
                Follow The Winding Path
              </h2>
              <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-xl">
                Browse the path, inspect locked stops, and practice the selected unlocked node.
              </p>
            </div>

            <button
              onClick={onCancel}
              className="shrink-0 px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-black text-xs uppercase tracking-wider"
            >
              Back
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-3 md:px-6 py-4"
        >
          {continuousNodes.length === 0 && loadingRanks[1] ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#75c32c]" />
            </div>
          ) : (
            <div className="space-y-5 pb-6">
              {rankSections.map(({ rank, nodes }) => {
                const theme = RANK_THEME[rank] || RANK_THEME[1];

                return (
                  <section
                    key={rank}
                    className={`relative overflow-hidden rounded-[2rem] border-[3px] border-zinc-900 bg-gradient-to-br ${theme.arena} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 md:p-5`}
                  >
                    <div className="absolute left-4 top-4 text-lg opacity-70 pointer-events-none">{theme.terrain[0]}</div>
                    <div className="absolute right-4 bottom-4 text-lg opacity-70 pointer-events-none">{theme.terrain[1]}</div>
                    <div className="absolute right-10 top-10 text-base opacity-50 pointer-events-none hidden md:block">{theme.terrain[2]}</div>

                    <div className="flex items-center justify-between gap-3 mb-4 md:mb-5 relative z-10">
                      <div>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${theme.badge} text-white text-[10px] font-black uppercase tracking-[0.22em] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-2`}>
                          Arena {rank}
                        </div>
                        <h3 className="text-lg md:text-xl font-black text-zinc-900 dark:text-white leading-none">
                          {ARENAS[rank]?.name || `Arena ${rank}`}
                        </h3>
                        {ARENAS[rank]?.description && (
                          <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 mt-0.5">
                            {ARENAS[rank].description}
                          </p>
                        )}
                      </div>
                      <div className="px-3 py-2 rounded-2xl bg-white/90 dark:bg-zinc-900/85 border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-zinc-400 mb-1">
                          Route
                        </p>
                        <p className="text-sm font-black text-zinc-900 dark:text-white">
                          {nodes.filter((node) => node.isCompleted).length}/5 cleared
                        </p>
                      </div>
                    </div>

                    <div className="relative rounded-[1.75rem] border-[3px] border-zinc-900 bg-white/60 dark:bg-zinc-950/60 p-4 md:p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <div className="absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-5 rounded-full bg-gradient-to-b from-zinc-300 via-zinc-100 to-zinc-300 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800 border-[3px] border-zinc-900" />
                      <div className="absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-[3px] bg-[#75c32c]/40" />

                      <div className="relative z-10 space-y-5">
                        {nodes.map((node, idx) => {
                          const isCurrent = !!node.isCurrent;
                          const isLocked = !node.isUnlocked;
                          const isRankBoss = node.node === 5;
                          const alignsLeft = idx % 2 === 0;
                          const isNextTarget = nextTargetNode?.nodeId === node.nodeId;
                          const progress = node.isCompleted ? 100 : (node.progress || 0);
                          const titlePill = activeNode?.nodeId === node.nodeId ? "ring-4 ring-[#75c32c]/20" : "";

                          return (
                            <div key={node.nodeId} className="relative min-h-[108px] md:min-h-[116px]">
                              <div className={`flex items-center ${alignsLeft ? "justify-start" : "justify-end"}`}>
                                <button
                                  onClick={() => handleNodeTap(node)}
                                  disabled={isLoading}
                                  className={`relative w-[46%] md:w-[40%] min-w-[138px] md:min-w-[230px] rounded-[1.35rem] md:rounded-[1.5rem] border-[3px] border-zinc-900 bg-white/95 dark:bg-zinc-900/95 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] px-3 md:px-4 py-3 text-left transition-all ${titlePill} ${
                                    isLocked ? "bg-zinc-100 dark:bg-zinc-800" : "hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)]"
                                  }`}
                                >
                                  <p className="hidden md:block text-[9px] font-black uppercase tracking-[0.18em] text-zinc-400 mb-1">
                                    Rank {node.rankId} · Node {node.node}
                                  </p>
                                  <h3 className="text-[11px] md:text-sm font-black leading-tight text-zinc-900 dark:text-white line-clamp-2 pr-1 md:pr-2">
                                    {node.title || `Node ${node.node}`}
                                  </h3>
                                  <div className="mt-2.5 md:mt-3 flex items-center gap-2 md:gap-3">
                                    <div className="flex-1 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                                      <div
                                        className={`h-full rounded-full ${isRankBoss ? "bg-orange-500" : "bg-[#75c32c]"}`}
                                        style={{ width: `${progress}%` }}
                                      />
                                    </div>
                                    <span className="text-[9px] md:text-[10px] font-black text-[#75c32c] min-w-[28px] md:min-w-[34px] text-right">
                                      {progress}%
                                    </span>
                                  </div>
                                  <div className="hidden md:flex items-center justify-between mt-2">
                                    <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-500">
                                      {isLocked ? "Locked Preview" : `${node.listCount || 1} lesson${node.listCount === 1 ? "" : "s"}`}
                                    </p>
                                    <span className="text-[10px] font-black uppercase tracking-wide text-zinc-900 dark:text-zinc-100 inline-flex items-center gap-1">
                                      {isLocked ? <><Eye size={10} /> View</> : "Practice"}
                                    </span>
                                  </div>
                                </button>
                              </div>

                              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
                                <div className={`h-[3px] rounded-full ${alignsLeft ? "w-10 md:w-14 mr-14 md:mr-16" : "w-10 md:w-14 ml-14 md:ml-16"} ${
                                  isNextTarget ? "bg-[#75c32c] shadow-[0_0_10px_rgba(117,195,44,0.35)]" : "bg-zinc-900 dark:bg-zinc-100"
                                }`} />
                              </div>

                              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
                                <button
                                  onClick={() => handleNodeTap(node)}
                                  disabled={isLoading}
                                  className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full border-[3px] border-zinc-900 flex items-center justify-center font-black text-sm md:text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform ${isCurrent ? "scale-110 ring-4 ring-[#75c32c]/20" : ""} ${!isLocked ? "active:scale-95" : ""} ${
                                    isLocked
                                      ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"
                                      : isRankBoss
                                        ? "bg-orange-400 text-white"
                                        : `bg-gradient-to-br ${theme.gradient} text-white`
                                  } ${isNextTarget ? "animate-pulse" : ""}`}
                                  aria-label={`${node.title} ${node.isUnlocked ? "select node" : "preview node"}`}
                                >
                                  {isLocked ? <Lock size={18} /> : isRankBoss ? <Trophy size={18} /> : node.node}

                                  {isCurrent && (
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xl animate-bounce-subtle">
                                      {node.rankId <= 2 ? "🌱" : node.rankId <= 4 ? "🎒" : node.rankId <= 6 ? "🧙" : "👑"}
                                    </div>
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                );
              })}

              {loadedRanks[loadedRanks.length - 1] < 8 && (
                <div className="flex justify-center pt-4">
                  <div className="px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
                    {loadingRanks[loadedRanks[loadedRanks.length - 1] + 1]
                      ? "Loading next rank..."
                      : "Scroll for more"}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeNode && (
            <div className="mt-6 rounded-[1.75rem] border-2 border-zinc-900 bg-zinc-50 dark:bg-zinc-950/70 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">
                    Selected Stop
                  </p>
                  <h3 className="text-lg font-black text-zinc-900 dark:text-white leading-tight">
                    {activeNode.title}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    {ARENAS[activeNode.rankId]?.name || `Arena ${activeNode.rankId}`} &middot; Node {activeNode.node} &middot; {activeNode.listCount || 1} lesson{activeNode.listCount === 1 ? "" : "s"}
                  </p>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${activeNode.isUnlocked ? "bg-[#75c32c] text-white" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"}`}>
                  {activeNode.isUnlocked ? (activeNode.isCurrent ? "Current Node" : activeNode.isCompleted ? "Completed Node" : "Unlocked Node") : "Locked Node"}
                </div>
              </div>

              <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden mb-3">
                <div className="h-full rounded-full bg-[#75c32c]" style={{ width: `${activeNode.isCompleted ? 100 : (activeNode.progress || 0)}%` }} />
              </div>

              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {activeNode.isUnlocked
                  ? "Ready to practice this node."
                  : "You can inspect this node, but practice unlocks only when it becomes your active stop on the path."}
              </p>

              {activeNode.listTitles?.length > 0 && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400 mb-2">
                    Contents Preview
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeNode.listTitles.map((title) => (
                      <span
                        key={title}
                        className="px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-[10px] font-bold text-zinc-600 dark:text-zinc-300"
                      >
                        {title}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <style jsx>{`
          .animate-bounce-subtle {
            animation: bounce-subtle 2.2s ease-in-out infinite;
          }
          @keyframes bounce-subtle {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-4px);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
