"use client";

import { useState } from "react";
import CharacterEvolution from "./CharacterEvolution";
import MissionNode from "./MissionNode";
import { Card } from "@/components/ui/card";

const JourneyPath = ({
  currentNode,
  characterStage,
  missionsCompleted,
  activeMission,
  onNodeClick,
  selectedNode,
  isGuest = false,
  onProgressUpdate
}) => {
  // Define the 10 nodes of the journey
  const nodes = [
    { id: 1, name: "A1 (Basic)", description: "First steps into vocabulary", position: { x: 10, y: 20 } },
    { id: 2, name: "A1 (Basic)", description: "Simple phrases and sentences", position: { x: 25, y: 35 } },
    { id: 3, name: "A2 (Basic)", description: "Understand frequently used expressions", position: { x: 40, y: 25 } },
    { id: 4, name: "A2 (Basic)", description: "Simple interactions and routine tasks", position: { x: 55, y: 40 } },
    { id: 5, name: "B1 (Independent)", description: "Narrate experiences and events", position: { x: 70, y: 30 } },
    { id: 6, name: "B2 (Independent)", description: "Understand complex texts", position: { x: 15, y: 60 } },
    { id: 7, name: "C1 (Proficient)", description: "Express ideas fluently and spontaneously", position: { x: 35, y: 70 } },
    { id: 8, name: "C2 (Proficient)", description: "Mastery of nuanced language", position: { x: 60, y: 65 } }
  ];

  // Path coordinates for the winding road (simplified SVG path)
  const pathData = "M 10 20 Q 25 15 40 25 T 70 30 Q 85 35 15 60 T 35 70 Q 50 75 60 65 T 80 75 Q 90 80 50 85";

  return (
    <div className="relative w-full max-w-6xl mx-auto px-6 pb-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#75c32c]/5 rounded-3xl"></div>

      {/* SVG Path Container */}
      <div className="relative aspect-[16/10] w-full">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full absolute inset-0"
          style={{ filter: 'drop-shadow(0 4px 6px rgba(117, 195, 44, 0.1))' }}
        >
          {/* Background path for depth */}
          <path
            d={pathData}
            stroke="#75c32c"
            strokeWidth="8"
            fill="none"
            opacity="0.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Main path */}
          <path
            d={pathData}
            stroke="#75c32c"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-sm"
          />

          {/* Path highlights */}
          <path
            d={pathData}
            stroke="white"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.8"
          />
        </svg>

        {/* Nodes */}
        {nodes.map((node) => {
          const isCompleted = missionsCompleted?.some(m => m.nodeId === node.id);
          const isCurrent = node.id === currentNode;
          const isActive = activeMission?.nodeId === node.id;

          return (
            <MissionNode
              key={node.id}
              node={node}
              isCompleted={isCompleted}
              isCurrent={isCurrent}
              isActive={isActive}
              onClick={() => onNodeClick(node.id)}
            />
          );
        })}

        {/* Character on current node */}
        {currentNode && (
          <div
            className="absolute z-20 transition-all duration-1000 ease-in-out"
            style={{
              left: `${nodes[currentNode - 1]?.position.x}%`,
              top: `${nodes[currentNode - 1]?.position.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <CharacterEvolution
              stage={characterStage}
              size="large"
              animate={true}
            />
          </div>
        )}
      </div>

      {/* Legend */}
      <Card className="mt-8 p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
        <h3 className="text-lg font-black mb-4 text-center">Journey Legend</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded-full border-2 border-gray-400"></div>
            <span>Locked Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#75c32c] rounded-full border-2 border-white shadow-lg animate-pulse"></div>
            <span>Current Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded-full border-2 border-yellow-600 shadow-lg"></div>
            <span>Completed Node</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default JourneyPath;