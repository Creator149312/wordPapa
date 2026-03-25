"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, CheckCircle, Target, Book, Trophy, Wrench } from "lucide-react";

const MissionModal = ({ mission, onClose, onComplete, isGuest = false }) => {
  const [isCompleting, setIsCompleting] = useState(false);

  if (!mission) return null;

  const { requirements, progress } = mission;

  const missionDetails = {
    1: {
      title: "First Words",
      description: "Learn your first 5 words in the dictionary and find their synonyms.",
      labActions: 5,
      synonymsLearned: 3,
      arenaWins: 0,
      toolsUsed: ["dictionary", "thesaurus"]
    },
    2: {
      title: "Word Explorer",
      description: "Explore adjectives and find rhyming words.",
      labActions: 8,
      synonymsLearned: 5,
      arenaWins: 1,
      toolsUsed: ["adjectives", "rhyming"]
    },
    3: {
      title: "Vocabulary Builder",
      description: "Build your vocabulary with nouns and syllables.",
      labActions: 10,
      synonymsLearned: 7,
      arenaWins: 2,
      toolsUsed: ["nouns", "syllables"]
    },
    4: {
      title: "Sentence Master",
      description: "Master sentence construction and word unscrambling.",
      labActions: 12,
      synonymsLearned: 8,
      arenaWins: 3,
      toolsUsed: ["word-finder", "sentences"]
    },
    5: {
      title: "Language Warrior",
      description: "Dissect 3 words in the Lab, learn their synonyms, and defeat them in the Arena.",
      labActions: 15,
      synonymsLearned: 10,
      arenaWins: 5,
      toolsUsed: ["dictionary", "thesaurus", "arena"]
    }
  };

  const currentMission = missionDetails[mission.nodeId] || missionDetails[1];

  const isComplete = () => {
    return (
      progress.labActions >= requirements.labActions &&
      progress.synonymsLearned >= requirements.synonymsLearned &&
      progress.arenaWins >= requirements.arenaWins &&
      requirements.toolsUsed.every(tool => progress.toolsUsed.includes(tool))
    );
  };

  const handleCompleteMission = async () => {
    if (isGuest) {
      // For guest users, just call onComplete (handled in parent component)
      onComplete();
      return;
    }

    setIsCompleting(true);
    try {
      // API call to complete mission for logged-in users
      const response = await fetch('/api/journey/complete-mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missionId: mission.nodeId })
      });

      if (response.ok) {
        onComplete();
      }
    } catch (error) {
      console.error('Error completing mission:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                Mission {mission.nodeId}: {currentMission.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {currentMission.description}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress Requirements */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Mission Requirements</h3>

            {/* Lab Actions */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 min-w-[120px]">
                <Book className="w-5 h-5 text-[#75c32c]" />
                <span className="text-sm font-medium">Lab Actions</span>
              </div>
              <div className="flex-1">
                <Progress
                  value={(progress.labActions / requirements.labActions) * 100}
                  className="h-3"
                />
              </div>
              <span className="text-sm font-bold min-w-[60px] text-right">
                {progress.labActions}/{requirements.labActions}
              </span>
            </div>

            {/* Synonyms Learned */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 min-w-[120px]">
                <Target className="w-5 h-5 text-[#75c32c]" />
                <span className="text-sm font-medium">Synonyms</span>
              </div>
              <div className="flex-1">
                <Progress
                  value={(progress.synonymsLearned / requirements.synonymsLearned) * 100}
                  className="h-3"
                />
              </div>
              <span className="text-sm font-bold min-w-[60px] text-right">
                {progress.synonymsLearned}/{requirements.synonymsLearned}
              </span>
            </div>

            {/* Arena Wins */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 min-w-[120px]">
                <Trophy className="w-5 h-5 text-[#75c32c]" />
                <span className="text-sm font-medium">Arena Wins</span>
              </div>
              <div className="flex-1">
                <Progress
                  value={(progress.arenaWins / requirements.arenaWins) * 100}
                  className="h-3"
                />
              </div>
              <span className="text-sm font-bold min-w-[60px] text-right">
                {progress.arenaWins}/{requirements.arenaWins}
              </span>
            </div>

            {/* Tools Used */}
            <div className="flex items-start gap-4">
              <div className="flex items-center gap-2 min-w-[120px]">
                <Wrench className="w-5 h-5 text-[#75c32c]" />
                <span className="text-sm font-medium">Tools Used</span>
              </div>
              <div className="flex-1 flex flex-wrap gap-2">
                {requirements.toolsUsed.map((tool) => (
                  <div
                    key={tool}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      progress.toolsUsed.includes(tool)
                        ? 'bg-[#75c32c] text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {progress.toolsUsed.includes(tool) && <CheckCircle className="w-3 h-3 inline mr-1" />}
                    {tool}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            {isComplete() && (
              <div className="flex-1 space-y-2">
                <Button
                  onClick={handleCompleteMission}
                  disabled={isCompleting}
                  className="w-full bg-[#75c32c] hover:bg-[#75c32c]/90"
                >
                  {isCompleting ? "Completing..." : "Complete Mission"}
                </Button>
                {isGuest && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 text-center">
                    💡 Login to save your progress permanently!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MissionModal;