"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Fires a background POST to /api/words/enrich for words that have no entries
// in the DB yet. On success it refreshes the current route so the newly saved
// definition is shown — subsequent visits hit the ISR cache and never reach here.
export default function EnrichTrigger({ word }) {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function enrich() {
      try {
        const res = await fetch("/api/words/enrich", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ words: [word] }),
        });

        if (!res.ok || cancelled) return;

        const data = await res.json();
        const hasEntries = data?.words?.[0]?.entries?.length > 0;

        if (hasEntries && !cancelled) {
          // Refresh the RSC tree so the server re-fetches from DB and renders
          // the real definition. ISR will then cache this rendered output.
          router.refresh();
        }
      } catch {
        // Silent fail — user already sees the "no entries" placeholder
      }
    }

    enrich();

    return () => {
      cancelled = true;
    };
  }, [word, router]);

  return null;
}
