"use client";

export default function ProgressBar({ current, total }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      {/* Segmented step bar — each segment = one question */}
      <div className="flex flex-1 gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-all duration-500 ${
              i < current
                ? "bg-[#75c32c] shadow-[0_0_6px_rgba(117,195,44,0.35)]"
                : "bg-gray-200 dark:bg-gray-800"
            }`}
          />
        ))}
      </div>
      {/* Compact counter */}
      <span className="text-xs font-black text-[#75c32c] tabular-nums shrink-0 min-w-[32px] text-right">
        {current}/{total}
      </span>
    </div>
  );
}