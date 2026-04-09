import AdsUnit from "@components/AdsUnit";
import { Palette, ArrowRight } from "lucide-react";

export async function generateMetadata() {
  return {
    title: `Adjective Dictionary: List of All Adjectives in English`,
    description: `Browse the Ultimate Adjective Dictionary of 21000+ adjective words in alphabetically sorted order which are commonly used in English language to describe person, place or thing.`,
  };
}

const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));
const specialPrefixes = ["al", "th", "un", "in", "ch", "ab", "de", "gr"];
const endingSuffixes = ["y", "ly", "ful", "less", "e", "a", "al", "er"];

function LinkChip({ href, label }) {
  return (
    <a
      href={href}
      className="group flex items-center justify-between gap-2 px-4 py-3 bg-white dark:bg-[#111] border-2 border-gray-100 dark:border-gray-800 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:border-[#75c32c]/50 hover:text-[#75c32c] hover:shadow-md hover:shadow-[#75c32c]/5 transition-all duration-200"
    >
      <span>{label}</span>
      <ArrowRight size={13} className="text-gray-300 dark:text-gray-600 group-hover:text-[#75c32c] group-hover:translate-x-0.5 transition-all shrink-0" />
    </a>
  );
}

function SectionDivider({ label }) {
  return (
    <div className="flex items-center gap-3 my-2">
      <div className="h-[2px] flex-grow bg-gray-100 dark:bg-gray-800" />
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 shrink-0">{label}</span>
      <div className="h-[2px] flex-grow bg-gray-100 dark:bg-gray-800" />
    </div>
  );
}

const Page = async () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 min-h-screen">
      {/* Header */}
      <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#75c32c]/10 text-[#75c32c] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          <Palette size={14} /> Describing Words
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
          Adjective <span className="text-[#75c32c]">Dictionary</span>: All Adjectives A–Z
        </h1>
      </div>

      <div className="space-y-10">
        {/* Intro */}
        <section className="p-8 bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-[2.5rem] shadow-2xl shadow-[#75c32c]/5">
          <p className="text-lg font-bold text-gray-700 dark:text-gray-200 leading-relaxed">
            Browse <span className="text-[#75c32c]">21,000+ adjectives</span> in English — describing words that capture how things look, feel, sound, and act. Organized by starting letter and ending pattern for quick access.
          </p>
        </section>

        <AdsUnit slot="7782807936" />

        {/* A–Z by Letter */}
        <section className="p-8 bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-[2.5rem]">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Adjectives Starting With</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6">
            Sorted lists of adjectives from A to Z, each starting with a specific letter.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {letters.map((l) => (
              <LinkChip key={l} href={`/browse/adjectives/${l}`} label={`Letter ${l.toUpperCase()} Adjectives`} />
            ))}
          </div>

          <SectionDivider label="Popular Prefixes" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {specialPrefixes.map((p) => (
              <LinkChip key={p} href={`/browse/adjectives/${p}`} label={`Adjectives with "${p}"`} />
            ))}
          </div>
        </section>

        <AdsUnit slot="7782807936" />

        {/* Ending patterns */}
        <section className="p-8 bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-[2.5rem]">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Adjectives Ending With</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6">
            Common adjective suffixes — great for understanding how describing words are formed.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {endingSuffixes.map((s) => (
              <LinkChip key={s} href={`/browse/adjectives/end/${s}`} label={`Adjectives ending in "${s}"`} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Page;
