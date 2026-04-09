import AdsUnit from "@components/AdsUnit";
import { BookOpen, ArrowRight } from "lucide-react";

export async function generateMetadata() {
  return {
    title: `List of All English Words`,
    description: `Browse the Ultimate list of 150000+ English words in alphabetically sorted order which are commonly used in English language.`,
  };
}

const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));

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

const Page = async () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 min-h-screen">
      {/* Header */}
      <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#75c32c]/10 text-[#75c32c] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          <BookOpen size={14} /> Word Explorer
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
          All English <span className="text-[#75c32c]">Words</span>: Complete A–Z List
        </h1>
      </div>

      <div className="space-y-10">
        {/* Intro */}
        <section className="p-8 bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-[2.5rem] shadow-2xl shadow-[#75c32c]/5">
          <p className="text-lg font-bold text-gray-700 dark:text-gray-200 leading-relaxed">
            Explore <span className="text-[#75c32c]">150,000+ English words</span> — from everyday vocabulary to rare gems and specialized terminology. Find new words and discover ones you've never seen before.
          </p>
        </section>

        <AdsUnit slot="7782807936" />

        {/* A–Z by Letter */}
        <section className="p-8 bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-[2.5rem]">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Words Starting With</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6">
            Sorted lists of English words from A to Z — each starting with a specific letter.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {letters.map((l) => (
              <LinkChip key={l} href={`/browse/words/${l}`} label={`Letter ${l.toUpperCase()} Words`} />
            ))}
          </div>
        </section>

        <AdsUnit slot="7782807936" />

        {/* Ending by letter */}
        <section className="p-8 bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-[2.5rem]">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Words Ending With</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6">
            Browse all words ending in a specific letter — great for word games, crosswords, and rhyming.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {letters.map((l) => (
              <LinkChip key={l} href={`/browse/words/end/${l}`} label={`Words ending in "${l}"`} />
            ))}
          </div>
        </section>

        <AdsUnit slot="7782807936" />

        <p className="text-xs text-gray-400 dark:text-gray-600 font-medium px-2">
          <strong>Note:</strong> An exhaustive list of all English words is near-impossible due to the language's constant evolution, slang, technical terms, and regional variations. This list strives to be as comprehensive as possible.
        </p>
      </div>
    </div>
  );
};

export default Page;
