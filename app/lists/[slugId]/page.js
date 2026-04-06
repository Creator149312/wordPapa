import { cache } from "react";
import apiConfig from "@utils/apiUrlConfig";
import { validateObjectID } from "@utils/Validator";
import ListClientWrapper from "../ListClientWrapper";
import { redirect } from "next/navigation";

// Helper to create consistent slugs
const slugify = (text) => 
  text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');

// React cache() deduplicates: generateMetadata and Page call this with the same id
// in the same request — only ONE fetch/DB round-trip happens.
const getList = cache(async (id) => {
  try {
    const res = await fetch(`${apiConfig.apiUrl}/list/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.list || null;
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }) {
  const { slugId } = await params;

  const parts = slugId.split("-");
  const id = parts.length > 1 ? parts[parts.length - 1] : slugId;

  if (!validateObjectID(id)) return { title: "Invalid List | Wordpapa" };

  const list = await getList(id);
  if (!list) return { title: { absolute: "List Not Found | Wordpapa" } };

  return {
    title: { absolute: `${list.title} Flashcards - Wordpapa` },
    description: `Master the ${list.title} using interactive flashcards, audio, and speaking practice.`,
  };
}

export default async function Page({ params }) {
  const { slugId } = await params;

  const parts = slugId.split("-");
  const id = parts.length > 1 ? parts[parts.length - 1] : slugId;
  const urlSlug = parts.length > 1 ? parts.slice(0, -1).join("-") : slugId;

  let wordsList = null;
  let error = null;

  if (validateObjectID(id)) {
    const list = await getList(id);
    if (list) {
      wordsList = list;
      const currentSlug = slugify(wordsList.title);
      if (urlSlug !== currentSlug) {
        redirect(`/lists/${currentSlug}-${id}`);
      }
    } else {
      error = "Failed to fetch list";
    }
  } else {
    error = "Invalid ID";
  }

  return <ListClientWrapper wordsList={wordsList} listerror={error} />;
}