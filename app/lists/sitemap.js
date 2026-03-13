import { connectMongoDB } from "@lib/mongodb";
import List from "@models/List"; // Adjust path to your List model

const BASE_URL = "https://words.englishbix.com";

export const revalidate = 3600; // Cache for 1 hour

// Helper to create consistent slugs
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

async function getListsFromDB() {
  try {
    await connectMongoDB();

    // Fetch only the necessary fields to save memory
    const lists = await List.find(
      {},
      { title: 1, _id: 1, updatedAt: 1 },
    ).lean();

    return lists.map((list) => ({
      // Convert MongoDB _id to string
      id: list._id.toString(),
      slug: slugify(list.title),
      lastModified: list.updatedAt || new Date(),
    }));
  } catch (error) {
    console.error("Sitemap DB Error:", error);
    return [];
  }
}

export default async function sitemap() {
  const allLists = await getListsFromDB();

  return allLists.map((list) => ({
    url: `${BASE_URL}/lists/${list.slug}-${list.id}`,
    lastModified: list.lastModified,
    changeFrequency: "weekly",
    priority: 0.6,
  }));
}
