"use client";

import EditTopicForm from "@components/EditTopicForm";
import apiConfig from "@utils/apiUrlConfig";
import { useState, useEffect } from "react";
import { Loader2, AlertCircle, ListRestart, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation"; // Use hook for client components

export default function GetListData() {
  // Use useParams() for cleaner client-side access to slugId
  const params = useParams();
  const { slugId } = params;

  // Extract ID from the end (e.g., "my-list-65af2...")
  const parts = slugId?.split("-") || [];
  const id = parts.length > 1 ? parts.pop() : slugId;

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${apiConfig.apiUrl}/list/${id}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("This collection could not be found.");
        }

        const result = await response.json();
        setData(result.list);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen pb-20">
      {/* Navigation & Header */}
      <div className="mb-8 mt-4 space-y-4">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 text-gray-400 hover:text-[#75c32c] transition-colors w-fit group"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Back to Dashboard</span>
        </Link>

        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Edit Collection
          </h1>
          <p className="text-[10px] font-black text-[#75c32c] uppercase tracking-[0.2em] mt-1">
            Refine your word collections
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-32 animate-in fade-in">
          <div className="relative">
            <Loader2 className="animate-spin text-[#75c32c]" size={48} />
            <div className="absolute inset-0 blur-xl bg-[#75c32c]/20 animate-pulse rounded-full"></div>
          </div>
          <p className="font-black text-gray-400 uppercase tracking-[0.3em] text-[10px] mt-6">
            Syncing Data...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/10 border-2 border-red-100 dark:border-red-900/20 text-red-600 dark:text-red-400 p-10 rounded-[2.5rem] text-center animate-in zoom-in-95">
          <div className="bg-red-100 dark:bg-red-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h3 className="font-black text-xl mb-2">Fetch Failed</h3>
          <p className="text-sm opacity-80 max-w-xs mx-auto mb-6">{error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Content Section */}
      {data && !isLoading && (
        <div className="bg-white dark:bg-[#111] shadow-2xl shadow-black/5 dark:shadow-none border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-8 md:p-10 animate-in slide-in-from-bottom-6 duration-700">
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-50 dark:border-white/5">
            <div className="flex items-center gap-4">
              <div className="bg-[#75c32c] p-3 rounded-2xl shadow-lg shadow-[#75c32c]/20">
                <ListRestart className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Editing Collection</h2>
                <p className="text-2xl font-bold dark:text-white truncate max-w-[250px] md:max-w-md">
                  {data.title}
                </p>
              </div>
            </div>
            
            <div className="hidden md:block text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Words</p>
              <p className="text-xl font-bold text-[#75c32c]">{data.words?.length || 0}</p>
            </div>
          </div>

          <EditTopicForm
            id={id}
            title={data.title}
            description={data.description}
            words={data.words || []}
          />
        </div>
      )}
    </div>
  );
}