"use client";

import { useRouter, useSearchParams } from "next/navigation";

const TOPIC_TAGS = [
  { label: "All", value: null },
  { label: "🐾 Animals", value: "animals" },
  { label: "🍎 Food & Drinks", value: "food" },
  { label: "💼 Business", value: "business" },
  { label: "⚖️ Law", value: "law" },
  { label: "💻 Technology", value: "technology" },
  { label: "⚽ Sports", value: "sports" },
  { label: "✈️ Travel", value: "travel" },
  { label: "🏥 Medical", value: "medical" },
  { label: "🎓 Academic", value: "academic" },
];

export default function ListsFilterBar({ activeTag }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSelect(value) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("tag", value);
    } else {
      params.delete("tag");
    }
    router.push(`/lists?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-10">
      {TOPIC_TAGS.map(({ label, value }) => {
        const isActive = activeTag === value || (!activeTag && value === null);
        return (
          <button
            key={label}
            onClick={() => handleSelect(value)}
            className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-200 border ${
              isActive
                ? "bg-[#75c32c] text-white border-[#75c32c] shadow-md shadow-[#75c32c]/30 scale-105"
                : "bg-white dark:bg-[#111] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-[#75c32c] hover:text-[#75c32c]"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
