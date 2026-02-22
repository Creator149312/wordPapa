"use client";

import { useSession } from "next-auth/react";
import WordLists from "@components/WordLists";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, LayoutDashboard, ListChecks, Sparkles } from "lucide-react";

export default function Page() {
  const { status, data: session } = useSession();
  const router = useRouter();

  // Loading State
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="w-12 h-12 border-4 border-[#75c32c]/20 border-t-[#75c32c] rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">
          Syncing Your Progress...
        </p>
      </div>
    );
  }

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-500 pb-20">
      {/* Top Header Section */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#75c32c] font-black text-xs uppercase tracking-[0.2em]">
                <LayoutDashboard size={14} />
                Learning Portal
              </div>
              <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                Welcome back, <span className="text-[#75c32c]">{session?.user?.name?.split(' ')[0] || 'Learner'}!</span>
              </h1>
            </div>

            <Link
              href="./lists/addList"
              className="inline-flex items-center justify-center gap-2 bg-[#75c32c] text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-[#75c32c]/30 hover:bg-[#66aa26] transition-all hover:scale-105 active:scale-95"
            >
              <Plus size={20} strokeWidth={3} />
              Create New List
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 mt-10">
        {/* Statistics or Quick Info Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-[#75c32c]/10 text-[#75c32c] rounded-2xl flex items-center justify-center">
              <ListChecks size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your Vocabulary</p>
              <p className="text-xl font-black text-gray-900 dark:text-white">Word Lists</p>
            </div>
          </div>
          
          <div className="bg-[#75c32c] p-6 rounded-3xl flex items-center gap-4 shadow-lg shadow-[#75c32c]/20">
            <div className="w-12 h-12 bg-white/20 text-white rounded-2xl flex items-center justify-center">
              <Sparkles size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-white/70 uppercase tracking-widest">Daily Goal</p>
              <p className="text-xl font-black text-white">Keep Learning!</p>
            </div>
          </div>
        </div>

        {/* The Word Lists Content */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 ml-2">
            <div className="h-6 w-1.5 bg-[#75c32c] rounded-full" />
            <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 tracking-tight">
              My Collections
            </h2>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-4 md:p-8 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none">
            <WordLists createdBy={session?.user?.email} />
          </div>
        </div>
      </main>
    </div>
  );
}