import { getServerSession } from "next-auth/next";
import { authOptions } from "@app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@lib/mongodb";
import Journey from "@models/journey";
import List from "@models/list";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await connectMongoDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const journey = await Journey.findOne({ userEmail: session.user.email });

    if (!journey?.practiceHistory) {
      return Response.json({
        totalLists: 0,
        totalAttempts: 0,
        masteredLists: 0,
        recentActivity: [],
        dueForReview: [],
        listsToday: 0,
        streak: 0,
        lastPracticeDay: null,
        streakShields: 0,
      });
    }

    const history = journey.practiceHistory;
    let totalAttempts = 0;
    let masteredLists = 0;
    const totalLists = history.size;

    // Collect a flat array of all entries so we can sort them for activity feeds.
    // practiceHistory is a Map: listId (string ObjectId) → { attempts, bestScore, lastScore, mastered, lastPracticed }
    const allEntries = [];
    // Count how many distinct lists the user practiced today (used for the daily goal widget).
    // "Today" is compared in UTC to stay consistent with the streak logic in the practice API.
    const todayStr = new Date().toISOString().split("T")[0];
    let listsToday = 0;

    for (const [listId, stats] of history) {
      totalAttempts += stats.attempts || 0;
      if (stats.mastered) masteredLists++;
      allEntries.push({ listId, ...stats });

      // Check if this list was last practiced today
      if (stats.lastPracticed) {
        const practicedDay = new Date(stats.lastPracticed).toISOString().split("T")[0];
        if (practicedDay === todayStr) listsToday++;
      }
    }

    // --- RECENT ACTIVITY (last 5 practiced, most recent first) ---
    // Sort by lastPracticed descending; entries with no date fall to the bottom.
    const sortedByRecent = [...allEntries]
      .filter((e) => e.lastPracticed)
      .sort((a, b) => new Date(b.lastPracticed) - new Date(a.lastPracticed))
      .slice(0, 5);

    // --- DUE FOR REVIEW (not practiced in 3+ days, up to 5 items) ---
    // A list is "stale" if its lastPracticed is older than 3 days and it was practiced at least once.
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const dueEntries = [...allEntries]
      .filter(
        (e) =>
          e.lastPracticed && new Date(e.lastPracticed) < threeDaysAgo && !e.mastered
      )
      .sort((a, b) => new Date(a.lastPracticed) - new Date(b.lastPracticed)) // oldest first
      .slice(0, 5);

    // Collect the unique listIds we need titles for (single targeted DB query).
    const neededIds = [
      ...new Set([
        ...sortedByRecent.map((e) => e.listId),
        ...dueEntries.map((e) => e.listId),
      ]),
    ]
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    // Fetch only the title field for these specific lists — a small, indexed query.
    const listDocs = await List.find({ _id: { $in: neededIds } })
      .select("title")
      .lean();

    const titleMap = {};
    for (const doc of listDocs) {
      titleMap[doc._id.toString()] = doc.title;
    }

    // Enrich entries with list titles
    const recentActivity = sortedByRecent.map((e) => ({
      listId: e.listId,
      title: titleMap[e.listId] || "Untitled List",
      bestScore: e.bestScore || 0,
      lastScore: e.lastScore || 0,
      attempts: e.attempts || 0,
      lastPracticed: e.lastPracticed,
      mastered: e.mastered || false,
    }));

    const dueForReview = dueEntries.map((e) => ({
      listId: e.listId,
      title: titleMap[e.listId] || "Untitled List",
      bestScore: e.bestScore || 0,
      lastPracticed: e.lastPracticed,
    }));

    return Response.json({
      totalLists,
      totalAttempts,
      masteredLists,
      recentActivity,
      dueForReview,
      // How many distinct lists the user has practiced today — drives the daily goal widget
      listsToday,
      // Streak data comes from the Journey model (shared with journey page)
      streak: journey.streak || 0,
      lastPracticeDay: journey.lastPracticeDay || null,
      // Streak shields — number of shields currently held (max 2)
      streakShields: journey.streakShields || 0,
    });
  } catch (error) {
    console.error("Error fetching practice stats:", error);
    return Response.json(
      { error: "Failed to fetch practice stats" },
      { status: 500 }
    );
  }
}