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

export async function generateMetadata({ params }) {
  const { slugId } = await params;
  
  // Extract ID from the end (e.g., "my-list-65af2...")
  const parts = slugId.split("-");
  const id = parts.length > 1 ? parts.pop() : slugId;

  if (!validateObjectID(id)) return { title: "Invalid List | Wordpapa" };

  try {
    const res = await fetch(`${apiConfig.apiUrl}/list/${id}`);
    const data = await res.json();
    if (!data.list) throw new Error();

    return {
      title: {
        absolute: `${data.list.title} Flashcards - Wordpapa`
      },
      // Updated description with list title for better SEO context
      description: `Master the ${data.list.title} using interactive flashcards, audio, and speaking practice.`,
    };
  } catch {
    return { title: { absolute: "List Not Found | Wordpapa" } };
  }
}

export default async function Page({ params }) {
  const { slugId } = await params;

  // 1. Extract ID and Slug from the URL segment
  const parts = slugId.split("-");
  const id = parts.length > 1 ? parts.pop() : slugId; 
  const urlSlug = parts.join("-");

  let wordsList = null;
  let error = null;

  if (validateObjectID(id)) {
    try {
      const response = await fetch(`${apiConfig.apiUrl}/list/${id}`, {
        cache: "no-store",
      });
      
      if (response.ok) {
        const data = await response.json();
        wordsList = data.list;

        // 2. SEO CHECK: Is the slug correct?
        const currentSlug = slugify(wordsList.title);
        if (urlSlug !== currentSlug) {
          // Redirect to the "Canonical" version of this URL
          redirect(`/lists/${currentSlug}-${id}`);
        }
      } else {
        error = "Failed to fetch list";
      }
    } catch (err) {
      error = err.message;
    }
  } else {
    error = "Invalid ID";
  }

  return <ListClientWrapper wordsList={wordsList} listerror={error} />;
}