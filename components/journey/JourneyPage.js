"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import JourneyPath from "@/components/journey/JourneyPath";
import MissionModal from "@/components/journey/MissionModal";
import NodeDetail from "@/components/journey/NodeDetail";
import CharacterEvolution from "@/components/journey/CharacterEvolution";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Target, Star, Zap } from "lucide-react";

const JourneyPage = () => {
  const { data: session } = useSession();
  const [journeyData, setJourneyData] = useState(null);
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Map of node IDs to their data
  const nodesData = {
    1: { id: 1, name: "A1 (Basic)", description: "First steps into vocabulary" },
    2: { id: 2, name: "A1 (Basic)", description: "Simple phrases and sentences" },
    3: { id: 3, name: "A2 (Basic)", description: "Understand frequently used expressions" },
    4: { id: 4, name: "A2 (Basic)", description: "Simple interactions and routine tasks" },
    5: { id: 5, name: "B1 (Independent)", description: "Narrate experiences and events" },
    6: { id: 6, name: "B2 (Independent)", description: "Understand complex texts" },
    7: { id: 7, name: "C1 (Proficient)", description: "Express ideas fluently and spontaneously" },
    8: { id: 8, name: "C2 (Proficient)", description: "Mastery of nuanced language" }
  };

  useEffect(() => {
    if (session?.user?.email) {
      fetchJourneyData();
    }
  }, [session]);

  const fetchJourneyData = async () => {
    try {
      const response = await fetch(`/api/journey?email=${session.user.email}`);
      const data = await response.json();
      setJourneyData(data);
    } catch (error) {
      console.error("Error fetching journey data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNodeClick = (nodeId) => {
    setSelectedNodeId(nodeId);
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

  const selectedNode = selectedNodeId ? nodesData[selectedNodeId] : null;
  const isNodeCompleted = selectedNodeId && journeyData.missionsCompleted?.some(m => m.nodeId === selectedNodeId);
  const isNodeCurrent = selectedNodeId === journeyData.currentNode;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#75c32c]/10 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="relative pt-20 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 dark:text-white">
              Your <span className="text-[#75c32c]">Journey</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Watch your Papa character grow from infant to WordPapa as you master the English language!
            </p>
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
                {journeyData.totalMissionsCompleted}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Missions Completed</div>
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
                {journeyData.missionsCompleted?.length || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">XP Earned</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content: Journey Path and Node Details */}
      <div className="relative max-w-7xl mx-auto px-6 pb-20">
        <div className={`grid gap-8 ${selectedNode ? 'lg:grid-cols-3' : ''}`}>
          {/* Journey Path */}
          <div className={selectedNode ? 'lg:col-span-2' : ''}>
            <JourneyPath
              currentNode={journeyData.currentNode}
              characterStage={journeyData.characterStage}
              missionsCompleted={journeyData.missionsCompleted}
              activeMission={journeyData.activeMission}
              selectedNode={selectedNode}
              onNodeClick={(nodeId) => handleNodeClick(nodeId)}
            />
          </div>

          {/* Node Detail Panel */}
          {selectedNode && (
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <NodeDetail
                  node={selectedNode}
                  mission={journeyData.activeMission}
                  onClose={() => setSelectedNodeId(null)}
                  isCompleted={isNodeCompleted}
                  isCurrent={isNodeCurrent}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mission Modal */}
      {showMissionModal && (
        <MissionModal
          mission={journeyData.activeMission}
          onClose={() => setShowMissionModal(false)}
          onComplete={() => {
            fetchJourneyData(); // Refresh data
            setShowMissionModal(false);
          }}
        />
      )}
    </div>
  );
};

export default JourneyPage;