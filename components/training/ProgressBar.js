"use client";

export default function ProgressBar({ current, total }) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full space-y-3 mb-2 px-1">
      {/* Label Area */}
      <div className="flex justify-between items-end px-1">
        <div className="flex flex-col">
          {/* <span className="text-[9px] uppercase tracking-[0.25em] font-black text-gray-400 dark:text-gray-500 mb-0.5">
            Progress
          </span> */}
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-gray-800 dark:text-white leading-none">
              {current}
            </span>
            <span className="text-xs font-bold text-gray-400 dark:text-gray-600 uppercase">
              / {total} Steps
            </span>
          </div>
        </div>

        {/* Percentage Badge */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-[#75c32c] bg-[#75c32c]/10 dark:bg-[#75c32c]/20 px-2 py-1 rounded-lg">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Bar Container */}
      <div className="relative w-full bg-gray-100 dark:bg-gray-800/50 rounded-full h-2.5 overflow-hidden">
        {/* The Actual Progress Fill */}
        <div
          className="h-full bg-[#75c32c] rounded-full transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-[0_0_12px_rgba(117,195,44,0.3)]"
          style={{ width: `${percentage}%` }}
        >
          {/* Subtle Glossy Highlight (Better for mobile performance than an infinite shimmer) */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </div>
    </div>
  );
}