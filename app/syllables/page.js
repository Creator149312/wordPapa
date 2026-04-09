import MostSearchedWordsList from "@components/MostSearchedWordsList";
import SyllableFinder from "./SyllableFinder";
import commonLinks from "@utils/commonLinks";
import AdsUnit from "@components/AdsUnit";
import { Hash, NotebookPen, Languages, Sparkles } from "lucide-react";

export const metadata = {
  title: "Syllable Counter: Check Number of Syllables in Word",
  description:
    "Our Syllable Counter is a tool to count number of syllables in a word or sentence, by identifying vowel sounds and syllable boundaries within a text.",
};

const mostSearchedWordsList = [
  "very", "music", "reading", "family", "teacher", "telemarketing", "ladybug"
];

function SyllableCounterPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 min-h-screen">
      {/* Header */}
      <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#75c32c]/10 text-[#75c32c] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          <Hash size={14} /> Phonetics
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
          Syllable <span className="text-[#75c32c]">Counter</span>: Count Word Syllables
        </h1>
      </div>

      <div className="space-y-8">
        {/* Tool — most important, shown first */}
        <section className="p-8 bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-[2.5rem] shadow-2xl shadow-[#75c32c]/5">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 mb-6">
            <div className="bg-[#75c32c] p-2 rounded-lg text-white shrink-0">
              <Sparkles size={20} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              Type any word or sentence below to instantly count its syllables — useful for poetry, haiku, phonics practice, and language learning.
            </p>
          </div>
          <SyllableFinder />
        </section>

        {/* Intro */}
        <section className="p-8 bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-[2.5rem]">
          <p className="text-lg md:text-xl font-bold text-gray-700 dark:text-gray-200 leading-relaxed">
            The <span className="text-[#75c32c]">Syllable Counter</span> analyzes the phonetic structure of words — vowel combinations, consonant clusters, and stress patterns — to accurately determine syllable counts for any input.
          </p>
        </section>

        <AdsUnit slot="7782807936" />

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-[2rem] border-2 border-transparent hover:border-[#75c32c]/20 transition-all group">
            <NotebookPen className="text-[#75c32c] mb-4 group-hover:scale-110 transition-transform" size={28} />
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Poetry Writing</h3>
            <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
              Create rhythmic compositions like haikus, sonnets, and limericks with precise syllable counts for every line.
            </p>
          </div>

          <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-[2rem] border-2 border-transparent hover:border-[#75c32c]/20 transition-all group">
            <Hash className="text-[#75c32c] mb-4 group-hover:scale-110 transition-transform" size={28} />
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Phonics &amp; Spelling</h3>
            <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
              Teachers use syllable counters to teach phonetics, spelling, and word recognition — making language patterns visible and intuitive.
            </p>
          </div>

          <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-[2rem] border-2 border-transparent hover:border-[#75c32c]/20 transition-all group">
            <Languages className="text-[#75c32c] mb-4 group-hover:scale-110 transition-transform" size={28} />
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Language Learning</h3>
            <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
              Understand how English words are broken into syllable units — an essential skill for pronunciation and reading fluency.
            </p>
          </div>
        </div>

        <AdsUnit slot="7782807936" />

        {/* Browse section */}
        <div className="mt-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-[2px] flex-grow bg-gray-100 dark:bg-gray-800" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 shrink-0">
              Popular Syllable Searches
            </span>
            <div className="h-[2px] flex-grow bg-gray-100 dark:bg-gray-800" />
          </div>
          <div className="bg-white dark:bg-transparent p-2 rounded-3xl">
            <MostSearchedWordsList
              wordList={mostSearchedWordsList}
              preText={"count syllables in "}
              postText={""}
              slug={commonLinks.syllables}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SyllableCounterPage;
