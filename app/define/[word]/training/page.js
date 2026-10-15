import { redirect } from "next/navigation";

/**
 * Legacy /define/[word]/training route.
 * Redirects permanently/gracefully to the canonical definition page /define/[word]
 * to preserve URLs, inbound backlinks, and avoid 404s.
 */
export default async function TrainingPage({ params }) {
  const { word } = await params;
  const targetWord = word ? encodeURIComponent(word) : "";
  redirect(`/define/${targetWord}`);
}
