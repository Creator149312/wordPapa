import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectMongoDB } from "@/lib/mongodb";
import Journey from "@/models/journey";
import JourneyProgress from "@/models/journeyProgress";
import NodeList from "@/models/nodeList";
import User from "@/models/user";
import { RANKS } from "@/app/games/hangman/constants";
import { authOptions } from "@app/api/auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoDB();

    let journey = await Journey.findOne({ userEmail: session.user.email });

    // Create journey if it doesn't exist
    if (!journey) {
      const missionRequirements = {
        1: {
          labActions: 5,
          synonymsLearned: 3,
          arenaWins: 0,
          toolsUsed: ["dictionary", "thesaurus"],
        },
        2: {
          labActions: 8,
          synonymsLearned: 5,
          arenaWins: 1,
          toolsUsed: ["adjectives", "rhyming"],
        },
        3: {
          labActions: 10,
          synonymsLearned: 7,
          arenaWins: 2,
          toolsUsed: ["nouns", "syllables"],
        },
        4: {
          labActions: 12,
          synonymsLearned: 8,
          arenaWins: 3,
          toolsUsed: ["word-finder", "sentences"],
        },
        5: {
          labActions: 15,
          synonymsLearned: 10,
          arenaWins: 5,
          toolsUsed: ["dictionary", "thesaurus", "arena"],
        },
      };

      const initialRank = getRankFromXP(0);

      journey = new Journey({
        userEmail: session.user.email,
        xp: 0,
        rankLevel: initialRank.level,
        rankName: initialRank.name,
        rankArenaId: initialRank.arenaId,
        rankColor: initialRank.color,
        rankStageName: initialRank.stageName,
        activeMission: {
          nodeId: 1,
          missionType: "learning",
          requirements: missionRequirements[1],
          progress: {
            labActions: 0,
            synonymsLearned: 0,
            arenaWins: 0,
            toolsUsed: [],
          },
          startedAt: new Date(),
        },
      });

      await journey.save();
    }

    // Update character stage and rank based on current node/xp
    journey.characterStage = journey.getCharacterStage();
    const currentRank = getRankFromXP(journey.xp || 0);
    journey.rankLevel = currentRank.level;
    journey.rankName = currentRank.name;
    journey.rankArenaId = currentRank.arenaId;
    journey.rankColor = currentRank.color;
    journey.rankStageName = currentRank.stageName;

    await journey.save();

    // Compute node progress live from Journey.practiceHistory + NodeList assignments.
    // This is always accurate: no dependency on a stale JourneyProgress cache.
    const allNodeListAssignments = await NodeList.find({});
    const practiceHistory = journey.practiceHistory || new Map();

    // Build map: "rankId-nodeId" → [listId strings]
    const nodeListMap = {};
    for (const assignment of allNodeListAssignments) {
      const key = `${assignment.rank}-${assignment.node}`;
      if (!nodeListMap[key]) nodeListMap[key] = [];
      nodeListMap[key].push(assignment.listId.toString());
    }

    // Build the full progress structure (8 ranks × 5 nodes each)
    const journeyProgress = [];
    for (let rankId = 1; rankId <= 8; rankId++) {
      const nodes = [];
      for (let nodeId = 1; nodeId <= 5; nodeId++) {
        const key = `${rankId}-${nodeId}`;
        const listIds = nodeListMap[key] || [];
        const listsProgress = [];
        let nodePercent = 0;

        if (listIds.length > 0) {
          let total = 0;
          for (const listId of listIds) {
            const stats = practiceHistory.get(listId) || { bestScore: 0 };
            const pct = stats.bestScore || 0;
            total += pct;
            listsProgress.push({ listId, percent: pct });
          }
          nodePercent = Math.round(total / listIds.length);
        }

        nodes.push({ nodeId, nodePercent, lists: listsProgress });
      }
      journeyProgress.push({ rankId, nodes });
    }

    return NextResponse.json({
      currentNode: journey.currentNode,
      currentNodeId: journey.currentNodeId || "1-1",
      characterStage: journey.characterStage,
      xp: journey.xp,
      rankLevel: journey.rankLevel,
      rankName: journey.rankName,
      rankArenaId: journey.rankArenaId,
      rankColor: journey.rankColor,
      rankStageName: journey.rankStageName,
      missionsCompleted: journey.missionsCompleted,
      activeMission: journey.activeMission,
      totalMissionsCompleted: journey.totalMissionsCompleted,
      journeyStartDate: journey.journeyStartDate,
      lastActivityDate: journey.lastActivityDate,
      unlockedFeatures: journey.unlockedFeatures,
      streak: journey.streak || 0,
      lastPracticeDay: journey.lastPracticeDay || null,
      progress: journeyProgress,
    });
  } catch (error) {
    console.error("Error fetching journey:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, data } = await request.json();
    await connectMongoDB();

    let journey = await Journey.findOne({ userEmail: session.user.email });

    if (!journey) {
      return NextResponse.json({ error: "Journey not found" }, { status: 404 });
    }

    switch (action) {
      case "update_progress":
        // Update mission progress
        if (journey.activeMission) {
          const { type, tool } = data;

          if (type === "lab_action") {
            journey.activeMission.progress.labActions += 1;
          } else if (type === "synonym_learned") {
            journey.activeMission.progress.synonymsLearned += 1;
          } else if (type === "arena_win") {
            journey.activeMission.progress.arenaWins += 1;
          } else if (type === "tool_used" && tool) {
            if (!journey.activeMission.progress.toolsUsed.includes(tool)) {
              journey.activeMission.progress.toolsUsed.push(tool);
            }
          }

          journey.lastActivityDate = new Date();
          await journey.save();
        }
        break;

      case "start_mission":
        // Start a new mission for the next node
        const nextNode = journey.currentNode + 1;
        if (nextNode <= 10) {
          const missionRequirements = getMissionRequirements(nextNode);

          journey.activeMission = {
            nodeId: nextNode,
            missionType: "learning",
            requirements: missionRequirements,
            progress: {
              labActions: 0,
              synonymsLearned: 0,
              arenaWins: 0,
              toolsUsed: [],
            },
            startedAt: new Date(),
          };

          journey.lastActivityDate = new Date();
          await journey.save();
        }
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating journey:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

function getMissionRequirements(nodeId) {
  const requirements = {
    1: {
      labActions: 5,
      synonymsLearned: 3,
      arenaWins: 0,
      toolsUsed: ["dictionary", "thesaurus"],
    },
    2: {
      labActions: 8,
      synonymsLearned: 5,
      arenaWins: 1,
      toolsUsed: ["adjectives", "rhyming"],
    },
    3: {
      labActions: 10,
      synonymsLearned: 7,
      arenaWins: 2,
      toolsUsed: ["nouns", "syllables"],
    },
    4: {
      labActions: 12,
      synonymsLearned: 8,
      arenaWins: 3,
      toolsUsed: ["word-finder", "sentences"],
    },
    5: {
      labActions: 15,
      synonymsLearned: 10,
      arenaWins: 5,
      toolsUsed: ["dictionary", "thesaurus", "arena"],
    },
    6: {
      labActions: 18,
      synonymsLearned: 12,
      arenaWins: 7,
      toolsUsed: ["dictionary", "thesaurus", "arena", "phrasal-verbs"],
    },
    7: {
      labActions: 20,
      synonymsLearned: 15,
      arenaWins: 8,
      toolsUsed: ["dictionary", "thesaurus", "arena", "all-tools"],
    },
    8: {
      labActions: 22,
      synonymsLearned: 18,
      arenaWins: 10,
      toolsUsed: ["dictionary", "thesaurus", "arena", "all-tools"],
    },
    9: {
      labActions: 25,
      synonymsLearned: 20,
      arenaWins: 12,
      toolsUsed: ["dictionary", "thesaurus", "arena", "all-tools"],
    },
    10: {
      labActions: 30,
      synonymsLearned: 25,
      arenaWins: 15,
      toolsUsed: ["dictionary", "thesaurus", "arena", "all-tools"],
    },
  };

  return requirements[nodeId] || requirements[1];
}

function getRankFromXP(xp) {
  const currentXP = Math.max(0, xp || 0);
  const sortedRanks = [...RANKS].sort((a, b) => b.minXP - a.minXP);
  return sortedRanks.find((rank) => currentXP >= rank.minXP) || RANKS[0];
}

function initializeJourneyProgress() {
  // Create initial progress structure with all 8 ranks and 5 nodes each
  const ranks = [];
  
  for (let rankId = 1; rankId <= 8; rankId++) {
    const nodes = [];
    for (let nodeId = 1; nodeId <= 5; nodeId++) {
      nodes.push({
        nodeId,
        lists: [],
        nodePercent: 0 // All nodes start at 0% progress
      });
    }
    ranks.push({
      rankId,
      nodes
    });
  }
  
  return ranks;
}
