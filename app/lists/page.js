import Link from "next/link";
import apiConfig from "@utils/apiUrlConfig";
import { slugify } from "@utils/slugify";
import { BookOpen, Users, ChevronRight } from "lucide-react";

async function getAllLists() {
  try {
    const res = await fetch(`${apiConfig.apiUrl}/list`, { 
      next: { revalidate: 3600 } // Cache for 1 hour for better performance
    });
    if (!res.ok) throw new Error("Failed to fetch lists"); 
    const data = await res.json();
    return data.lists || [];
  } catch (error) {
    console.error("Error loading lists:", error);
    return [];
  }
}

export default async function ExploreListsPage() {
  const lists = await getAllLists();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#080808] py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-12 text-center space-y-4">
          <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            Explore <span className="text-[#75c32c]">Collections</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Discover community-created vocabulary lists to accelerate your learning.
          </p>
        </header>

        {/* Grid of Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lists.map((list) => {
            const listSlugId = `${slugify(list.title)}-${list._id}`;
            
            return (
              <Link 
                key={list._id} 
                href={`/lists/${listSlugId}`}
                className="group relative bg-white dark:bg-[#111] rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:shadow-[#75c32c]/10 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex flex-col h-full space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-[#75c32c]/10 rounded-2xl text-[#75c32c]">
                      <BookOpen size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      {list.words?.length || 0} Words
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-[#75c32c] transition-colors line-clamp-1">
                      {list.title}
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {list.description || "No description provided for this collection."}
                    </p>
                  </div>

                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50 dark:border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-200 dark:bg-gray-800 rounded-full" />
                      <span className="text-xs font-bold text-gray-400">Community Member</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-[#75c32c] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {lists.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-[#111] rounded-[3rem] border border-dashed border-gray-200 dark:border-white/10">
            <p className="text-gray-400 font-bold text-lg">No public lists found yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}