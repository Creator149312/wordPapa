"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import JourneyPath from "@/components/journey/JourneyPath";
import MissionModal from "@/components/journey/MissionModal";
import CharacterEvolution from "@/components/journey/CharacterEvolution";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RANKS } from "@/app/games/hangman/constants";
import { Trophy, Target, Star, Zap, User, LogIn } from "lucide-react";
import Link from "next/link";

const JourneyPage = () => {
  const { data: session, status } = useSession();
  const [journeyData, setJourneyData] = useState(null);
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    if (status !== 'loading') {
      // If user just logged in and was previously a guest, sync their progress
      if (session?.user?.email && isGuest) {
        syncGuestProgress();
      } else {
        fetchJourneyData();
      }
    }

    // Listen for guest progress updates
    const handleGuestProgressUpdate = (event) => {
      if (isGuest) {
        setJourneyData(event.detail);
      }
    };

    window.addEventListener('guestProgressUpdate', handleGuestProgressUpdate);

    return () => {
      window.removeEventListener('guestProgressUpdate', handleGuestProgressUpdate);
    };
  }, [status, isGuest, session]);

  const fetchJourneyData = async () => {
    try {
      // If user is logged in, get their data from API
      if (session?.user?.email) {
        const response = await fetch(`/api/journey?email=${session.user.email}`);
        const data = await response.json();
        setJourneyData(data);
        setIsGuest(false);
      } else {
        // Guest mode - get data from localStorage
        const guestData = getGuestJourneyData();
        setJourneyData(guestData);
        setIsGuest(true);
      }
    } catch (error) {
      console.error("Error fetching journey data:", error);
      // Fallback to guest data
      const guestData = getGuestJourneyData();
      setJourneyData(guestData);
      setIsGuest(true);
    } finally {
      setLoading(false);
    }
  };

  const getGuestJourneyData = () => {
    // Get guest progress from localStorage
    const stored = localStorage.getItem('wordpapa_guest_journey');
    if (stored) {
      return JSON.parse(stored);
    }

    // Default guest journey data
    const initialRank = getRankFromXP(0);

    return {
      currentNode: 1,
      characterStage: "infant",
      xp: 0,
      rankLevel: initialRank.level,
      rankName: initialRank.name,
      rankArenaId: initialRank.arenaId,
      rankColor: initialRank.color,
      rankStageName: initialRank.stageName,
      missionsCompleted: [],
      activeMission: {
        nodeId: 1,
        missionType: "learning",
        requirements: { labActions: 5, synonymsLearned: 3, arenaWins: 0, toolsUsed: ["dictionary", "thesaurus"] },
        progress: { labActions: 0, synonymsLearned: 0, arenaWins: 0, toolsUsed: [] },
        startedAt: new Date().toISOString()
      },
      totalMissionsCompleted: 0,
      journeyStartDate: new Date().toISOString(),
      lastActivityDate: new Date().toISOString(),
      unlockedFeatures: []
    };
  };

  const updateGuestProgress = (updates) => {
    const currentData = journeyData || getGuestJourneyData();

    let newXP = currentData.xp || 0;
    if (typeof updates.xp === "number") {
      newXP = updates.xp;
    } else if (typeof updates.xpDelta === "number") {
      newXP += updates.xpDelta;
    }

    const rank = getRankFromXP(newXP);

    const newData = {
      ...currentData,
      ...updates,
      xp: newXP,
      rankLevel: rank.level,
      rankName: rank.name,
      rankArenaId: rank.arenaId,
      rankColor: rank.color,
      rankStageName: rank.stageName,
      lastActivityDate: new Date().toISOString(),
    };

    localStorage.setItem('wordpapa_guest_journey', JSON.stringify(newData));
    setJourneyData(newData);

    // dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('guestProgressUpdate', { detail: newData }));
  };

  const syncGuestProgress = async () => {
    const guestData = getGuestJourneyData();

    try {
      const response = await fetch('/api/journey/sync-guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestData })
      });

      if (response.ok) {
        const result = await response.json();
        setJourneyData(result.journey);
        setIsGuest(false);

        // Clear guest data from localStorage
        localStorage.removeItem('wordpapa_guest_journey');

        // Show success message
        alert('Progress synced successfully! Your journey continues.');
      } else {
        console.error('Failed to sync progress');
        // Fall back to regular fetch
        fetchJourneyData();
      }
    } catch (error) {
      console.error('Error syncing progress:', error);
      // Fall back to regular fetch
      fetchJourneyData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#75c32c]/10 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#75c32c] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your journey...</p>
        </div>
      </div>
    );
  }

  if (!journeyData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#75c32c]/10 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-black mb-4">Start Your Journey!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Begin your path to becoming a WordPapa. Complete missions and watch your character grow!
          </p>
          <Button
            onClick={() => fetchJourneyData()}
            className="bg-[#75c32c] hover:bg-[#75c32c]/90"
          >
            Begin Journey
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#75c32c]/10 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="relative pt-20 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 dark:text-white">
                Your <span className="text-[#75c32c]">Journey</span>
              </h1>
              {isGuest && (
                <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                  <User className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Guest Mode</span>
                </div>
              )}
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Watch your Papa character grow from infant to WordPapa as you master the English language!
            </p>

            {isGuest && (
              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800">
                <p className="text-amber-800 dark:text-amber-200 mb-3">
                  💡 <strong>Login to save your progress!</strong> Your journey will be synced across devices.
                </p>
                <Link href="/login">
                  <Button className="bg-[#75c32c] hover:bg-[#75c32c]/90">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login to Sync Progress
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <Trophy className="w-8 h-8 text-[#75c32c] mx-auto mb-2" />
              <div className="text-2xl font-black text-gray-900 dark:text-white">
                {journeyData.currentNode}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Current Node</div>
            </Card>

            <Card className="p-4 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <Target className="w-8 h-8 text-[#75c32c] mx-auto mb-2" />
              <div className="text-2xl font-black text-gray-900 dark:text-white">
                LVL {journeyData.rankLevel || 1}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Current Rank: {journeyData.rankName || 'Infant'}</div>
            </Card>

            <Card className="p-4 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <Star className="w-8 h-8 text-[#75c32c] mx-auto mb-2" />
              <div className="text-2xl font-black text-gray-900 dark:text-white capitalize">
                {journeyData.characterStage.replace('_', ' ')}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Character Stage</div>
            </Card>

            <Card className="p-4 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <Zap className="w-8 h-8 text-[#75c32c] mx-auto mb-2" />
              <div className="text-2xl font-black text-gray-900 dark:text-white">
                {journeyData.xp || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total XP</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Journey Path */}
      <div className="relative">
        <JourneyPath
          currentNode={journeyData.currentNode}
          characterStage={journeyData.characterStage}
          missionsCompleted={journeyData.missionsCompleted}
          activeMission={journeyData.activeMission}
          onNodeClick={(nodeId) => {
            setShowMissionModal(true);
          }}
          isGuest={isGuest}
          onProgressUpdate={updateGuestProgress}
        />
      </div>

      {/* Mission Modal */}
      {showMissionModal && (
        <MissionModal
          mission={journeyData.activeMission}
          onClose={() => setShowMissionModal(false)}
          onComplete={async () => {
            if (isGuest) {
              // Handle guest mission completion
              const newNode = Math.min(journeyData.currentNode + 1, 10);
              const missionRequirements = getMissionRequirements(newNode);
              const xpEarned = calculateXP(journeyData.activeMission);

              updateGuestProgress({
                currentNode: newNode,
                characterStage: getCharacterStage(newNode),
                totalMissionsCompleted: journeyData.totalMissionsCompleted + 1,
                xpDelta: xpEarned,
                missionsCompleted: [
                  ...(journeyData.missionsCompleted || []),
                  {
                    nodeId: journeyData.activeMission.nodeId,
                    missionType: journeyData.activeMission.missionType,
                    completedAt: new Date().toISOString(),
                    xpEarned,
                  }
                ],
                activeMission: newNode < 10 ? {
                  nodeId: newNode,
                  missionType: "learning",
                  requirements: missionRequirements,
                  progress: { labActions: 0, synonymsLearned: 0, arenaWins: 0, toolsUsed: [] },
                  startedAt: new Date().toISOString()
                } : null
              });
            } else {
              // Handle logged-in user mission completion
              const response = await fetch('/api/journey/complete-mission', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ missionId: journeyData.activeMission.nodeId }),
              });

              if (response.ok) {
                await fetchJourneyData();
              } else {
                const result = await response.json();
                alert(result.error || 'Could not complete mission.');
              }
            }

            setShowMissionModal(false);
          }}
          isGuest={isGuest}
        />
      )}
    </div>
  );
};

// Helper functions for guest mode
function getMissionRequirements(nodeId) {
  const requirements = {
    1: { labActions: 5, synonymsLearned: 3, arenaWins: 0, toolsUsed: ["dictionary", "thesaurus"] },
    2: { labActions: 8, synonymsLearned: 5, arenaWins: 1, toolsUsed: ["adjectives", "rhyming"] },
    3: { labActions: 10, synonymsLearned: 7, arenaWins: 2, toolsUsed: ["nouns", "syllables"] },
    4: { labActions: 12, synonymsLearned: 8, arenaWins: 3, toolsUsed: ["word-finder", "sentences"] },
    5: { labActions: 15, synonymsLearned: 10, arenaWins: 5, toolsUsed: ["dictionary", "thesaurus", "arena"] },
    6: { labActions: 18, synonymsLearned: 12, arenaWins: 7, toolsUsed: ["dictionary", "thesaurus", "arena", "phrasal-verbs"] },
    7: { labActions: 20, synonymsLearned: 15, arenaWins: 8, toolsUsed: ["dictionary", "thesaurus", "arena", "all-tools"] },
    8: { labActions: 22, synonymsLearned: 18, arenaWins: 10, toolsUsed: ["dictionary", "thesaurus", "arena", "all-tools"] },
    9: { labActions: 25, synonymsLearned: 20, arenaWins: 12, toolsUsed: ["dictionary", "thesaurus", "arena", "all-tools"] },
    10: { labActions: 30, synonymsLearned: 25, arenaWins: 15, toolsUsed: ["dictionary", "thesaurus", "arena", "all-tools"] }
  };

  return requirements[nodeId] || requirements[1];
}

function getCharacterStage(node) {
  if (node <= 2) return "A1 (Basic)";
  if (node <= 4) return "A2 (Basic)";
  if (node === 5) return "B1 (Independent)";
  if (node === 6) return "B2 (Independent)";
  if (node === 7) return "C1 (Proficient)";
  return "C2 (Proficient)";
}

function getRankFromXP(xp) {
  const currentXP = Math.max(0, xp || 0);
  const sortedRanks = [...RANKS].sort((a, b) => b.minXP - a.minXP);
  return sortedRanks.find((rank) => currentXP >= rank.minXP) || RANKS[0];
}

function calculateXP(mission) {
  const baseXP = 100;
  const labBonus = mission.progress.labActions * 10;
  const synonymBonus = mission.progress.synonymsLearned * 15;
  const arenaBonus = mission.progress.arenaWins * 25;
  const toolBonus = mission.progress.toolsUsed.length * 20;

  return baseXP + labBonus + synonymBonus + arenaBonus + toolBonus;
}

export default JourneyPage;