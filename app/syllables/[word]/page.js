import syllableWordsSET from "../syllable-wordsSET";
import { ArrowLeft, Hash, Info } from "lucide-react";
import Link from "next/link";

export const revalidate = 2592000; // ✅ Cache full page HTML

export async function generateMetadata({ params }) {
  const word = decodeURIComponent(params.word);
  const toIndex = syllableWordsSET.has(word) && /^[a-zA-Z]+$/.test(word);

  const titleStr =
    "How many syllables in " +
    (word.charAt(0).toUpperCase() + word.slice(1)) +
    "?";

  const descriptionStr =
    "Check how many syllables are in " +
    params.word +
    " and learn to divide " +
    params.word +
    " into syllables.";

  return {
    title: titleStr,
    description: descriptionStr,
    alternates: {
      canonical: `https://words.englishbix.com/syllables/${word.toLowerCase()}`,
    },
    robots: {
      index: toIndex,
      follow: true,
    },
  };
}

export default async function Page({ params }) {
  const word = decodeURIComponent(params.word);
  const titleStr =
    "How many syllables in " +
    (word.charAt(0).toUpperCase() + word.slice(1)) +
    "?";

  let syllableWords;

  try {
    const endpoint = `https://api.datamuse.com/words?sp=${word}&qe=sp&md=sr&max=1&ipa=1`;

    // ✅ API-level caching
    const res = await fetch(endpoint, { cache: "force-cache" });

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const data = await res.json();
    syllableWords = data[0];
  } catch (error) {
    console.error("Error fetching syllable data:", error);

    // Fallback data
    syllableWords = {
      word: word,
      score: 100001,
      numSyllables: 0,
      tags: ["query", "pron: ", "ipa_pron: "],
    };
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 min-h-screen">
      {/* Navigation */}
      <Link 
        href="/syllables" 
        className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#75c32c] transition-colors mb-8 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Syllable Counter
      </Link>

      {/* Header Section */}
      <div className="mb-8 md:mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#75c32c]/10 text-[#75c32c] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          <Hash size={14} /> Phonetic Analysis
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
          {titleStr}
        </h1>
        <p className="mt-4 text-base md:text-lg font-medium text-gray-500 dark:text-gray-400 max-w-2xl">
          Check how many syllables are in <strong>{word}</strong> and learn to divide <strong>{word}</strong> into syllables.
        </p>
      </div>

      <div className="space-y-8">
        {/* Results Card */}
        <section className="bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-[#75c32c]/5 overflow-hidden">
          <div className="p-6 md:p-8 space-y-8">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between pb-8 border-b border-gray-100 dark:border-gray-800">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Analysed Word</span>
                <h2 className="text-4xl font-black text-[#75c32c] capitalize">{word}</h2>
              </div>
              <div className="bg-[#75c32c]/10 px-6 py-4 rounded-2xl border border-[#75c32c]/20 text-center min-w-[140px]">
                <span className="block text-[10px] font-black uppercase tracking-widest text-[#75c32c] mb-1">Syllables</span>
                <span className="text-4xl font-black text-[#75c32c]">{syllableWords.numSyllables}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <Info size={14} strokeWidth={3} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">ARPAnet Pronunciation</span>
                </div>
                <p className="text-lg font-bold text-gray-700 dark:text-gray-200">
                  {syllableWords.tags[syllableWords.tags.length - 2]?.split(":")[1] || "N/A"}
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <Info size={14} strokeWidth={3} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">IPA Notation</span>
                </div>
                <p className="text-lg font-bold text-gray-700 dark:text-gray-200">
                  {syllableWords.tags[syllableWords.tags.length - 1]?.split(":")[1] || "N/A"}
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-2 md:col-span-2 text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-1">Character Count</span>
                <p className="text-2xl font-black text-gray-800 dark:text-white uppercase">{word.length} Letters</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

