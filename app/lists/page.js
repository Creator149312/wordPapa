import Link from "next/link";
import { Suspense } from "react";
import apiConfig from "@utils/apiUrlConfig";
import { slugify } from "@utils/slugify";

const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase());

async function getLists(tag, search) {
  try {
    const params = new URLSearchParams();

    if (tag) {
      params.set("tag", tag);
    }

    if (search) {
      params.set("search", search);
    }

    const url = `${apiConfig.apiUrl}/list${params.toString() ? `?${params.toString()}` : ""}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch lists");
    const data = await res.json();
    return data.lists || [];
  } catch (error) {
    console.error("Error loading lists:", error);
    return [];
  }
}

export default async function ExploreListsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const activeTag = resolvedSearchParams?.tag || null;
  const activeSearch = resolvedSearchParams?.search?.trim() || null;
  const lists = await getLists(activeTag, activeSearch);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#080808] py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Explore <span className="text-[#75c32c]">Collections</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            Vocabulary lists organized by topic.
          </p>
        </header>

        {/* Active filter label */}
        {activeTag && (
          <p className="text-center text-xs font-bold text-[#75c32c] mb-5 -mt-3">
            &quot;{activeTag}&quot; — {lists.length} result{lists.length !== 1 ? "s" : ""}
          </p>
        )}

        {activeSearch && (
          <p className="text-center text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-5 -mt-3">
            Searching for &quot;<span className="text-[#75c32c]">{activeSearch}</span>&quot; — {lists.length} match{lists.length !== 1 ? "es" : ""}
          </p>
        )}

        {/* Grid of cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((list) => {
            const listSlugId = `${slugify(list.title)}-${list._id}`;
            const isOfficial = adminEmails.includes((list.createdBy || "").toLowerCase());

            return (
              <Link
                key={list._id}
                href={`/lists/${listSlugId}`}
                className="group flex flex-col bg-white dark:bg-[#111] rounded-2xl p-5 border border-gray-100 dark:border-white/5 hover:border-[#75c32c]/40 hover:shadow-lg hover:shadow-[#75c32c]/10 hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Top row: word count + official badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {list.words?.length || 0} Words
                  </span>
                  {isOfficial && (
                    <span className="flex items-center gap-0.5 px-2 py-0.5 bg-green-50 dark:bg-green-900/20 rounded-full">
                      <svg width="8" height="8" viewBox="0 0 12 12" fill="none" className="text-green-600 dark:text-green-400">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-[8px] font-black uppercase tracking-widest text-green-600 dark:text-green-400">Official</span>
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-base font-black text-gray-900 dark:text-white group-hover:text-[#75c32c] transition-colors line-clamp-2 leading-snug mb-2">
                  {list.title}
                </h2>

                {/* Tags */}
                {list.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-auto pt-3 border-t border-gray-50 dark:border-white/5">
                    {list.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {lists.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-[#111] rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
            <p className="text-gray-400 font-bold">
              {activeTag ? `No lists found for "${activeTag}" yet.` : "No public lists found yet."}
            </p>
            {activeSearch && (
              <p className="mt-2 text-sm text-gray-400">
                Try a broader title, or clear the search to browse all collections.
              </p>
            )}
            {activeTag && (
              <Link href="/lists" className="mt-3 inline-block text-sm font-bold text-[#75c32c] hover:underline">
                View all collections →
              </Link>
            )}
            {activeSearch && (
              <Link href={activeTag ? `/lists?tag=${encodeURIComponent(activeTag)}` : "/lists"} className="mt-3 inline-block text-sm font-bold text-[#75c32c] hover:underline">
                Clear search →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}