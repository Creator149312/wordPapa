import DataFilterDisplay from "@utils/DataFilterDisplay";
import RelLinksonPageBottom from "@components/RelLinksonPageBottom";
import rhymingWordsSET from "../rhyming-wordsSET";
import { ArrowLeft, Music2, Sparkles } from "lucide-react";
import Link from "next/link";

export const revalidate = 2592000; // ✅ Cache full page HTML for 24 hours

export async function generateMetadata({ params }) {
  const word = decodeURIComponent(params.word);
  const toIndex = rhymingWordsSET.has(word) && /^[a-zA-Z]+$/.test(word);

  const titleStr =
    "Rhyming Words and Phrases for " +
    (word.charAt(0).toUpperCase() + word.slice(1));

  const descriptionStr =
    "Explore list of common words that rhyme with " +
    params.word +
    " to use in creative writing and poetry.";

  return {
    title: titleStr,
    description: descriptionStr,
    alternates: {
      canonical: `https://words.englishbix.com/rhyming-words/${word.toLowerCase()}`,
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
  let rhymingWords = [];
  let similarSoundingWords = [];

  const titleStr =
    "Rhyming Words and Phrases for " +
    (word.charAt(0).toUpperCase() + word.slice(1));

  if (isNotCompound) {
    try {
      // ✅ API-level caching for rhyming words
      const res = await fetch(
        `https://api.datamuse.com/words?rel_rhy=${word}&max=100`,
        { cache: "force-cache" }
      );

      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }

      rhymingWords = (await res.json()).map((item) => item.word);

      // If no rhyming words, fetch similar sounding words
      if (rhymingWords.length <= 0) {
        const SSres = await fetch(
          `https://api.datamuse.com/words?sl=${word}&max=50`,
          { cache: "force-cache" }
        );

        if (!SSres.ok) {
          throw new Error(`API request failed with status ${SSres.status}`);
        }

        similarSoundingWords = (await SSres.json()).map((item) => item.word);
      }
    } catch (error) {
      console.error("Error fetching rhyming/similar words:", error);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 min-h-screen">
      {/* Navigation */}
      <Link 
        href="/rhyming-words" 
        className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#75c32c] transition-colors mb-8 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Rhyming Dictionary
      </Link>

      {/* Header Section */}
      <div className="mb-8 md:mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#75c32c]/10 text-[#75c32c] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          <Music2 size={14} /> Rhyme Guide
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
          {titleStr}
        </h1>
        <p className="mt-4 text-base md:text-lg font-medium text-gray-500 dark:text-gray-400 max-w-2xl">
          Following is a list of {rhymingWords.length} words and phrases that rhyme with {word}:
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
              With all these rhyming words at your disposal, you'll surely find the perfect word to match with {word} in your writing.
            </p>
          </div>

          <div className="min-h-[300px]">
            {rhymingWords.length > 0 ? (
              <DataFilterDisplay words={rhymingWords} />
            ) : (
              <div className="space-y-8">
                {similarSoundingWords.length > 0 && (
                  <div className="space-y-6">
                    <div className="p-6 bg-yellow-50/50 dark:bg-yellow-900/10 rounded-2xl border border-yellow-100 dark:border-yellow-900/20">
                       <h2 className="text-xl md:text-2xl font-black text-gray-800 dark:text-white flex items-center gap-2">
                        Words that Sound Similar to {word}
                      </h2>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
                        If you are not fully satisfied with rhyming words, you can pick from the words that sound similar to {word}.
                      </p>
                    </div>
                    <DataFilterDisplay words={similarSoundingWords} />
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {rhymingWords.length > 0 && isNotCompound && (
          <RelLinksonPageBottom word={word} pos={null} />
        )}
      </div>
    </div>
  );
}


