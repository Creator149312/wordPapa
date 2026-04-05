import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@/lib/mongodb";
import List from "@/models/list";

const TOUGH_NUTS_TITLE = "Tough Nuts";

/**
 * Finds or creates the user's "Tough Nuts" system list.
 * This list is undeletable and accumulates words the user struggled with.
 */
async function getToughNutsList(userEmail) {
  let list = await List.findOne({ createdBy: userEmail, isToughNuts: true });
  if (!list) {
    list = await List.create({
      title: TOUGH_NUTS_TITLE,
      description: "Words you struggled with — they'll come back to haunt you (and help you master them).",
      createdBy: userEmail,
      words: [],
      tags: ["system", "tough-nuts"],
      isSystemList: true,
      isToughNuts: true,
    });
  }
  return list;
}

/**
 * GET /api/journey/tough-nuts
 * Returns the user's Tough Nuts word list.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongoDB();
  const list = await List.findOne({ createdBy: session.user.email, isToughNuts: true }).lean();

  return NextResponse.json({
    success: true,
    words: list?.words || [],
    listId: list?._id || null,
    count: list?.words?.length || 0,
  });
}

/**
 * POST /api/journey/tough-nuts
 * Adds one or more words to the user's Tough Nuts list (deduplicates by word text).
 * Body: { word: string, wordData?: string } or { words: [{ word, wordData? }] }
 */
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const syncDebugEnabled = req.headers.get("x-journey-sync-debug") === "1";

  const { word, wordData = "", words = [] } = await req.json();
  const entries = Array.isArray(words) && words.length > 0
    ? words
    : [{ word, wordData }];

  const normalizedEntries = entries
    .filter((entry) => entry?.word && typeof entry.word === "string")
    .map((entry) => ({
      word: entry.word.toLowerCase(),
      wordData: entry.wordData || "",
    }));

  if (normalizedEntries.length === 0) {
    return NextResponse.json({ error: "word required" }, { status: 400 });
  }

  await connectMongoDB();
  const list = await getToughNutsList(session.user.email);

  let addedCount = 0;
  normalizedEntries.forEach((entry) => {
    const alreadyExists = list.words.some(
      (item) => item.word.toLowerCase() === entry.word,
    );

    if (!alreadyExists) {
      list.words.push(entry);
      addedCount += 1;
    }
  });

  if (addedCount > 0) {
    await list.save();
  }

  if (syncDebugEnabled) {
    console.log("[JourneySync][server] tough-nuts.success", {
      userEmail: session.user.email,
      received: normalizedEntries.length,
      addedCount,
      totalCount: list.words.length,
    });
  }

  return NextResponse.json({
    success: true,
    added: addedCount > 0,
    addedCount,
    count: list.words.length,
  });
}

/**
 * DELETE /api/journey/tough-nuts
 * Removes one or more words from the user's Tough Nuts list.
 * Body: { word: string } or { words: [string] }
 */
export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const syncDebugEnabled = req.headers.get("x-journey-sync-debug") === "1";
  const { word, words = [] } = await req.json();

  const normalizedWords = [
    ...(typeof word === "string" ? [word] : []),
    ...(Array.isArray(words) ? words : []),
  ]
    .filter((entry) => typeof entry === "string" && entry.trim().length > 0)
    .map((entry) => entry.toLowerCase());

  if (normalizedWords.length === 0) {
    return NextResponse.json({ error: "word required" }, { status: 400 });
  }

  await connectMongoDB();
  const list = await List.findOne({ createdBy: session.user.email, isToughNuts: true });

  if (!list) {
    return NextResponse.json({
      success: true,
      removed: false,
      removedCount: 0,
      count: 0,
    });
  }

  const beforeCount = list.words.length;
  list.words = list.words.filter(
    (item) => !normalizedWords.includes(item.word.toLowerCase()),
  );
  const removedCount = beforeCount - list.words.length;

  if (removedCount > 0) {
    await list.save();
  }

  if (syncDebugEnabled) {
    console.log("[JourneySync][server] tough-nuts.remove", {
      userEmail: session.user.email,
      requested: normalizedWords.length,
      removedCount,
      totalCount: list.words.length,
    });
  }

  return NextResponse.json({
    success: true,
    removed: removedCount > 0,
    removedCount,
    count: list.words.length,
  });
}
