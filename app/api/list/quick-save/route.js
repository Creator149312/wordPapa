import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@/lib/mongodb";
import List from "@/models/list";

/**
 * POST /api/list/quick-save
 *
 * Saves a word quickly to the user's primary "My Saved Words" list.
 * Creates the list if it doesn't already exist.
 *
 * Request Body:
 *   { word: string, definition?: string }
 */
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { word, definition = "" } = await request.json();
    if (!word || typeof word !== "string") {
      return NextResponse.json({ error: "Word is required" }, { status: 400 });
    }

    const cleanWord = word.trim().toLowerCase();
    const userEmail = session.user.email;

    await connectMongoDB();

    // Look for an existing "My Saved Words" list created by this user
    let list = await List.findOne({
      createdBy: userEmail,
      $or: [
        { isQuickSave: true },
        { title: "My Saved Words" },
      ],
    });

    if (!list) {
      list = await List.create({
        title: "My Saved Words",
        description: "Your personalized collection of saved vocabulary words.",
        createdBy: userEmail,
        isQuickSave: true,
        tags: ["saved", "vocabulary"],
        words: [{ word: cleanWord, wordData: definition }],
      });

      return NextResponse.json({
        message: `Saved "${cleanWord}" to My Saved Words`,
        listId: list._id,
        isNew: true,
        alreadySaved: false,
      });
    }

    // Check if word is already present
    const alreadySaved = (list.words || []).some(
      (w) => (w.word || "").toLowerCase() === cleanWord
    );

    if (alreadySaved) {
      return NextResponse.json({
        message: `"${cleanWord}" is already in My Saved Words`,
        listId: list._id,
        alreadySaved: true,
      });
    }

    // Append word to existing list
    list.words.push({ word: cleanWord, wordData: definition });
    await list.save();

    return NextResponse.json({
      message: `Saved "${cleanWord}" to My Saved Words`,
      listId: list._id,
      alreadySaved: false,
    });
  } catch (error) {
    console.error("[quick-save] Error:", error);
    return NextResponse.json(
      { error: "Failed to save word", details: error.message },
      { status: 500 }
    );
  }
}
