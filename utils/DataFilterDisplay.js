'use client'
import AdvancedFilter from "@utils/AdvancedFilter";
import { displayWords } from "@utils/HelperFunctions";
import { useState, useMemo, useTransition } from "react";
import { Loader2 } from "lucide-react";

/**
 * DataFilterDisplay handles client-side filtering and rendering of large word lists.
 * It uses useTransition to ensure that typing in the filter boxes remains responsive (INP optimization).
 * It uses useMemo to prevent unnecessary re-filtering of massive arrays.
 */
const DataFilterDisplay = ({ words }) => {
  const [startsWith, setStartsWith] = useState("");
  const [endsWith, setEndsWith] = useState("");
  const [contains, setContains] = useState("");
  const [length, setLength] = useState("");
  
  const [isPending, startTransition] = useTransition();

  // Wrap state updates in transitions to keep the UI responsive
  const handleStartsWith = (val) => startTransition(() => setStartsWith(val));
  const handleEndsWith = (val) => startTransition(() => setEndsWith(val));
  const handleContains = (val) => startTransition(() => setContains(val));
  const handleLength = (val) => startTransition(() => setLength(val));

  // Memoize the rendered word components. 
  // This is critical because words array can be 100k+ items.
  const wordContent = useMemo(() => {
    return displayWords(words, startsWith, endsWith, contains, length);
  }, [words, startsWith, endsWith, contains, length]);

  return (
    <div className="mb-6 relative">
      <AdvancedFilter
        startsWith={startsWith}
        handleStartsWith={handleStartsWith}
        endsWith={endsWith}
        handleEndsWith={handleEndsWith}
        contains={contains}
        handleContains={handleContains}
        length={length}
        handleLength={handleLength}
      />

      {/* Loading indicator that doesn't cause shift — useful if filtering takes >100ms */}
      {isPending && (
        <div className="absolute top-0 right-0 p-2 text-[#75c32c] animate-spin">
          <Loader2 size={20} />
        </div>
      )}

      {/* 
        By using useTransition, React will keep showing the old results 
        while the new filtered results are calculated in the background, 
        preventing the UI from freezing during typing.
      */}
      <div className={isPending ? "opacity-60 pointer-events-none transition-opacity duration-200" : "opacity-100 transition-opacity duration-200"}>
        {wordContent}
      </div>
    </div>
  );
};

export default DataFilterDisplay;


