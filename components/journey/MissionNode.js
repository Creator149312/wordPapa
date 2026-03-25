"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Lock, CheckCircle, Play, Star, Target, Zap } from "lucide-react";

const MissionNode = ({ node, isCompleted, isCurrent, isActive, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Mission details for rich tooltips
  const missionDetails = {
    1: { title: "First Words", objectives: ["Learn 5 words", "Find synonyms", "Build foundations"] },
    2: { title: "Word Explorer", objectives: ["Practice adjectives", "Explore rhymes", "Win 1 game"] },
    3: { title: "Vocabulary Builder", objectives: ["Learn nouns", "Study syllables", "Win 2 games"] },
    4: { title: "Sentence Master", objectives: ["Master sentences", "Unscramble words", "Win 3 games"] },
    5: { title: "Language Warrior", objectives: ["Dissect words", "Master synonyms", "Win challenges"] }
  };

  const missions = missionDetails[node.id] || { title: node.name, objectives: [] };

  const getNodeColor = () => {
    if (isCompleted) return "bg-yellow-400 border-yellow-600 shadow-yellow-200";
    if (isCurrent) return "bg-[#75c32c] border-white shadow-[#75c32c]";
    if (isActive) return "bg-blue-400 border-blue-600 shadow-blue-200";
    return "bg-gray-300 border-gray-400";
  };

  const getNodeIcon = () => {
    if (isCompleted) return <CheckCircle className="w-4 h-4 text-yellow-800" />;
    if (isCurrent) return <Star className="w-4 h-4 text-white animate-pulse" />;
    if (isActive) return <Play className="w-4 h-4 text-blue-800" />;
    return <Lock className="w-4 h-4 text-gray-600" />;
  };

  return (
    <div
      className="absolute cursor-pointer group"
      style={{
        left: `${node.position.x}%`,
        top: `${node.position.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Node Circle */}
      <div
        className={`
          w-8 h-8 rounded-full border-2 shadow-lg transition-all duration-300
          ${getNodeColor()}
          ${isCurrent ? 'animate-pulse scale-110' : ''}
          ${isHovered ? 'scale-125' : ''}
          group-hover:scale-125
        `}
      >
        <div className="w-full h-full flex items-center justify-center">
          {getNodeIcon()}
        </div>
      </div>

      {/* Tooltip */}
      {(isHovered || isCurrent) && (
        <Card className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-4 bg-white dark:bg-gray-800 shadow-xl border-2 border-[#75c32c]/20 z-30 min-w-[240px]">
          <div className="text-center">
            <h4 className="font-black text-sm text-gray-900 dark:text-white mb-1">
              Node {node.id}: {missions.title}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              {node.description}
            </p>
            
            {/* Mission Objectives */}
            {missions.objectives.length > 0 && (
              <div className="text-left mb-3 p-2 bg-[#75c32c]/5 rounded">
                <p className="text-xs font-bold text-[#75c32c] mb-2 flex items-center gap-1">
                  <Target className="w-3 h-3" /> Objectives
                </p>
                <ul className="space-y-1">
                  {missions.objectives.map((obj, idx) => (
                    <li key={idx} className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2">
                      <span className="text-[#75c32c] flex-shrink-0">✓</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {isCurrent && (
              <div className="mt-2 px-2 py-1 bg-[#75c32c] text-white text-xs rounded-full font-bold">
                CURRENT MISSION
              </div>
            )}
            {isCompleted && (
              <div className="mt-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs rounded-full font-bold">
                COMPLETED ✓
              </div>
            )}
            
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
              Click to view details
            </div>
          </div>

          {/* Arrow pointer */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-gray-800"></div>
        </Card>
      )}
    </div>
  );
};

export default MissionNode;