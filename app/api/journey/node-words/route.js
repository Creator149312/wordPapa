import { connectMongoDB } from "@lib/mongodb";
import NodeList from "@models/nodeList";
import List from "@models/list";

/**
 * GET /api/journey/node-words?nodeId=2-3
 * Returns words from all lists assigned to a journey node.
 * Words sourced from list.words array ({ word, wordData }).
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const nodeId = searchParams.get("nodeId");

    if (!nodeId) {
      return Response.json(
        { error: "nodeId parameter required (format: rank-node)" },
        { status: 400 }
      );
    }

    const [rankStr, nodeStr] = nodeId.split("-");
    const rank = parseInt(rankStr, 10);
    const node = parseInt(nodeStr, 10);

    if (!rank || !node || rank < 1 || rank > 8 || node < 1 || node > 5) {
      return Response.json({ error: "Invalid nodeId format" }, { status: 400 });
    }

    await connectMongoDB();

    const nodeLists = await NodeList.find({ rank, node })
      .sort({ order: 1 })
      .populate("listId");

    if (!nodeLists || nodeLists.length === 0) {
      return Response.json({ error: "Node not found" }, { status: 404 });
    }

    const allWords = [];
    let nodeTitle = "";

    for (const nl of nodeLists) {
      const list = nl.listId;
      if (!list || !list.words?.length) continue;
      if (!nodeTitle) nodeTitle = list.title;

      for (const entry of list.words) {
        if (entry.word) {
          allWords.push({
            word: entry.word,
            hint: entry.wordData || "",
            category: list.title,
          });
        }
      }
    }

    return Response.json(
      {
        success: true,
        words: allWords,
        title: nodeTitle || `Node ${nodeId}`,
        nodeId,
        totalWords: allWords.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch node words error:", error);
    return Response.json(
      { error: "Failed to fetch node words" },
      { status: 500 }
    );
  }
}
