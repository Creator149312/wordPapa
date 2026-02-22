"use client";

import Link from "next/link";
import RemoveListBtn from "./RemoveListBtn";
import { HiPencilAlt, HiOutlineEye } from "react-icons/hi";
import { useState, useEffect } from "react";
import apiConfig from "@utils/apiUrlConfig";
import { slugify } from "@utils/slugify"; // Import our slug utility
import { BookOpen, Layers } from "lucide-react";

export default function WordLists({ createdBy }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${apiConfig.apiUrl}/list/user/${createdBy}`,
          { cache: "no-store" }
        );

        if (!response.ok) throw new Error("Failed to fetch lists");

        const result = await response.json();
        setData(result.lists || []);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (createdBy) fetchData();
  }, [createdBy]);

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-gray-100 dark:bg-gray-800 rounded-[2rem]" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/20">
        <p className="text-red-600 dark:text-red-400 font-bold">
          Oops! We couldn't load your lists. Please refresh the page.
        </p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-12 text-center space-y-4">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-400">
          <Layers size={40} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">No collections yet</h3>
          <p className="text-gray-500 max-w-xs mx-auto text-sm">
            Create your first word list and start your journey to mastering English!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data.map((item, index) => {
        // Construct the SEO-friendly Slug-ID
        const listSlugId = `${slugify(item.title)}-${item._id}`;

        return (
          <div
            key={item._id || index}
            className="group bg-white dark:bg-gray-800 border-2 border-gray-50 dark:border-gray-700 rounded-[2rem] p-6 flex flex-col justify-between hover:border-[#75c32c] hover:shadow-xl hover:shadow-[#75c32c]/10 transition-all duration-300 hover:-translate-y-1"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-[#75c32c]/10 text-[#75c32c] rounded-2xl group-hover:bg-[#75c32c] group-hover:text-white transition-colors">
                  <BookOpen size={20} />
                </div>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {item.words?.length || 0} Words
                </span>
              </div>

              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 leading-tight capitalize line-clamp-1">
                {item.title}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4 font-medium">
                {item.description || "No description provided."}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700">
              {/* Main Action: View (Updated to slug-id structure) */}
              <Link
                href={`/lists/${listSlugId}`}
                className="flex items-center gap-2 text-sm font-black text-[#75c32c] hover:text-[#66aa26] transition-colors"
              >
                <HiOutlineEye size={18} />
                View List
              </Link>

              {/* Secondary Actions */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/lists/editList/${listSlugId}`} // Updated to match our edit-list structure
                  className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                  title="Edit List"
                >
                  <HiPencilAlt size={20} />
                </Link>
                <div className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
                  <RemoveListBtn id={item._id} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}