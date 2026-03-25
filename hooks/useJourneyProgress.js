"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export const useJourneyProgress = () => {
  const { data: session } = useSession();

  const trackProgress = async (action, data = {}) => {
    // If user is logged in, track via API
    if (session?.user?.email) {
      try {
        const response = await fetch('/api/journey', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update_progress',
            data: { type: action, ...data }
          })
        });

        if (!response.ok) {
          console.error('Failed to track progress:', await response.text());
        }
      } catch (error) {
        console.error('Error tracking progress:', error);
      }
    } else {
      // Guest mode - track in localStorage
      trackGuestProgress(action, data);
    }
  };

  const trackGuestProgress = (action, data = {}) => {
    const stored = localStorage.getItem('wordpapa_guest_journey');
    let journeyData = stored ? JSON.parse(stored) : getDefaultGuestJourney();

    if (!journeyData.activeMission) return;

    // Update progress based on action
    switch (action) {
      case 'lab_action':
        journeyData.activeMission.progress.labActions += 1;
        break;
      case 'synonym_learned':
        journeyData.activeMission.progress.synonymsLearned += 1;
        break;
      case 'arena_win':
        journeyData.activeMission.progress.arenaWins += 1;
        break;
      case 'tool_used':
        if (data.tool && !journeyData.activeMission.progress.toolsUsed.includes(data.tool)) {
          journeyData.activeMission.progress.toolsUsed.push(data.tool);
        }
        break;
    }

    journeyData.lastActivityDate = new Date().toISOString();
    localStorage.setItem('wordpapa_guest_journey', JSON.stringify(journeyData));

    // Dispatch custom event to notify journey page of updates
    window.dispatchEvent(new CustomEvent('guestProgressUpdate', { detail: journeyData }));
  };

  // Track lab actions (dictionary lookups, etc.)
  const trackLabAction = (tool) => {
    trackProgress('lab_action', { tool });
  };

  // Track synonym learning
  const trackSynonymLearned = (word, synonym) => {
    trackProgress('synonym_learned', { word, synonym });
  };

  // Track arena wins
  const trackArenaWin = (gameType) => {
    trackProgress('arena_win', { gameType });
  };

  // Track tool usage
  const trackToolUsage = (toolName) => {
    trackProgress('tool_used', { tool: toolName });
  };

  return {
    trackLabAction,
    trackSynonymLearned,
    trackArenaWin,
    trackToolUsage
  };
};

function getDefaultGuestJourney() {
  return {
    currentNode: 1,
    characterStage: "infant",
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
}