"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, BookOpen, Target, Trophy, Wrench, Star, Zap, CheckCircle } from "lucide-react";

const NodeDetail = ({ node, mission, onClose, isCompleted, isCurrent }) => {
  if (!node) return null;

  const missionContentMap = {
    1: {
      title: "First Words",
      description: "Embark on your journey! Learn your first 5 words in the dictionary and discover their synonyms.",
      longDescription: "This foundational mission introduces you to WordPapa's core features. You'll explore the dictionary to learn basic vocabulary and understand word relationships through synonyms.",
      objectives: [
        "Learn and define 5 new words from the dictionary",
        "Find synonyms for each word",
        "Build strong vocabulary foundations"
      ],
      requirements: {
        labActions: 5,
        synonymsLearned: 3,
        arenaWins: 0,
        toolsUsed: ["dictionary", "thesaurus"]
      },
      rewards: {
        xp: 100,
        character: "Infant Papa",
        unlocks: "Word Explorer Mode"
      }
    },
    2: {
      title: "Word Explorer",
      description: "Expand your horizons! Explore adjectives and discover the world of rhyming words.",
      longDescription: "Now that you've mastered basic vocabulary, it's time to explore different word categories. Dive into adjectives and find words that rhyme!",
      objectives: [
        "Practice with 8 different adjectives",
        "Learn 5 new synonyms",
        "Win 1 game in the Arena",
        "Use adjectives and rhyming tools"
      ],
      requirements: {
        labActions: 8,
        synonymsLearned: 5,
        arenaWins: 1,
        toolsUsed: ["adjectives", "rhyming"]
      },
      rewards: {
        xp: 150,
        character: "Baby Papa",
        unlocks: "Advanced Vocabulary Builder"
      }
    },
    3: {
      title: "Vocabulary Builder",
      description: "Master the art of word building! Learn nouns and understand syllable structures.",
      longDescription: "Build on your growing linguistics knowledge by exploring nouns and understanding how words are constructed through syllables.",
      objectives: [
        "Practice with 10 nouns",
        "Learn 7 new synonyms",
        "Win 2 games in the Arena",
        "Master syllable breakdown"
      ],
      requirements: {
        labActions: 10,
        synonymsLearned: 7,
        arenaWins: 2,
        toolsUsed: ["nouns", "syllables"]
      },
      rewards: {
        xp: 200,
        character: "Toddler Papa",
        unlocks: "Sentence Mastery"
      }
    },
    4: {
      title: "Sentence Master",
      description: "Construct and decode! Master sentence formation and word unscrambling challenges.",
      longDescription: "Progress to intermediate level by learning sentence structure and practicing word unscrambling. These skills are crucial for fluent communication.",
      objectives: [
        "Complete 12 lab actions",
        "Learn 8 new synonyms",
        "Win 3 Arena games",
        "Master word-finder challenges"
      ],
      requirements: {
        labActions: 12,
        synonymsLearned: 8,
        arenaWins: 3,
        toolsUsed: ["word-finder", "sentences"]
      },
      rewards: {
        xp: 250,
        character: "Young Papa",
        unlocks: "Independent User Tools"
      }
    },
    5: {
      title: "Language Warrior",
      description: "Become a warrior of words! Dissect complex words, master synonyms, and dominate in the Arena.",
      longDescription: "You're becoming a true language warrior! This mission combines all your previous learning into comprehensive challenges that test your complete mastery.",
      objectives: [
        "Dissect 3 complex words in the Lab",
        "Learn 10 new synonyms",
        "Win 5 games in the Arena",
        "Use all available tools effectively"
      ],
      requirements: {
        labActions: 15,
        synonymsLearned: 10,
        arenaWins: 5,
        toolsUsed: ["dictionary", "thesaurus", "arena"]
      },
      rewards: {
        xp: 350,
        character: "Adult Papa",
        unlocks: "Expert Level Challenges"
      }
    }
  };

  const missionContent = missionContentMap[node.id] || missionContentMap[1];

  return (
    <Card className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-xl border-2 border-[#75c32c]/20">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-[#75c32c]" />
              <span className="text-sm font-bold text-[#75c32c]">NODE {node.id}</span>
              {isCompleted && (
                <span className="ml-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs rounded-full font-bold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Completed
                </span>
              )}
              {isCurrent && (
                <span className="ml-2 px-2 py-1 bg-[#75c32c] text-white text-xs rounded-full font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Current
                </span>
              )}
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
              {missionContent.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {node.name}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Main Description */}
        <div className="mb-6 p-4 bg-[#75c32c]/5 border-l-4 border-[#75c32c] rounded">
          <p className="text-gray-800 dark:text-gray-200 font-medium mb-2">
            {missionContent.description}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {missionContent.longDescription}
          </p>
        </div>

        {/* Objectives */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-[#75c32c]" />
            <h3 className="font-black text-gray-900 dark:text-white">Mission Objectives</h3>
          </div>
          <ul className="space-y-2 ml-7">
            {missionContent.objectives.map((objective, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-[#75c32c] font-bold mt-0.5">•</span>
                <span className="text-sm">{objective}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Requirements */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-[#75c32c]" />
            <h3 className="font-black text-gray-900 dark:text-white">Requirements</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 ml-7">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-bold">Lab Actions</p>
              <p className="text-xl font-black text-[#75c32c]">{missionContent.requirements.labActions}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-bold">Synonyms</p>
              <p className="text-xl font-black text-[#75c32c]">{missionContent.requirements.synonymsLearned}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-bold">Arena Wins</p>
              <p className="text-xl font-black text-[#75c32c]">{missionContent.requirements.arenaWins}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-bold">Tools</p>
              <p className="text-sm font-bold text-[#75c32c]">{missionContent.requirements.toolsUsed.length}</p>
            </div>
          </div>
        </div>

        {/* Tools Required */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="w-5 h-5 text-[#75c32c]" />
            <h3 className="font-black text-gray-900 dark:text-white">Required Tools</h3>
          </div>
          <div className="flex flex-wrap gap-2 ml-7">
            {missionContent.requirements.toolsUsed.map((tool) => (
              <span
                key={tool}
                className="px-3 py-2 bg-[#75c32c]/10 border border-[#75c32c] text-[#75c32c] rounded-full text-sm font-bold"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Rewards */}
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-5 h-5 text-amber-600" />
            <h3 className="font-black text-amber-900 dark:text-amber-100">Rewards</h3>
          </div>
          <div className="space-y-2 ml-7 text-sm text-amber-900 dark:text-amber-100">
            <p><strong>XP Earned:</strong> +{missionContent.rewards.xp}</p>
            <p><strong>Character Evolution:</strong> {missionContent.rewards.character}</p>
            <p><strong>Unlocks:</strong> {missionContent.rewards.unlocks}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={onClose}
            className="w-full bg-[#75c32c] hover:bg-[#75c32c]/90 text-white font-bold"
          >
            Got it! Let's continue →
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default NodeDetail;
