'use client';
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { BookOpen, Loader2 } from "lucide-react";

export default function WordCard({ word }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDefinition() {
      try {
        // Change this line in WordCard.js:
        const res = await fetch(`/api/words/${encodeURIComponent(word.toLowerCase())}`);
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Failed to fetch word data");
      } finally {
        setLoading(false);
      }
    }
    fetchDefinition();
  }, [word]);

  if (loading) return <div className="flex justify-center p-4"><Loader2 className="animate-spin text-[#75c32c]" /></div>;
  if (!data) return null;

  return (
    <Card className="mt-6 p-6 border-l-4 border-l-[#75c32c] bg-[#75c32c]/5 rounded-2xl animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center gap-2 mb-3 text-[#75c32c]">
        <BookOpen size={18} strokeWidth={3} />
        <span className="font-black uppercase text-xs tracking-widest">Vocabulary Insight</span>
      </div>

      <h3 className="text-xl font-black text-gray-900 dark:text-white capitalize mb-1">
        {data.word} <span className="text-sm font-medium text-gray-400 italic">({data.partOfSpeech || 'noun'})</span>
      </h3>

      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
        {data.definition || "No definition available for this word."}
      </p>

      {data.example && (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 italic text-xs text-gray-500">
          "{data.example}"
        </div>
      )}
    </Card>
  );
}