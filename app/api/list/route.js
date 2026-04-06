import { connectMongoDB } from "@lib/mongodb";
import List from "@models/list";
import { validateListTitle } from "@utils/Validator";
import { NextResponse } from "next/server";

// Create a new list
export async function POST(request) {
  try {
    const { title, description, words, createdBy, tags } = await request.json();
    let error = "";

    const vlt = validateListTitle(title);
    if (vlt.length !== 0) error = vlt;

    if (error.length === 0) {
      await connectMongoDB();

      // Store the result of the creation in a variable
      const newList = await List.create({ 
        title, 
        description: description || "My custom list", 
        words: words || [], // Ensure words is at least an empty array
        createdBy,
        tags: Array.isArray(tags) ? tags.map(t => t.toLowerCase().trim()).filter(Boolean) : [],
      });

      // Return the newList object so the frontend can use data.list
      return NextResponse.json(
        { 
          message: "List Created Successfully", 
          list: newList 
        }, 
        { status: 201 }
      );
    } else {
      return NextResponse.json({ error }, { status: 400 });
    }
  } catch (e) {
    console.error("API Error:", e);
    return NextResponse.json(
      { error: "Error creating list", details: e.message }, 
      { status: 500 }
    );
  }
}

// Get all lists (with optional search by title or filter by tag)
export async function GET(request) {
  await connectMongoDB();

  const search = request.nextUrl.searchParams.get("search");
  const tag = request.nextUrl.searchParams.get("tag");
  const query = {};

  if (search) {
    query.title = new RegExp(search, "i");
  }
  if (tag) {
    query.tags = tag.toLowerCase().trim();
  }

  // Always exclude system-tagged lists (journey-node, tough-nuts) from the public browse API.
  // These lists are accessible via direct URL but not surfaced in /lists.
  query.systemTags = { $not: { $elemMatch: { $in: ["journey-node", "tough-nuts"] } } };

  const lists = search
    ? await List.find(query)
        .select("title tags createdBy words.word systemTags")
        .limit(10)
        .lean()
    : await List.find(query)
        .select("title tags createdBy words.word systemTags createdAt")
        .sort({ createdAt: -1 })
        .lean();

  // Cache unfiltered browse for 30s on Vercel CDN; skip for search/tag (user-specific intent).
  const cacheHeader = search || tag
    ? "no-store"
    : "s-maxage=30, stale-while-revalidate=60";

  return NextResponse.json(
    { lists },
    { status: 200, headers: { "Cache-Control": cacheHeader } }
  );
}

// Delete a list by ID
export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await connectMongoDB();
  const list = await List.findById(id);
  if (!list) return NextResponse.json({ message: "Not found" }, { status: 404 });
  if (list.isSystemList) {
    return NextResponse.json({ message: "This list is managed by the system and cannot be deleted." }, { status: 403 });
  }
  await List.findByIdAndDelete(id);
  return NextResponse.json({ message: "List deleted" }, { status: 200 });
}
