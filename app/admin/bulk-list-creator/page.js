// Example admin page for bulk list creation
// Place this in: app/admin/bulk-list-creator/page.js

"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import BulkListCreator from "@components/BulkListCreator";

export default function BulkListCreatorPage() {
  const { status, data: session } = useSession();

  // Only allow admin users (you can customize this based on your user model)
  if (status === "unauthenticated") {
    redirect("/login");
  }

  // Optional: Add admin role check if you have that field
  // if (status === "authenticated" && session?.user?.role !== "admin") {
  //   redirect("/");
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Admin Portal
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Welcome, {session?.user?.email}! Create lists with bulk words in
            seconds.
          </p>
        </div>

        <BulkListCreator />

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">
              🚀 Fast Import
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Paste hundreds of words at once and create lists instantly.
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">
              🧠 Smart Enrichment
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Automatically enriches words from DB or AI. No manual entry
              needed.
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">
              📚 Quality Control
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Preview all words before creating your list. Edit anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
