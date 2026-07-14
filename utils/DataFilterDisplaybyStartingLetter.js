'use client'
import AdvancedFilter from "@utils/AdvancedFilter";
import { displayWordsByStartingLetter } from "@utils/HelperFunctions";
import { useState, useMemo, useTransition } from "react";
import { Loader2 } from "lucide-react";

/**
 * Optimized version of DataFilterDisplay that groups by starting letter.
 * Uses useTransition and useMemo to maintain smooth INP scores when filtering large arrays.
 */
const DataFilterDisplaybyStartingLetter = ({ words }) => {
  const [startsWith, setStartsWith] = useState("");
  const [endsWith, setEndsWith] = useState("");
  const [contains, setContains] = useState("");
  const [length, setLength] = useState("");

  const [isPending, startTransition] = useTransition();

  const handleStartsWith = (val) => startTransition(() => setStartsWith(val));
  const handleEndsWith = (val) => startTransition(() => setEndsWith(val));
  const handleContains = (val) => startTransition(() => setContains(val));
  const handleLength = (val) => startTransition(() => setLength(val));

  const wordContent = useMemo(() => {
    return displayWordsByStartingLetter(words, startsWith, endsWith, contains, length);
  }, [words, startsWith, endsWith, contains, length]);

  return (
    <div className="mb-6 relative">
      <AdvancedFilter
        startsWith={startsWith}
        handleStartsWith={handleStartsWith}
        endsWith={endsWith}
        handleEndsWith={setEndsWith}
        contains={contains}
        handleContains={setContains}
        length={length}
        handleLength={handleLength}
      />

      {isPending && (
        <div className="absolute top-0 right-0 p-2 text-[#75c32c] animate-spin">
          <Loader2 size={20} />
        </div>
      )}

      <div className={isPending ? "opacity-60 pointer-events-none transition-opacity duration-200" : "opacity-100 transition-opacity duration-200"}>
        {wordContent}
      </div>
    </div>
  );
};


export default DataFilterDisplaybyStartingLetter;
