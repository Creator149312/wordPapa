import RelLinksonPageBottom from "@components/RelLinksonPageBottom";
import DataFilterDisplay from "@utils/DataFilterDisplay";
import adjectiveWordsSET from "../adjectivewordsSET";
import { ArrowLeft, Palette, Sparkles } from "lucide-react";
import Link from "next/link";

export const revalidate = 2592000; // ✅ Cache full page HTML for 24 hours

export async function generateMetadata({ params }) {
  const word = decodeURIComponent(params.word);
  const toIndex = adjectiveWordsSET.has(word) && /^[a-zA-Z]+$/.test(word);

  const titleStr =
    "Adjective Words to Describe " +
    (word.charAt(0).toUpperCase() + word.slice(1));

  const descriptionStr =
    "Explore list of commonly used adjective words for describing " +
    params.word +
    " in writing.";

  return {
    title: titleStr,
    description: descriptionStr,
    alternates: {
      canonical: `https://words.englishbix.com/adjectives/${word.toLowerCase()}`,
    },
    robots: {
      index: toIndex,
      follow: true,
    },
  };
}

export default async function Page({ params }) {
  const word = decodeURIComponent(params.word);
  const isNotCompound = word.split(" ").length === 1 && /^[a-zA-Z]+$/.test(word);
  let adjectiveWords = [];

  const titleStr =
    "Adjective Words to Describe " +
    (word.charAt(0).toUpperCase() + word.slice(1));

  if (isNotCompound) {
    try {
      // ✅ API-level caching for Datamuse
      const res = await fetch(
        `https://api.datamuse.com/words?rel_jjb=${word}&max=100`,
        { cache: "force-cache" }
      );

      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }

      adjectiveWords = (await res.json()).map((item) => item.word);
    } catch (error) {
      console.error("Error fetching adjectives:", error);
      adjectiveWords = [];
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 min-h-screen">
      {/* Navigation */}
      <Link 
        href="/adjectives" 
        className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#75c32c] transition-colors mb-8 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Adjectives Dictionary
      </Link>

      {/* Header Section */}
      <div className="mb-8 md:mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#75c32c]/10 text-[#75c32c] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          <Palette size={14} /> Description Guide
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
          {titleStr}
        </h1>
        <p className="mt-4 text-base md:text-lg font-medium text-gray-500 dark:text-gray-400 max-w-2xl">
          Explore list of commonly used adjective words for describing <strong>{word}</strong> in writing.
        </p>
      </div>

      <div className="space-y-8">
        {/* Results Section */}
        <section className="p-6 md:p-8 bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-[#75c32c]/5">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 mb-8">
            <div className="bg-[#75c32c] p-2 rounded-lg text-white">
              <Sparkles size={20} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              Following is a list of <strong>{adjectiveWords.length}</strong> adjective words and phrases used for describing <strong>{word}</strong> in writing.
            </p>
          </div>

          <div className="min-h-[300px]">
            <DataFilterDisplay words={adjectiveWords} />
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium italic leading-relaxed">
              With these adjectives you can choose the one that perfectly describes {word} in your writing. Don't be afraid to experiment with various combinations. Try to push the boundaries of your descriptions to elevate it from good to great.
            </p>
          </div>
        </section>

        {adjectiveWords.length > 0 && isNotCompound && (
          <RelLinksonPageBottom word={word} pos={null} />
        )}
      </div>
    </div>
  );
}



