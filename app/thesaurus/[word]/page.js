import RelLinksonPageBottom from "@components/RelLinksonPageBottom";
import ToggleView from "../ToggleView";
import synonymWordsSET from "../synonym-wordsSET";
import synonymWordsArray from "../synonym-words";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";

export const revalidate = 2592000; // ✅ Cache full page HTML

// ✅ Pre-generate pages to save Vercel execution budget
export async function generateStaticParams() {
  // Return the first 2000 words to pre-render (to keep build times reasonable)
  // The rest will be generated on-demand and cached via ISR
  return synonymWordsArray.slice(0, 2000).map((word) => ({
    word: word.replace(/ /g, "-"),
  }));
}

// Metadata stays the same — no change needed for caching
export async function generateMetadata({ params }) {
  let word = decodeURIComponent(params.word);
  const toIndex = synonymWordsSET.has(word) && /^[a-zA-Z ]+$/.test(word);

  word = word.replace(/-/g, " ");
  const titleStr =
    "Synonyms and Antonyms for " +
    (word.charAt(0).toUpperCase() + word.slice(1));

  const descriptionStr =
    "Explore an extensive list of synonyms and antonyms for " +
    params.word +
    " and choose another word that suits you the best for your writing";

  return {
    title: titleStr,
    description: descriptionStr,
    alternates: {
      canonical: `https://words.englishbix.com/thesaurus/${params.word.toLowerCase()}`,
    },
    robots: {
      index: toIndex,
      follow: true,
    },
  };
}

export default async function Page({ params }) {
  const word = decodeURIComponent(params.word).replace(/-/g, " ");
  const titleStr =
    "Synonyms and Antonyms for " +
    (word.charAt(0).toUpperCase() + word.slice(1));

  let AllRelatedWords = [];
  let synonymWords = [];
  let antonymWords = [];

  try {
    // ✅ Fetch both in parallel with API-level caching
    const [syndata, antdata] = await Promise.all([
      fetch(`https://api.datamuse.com/words?ml=${word}&max=100`, {
        cache: "force-cache",
      }).then((res) => res.json()),
      fetch(`https://api.datamuse.com/words?rel_ant=${word}`, {
        cache: "force-cache",
      }).then((res) => res.json()),
    ]);

    AllRelatedWords = syndata.map((item) => item.word);
    synonymWords = syndata
      .filter((obj) => obj.tags?.includes("syn"))
      .map((item) => item.word);
    antonymWords = antdata.map((item) => item.word);
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 min-h-screen">
      {/* Navigation */}
      <Link 
        href="/thesaurus" 
        className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#75c32c] transition-colors mb-8 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Thesaurus home
      </Link>

      {/* Header Section */}
      <div className="mb-8 md:mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#75c32c]/10 text-[#75c32c] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          <BookOpen size={14} /> Synonym Explorer
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
          {titleStr}
        </h1>
        <p className="mt-4 text-base md:text-lg font-medium text-gray-500 dark:text-gray-400 max-w-2xl">
          Following is a list of {AllRelatedWords.length} synonym words and
          phrases that are related to <strong>{word}</strong>:
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
              Using this list of similar-meaning words, you can choose the best synonyms to replace <strong>{word}</strong> in your sentences. Additionally, you'll find antonyms included, perfect for when you need the complete opposite meaning of <strong>{word}</strong> in your writing.
            </p>
          </div>

          <div className="min-h-[400px]">
            <ToggleView
              allWords={AllRelatedWords}
              synWords={synonymWords}
              antWords={antonymWords}
            />
          </div>
        </section>

        {AllRelatedWords.length > 0 && (
          <RelLinksonPageBottom word={word} pos={null} />
        )}
      </div>
    </div>
  );
}

