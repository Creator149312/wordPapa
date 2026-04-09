import { PHRASALVERBS } from "./PHRASALVERBS";
import Link from "next/link";
import commonLinks from "@utils/commonLinks";
import DataFilterDisplay from "@utils/DataFilterDisplay";
import AdsUnit from "@components/AdsUnit";
import { BookMarked, ListFilter, TrendingUp, Sparkles } from "lucide-react";

export const revalidate = 2592000; // ✅ Cache full page HTML for 24 hours

export async function generateMetadata() {
  return {
    title: `Phrasal Verbs List: A to Z Dictionary`,
    description: `Use Phrasal Verbs Dictionary to browse the list of 8000+ phrasal verbs in English from A to Z and find the multi-word verb you are looking for.`,
  };
}

const Page = async () => {
  function customLink(word) {
    const wordWithHyphens = word.toLowerCase().replace(/ /g, "-");
    const slug = commonLinks.definition + wordWithHyphens;
    return (
      <Link href={slug} target="_blank" rel="noopener noreferrer">
        {word}
      </Link>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 min-h-screen">
      {/* Header */}
      <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#75c32c]/10 text-[#75c32c] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          <BookMarked size={14} /> Grammar
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
          Phrasal Verbs <span className="text-[#75c32c]">Dictionary</span>: A to Z List
        </h1>
      </div>

      <div className="space-y-8">
        {/* Intro */}
        <section className="p-8 bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-[2.5rem] shadow-2xl shadow-[#75c32c]/5">
          <p className="text-lg md:text-xl font-bold text-gray-700 dark:text-gray-200 leading-relaxed mb-6">
            Browse <span className="text-[#75c32c]">8000+ phrasal verbs</span> meticulously organized from A to Z — your complete interactive companion for mastering multi-word verbs in English.
          </p>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
            <div className="bg-[#75c32c] p-2 rounded-lg text-white shrink-0">
              <Sparkles size={20} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              Use the <strong>"Filter Results"</strong> option below to instantly pinpoint the phrasal verb you need — designed for beginners taking first steps and advanced learners refining fluency alike.
            </p>
          </div>
        </section>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-[2rem] border-2 border-transparent hover:border-[#75c32c]/20 transition-all group">
            <BookMarked className="text-[#75c32c] mb-4 group-hover:scale-110 transition-transform" size={28} />
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">8000+ Entries</h3>
            <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
              Common and uncommon phrasal verbs covering all levels — from everyday expressions to advanced idiomatic usage.
            </p>
          </div>

          <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-[2rem] border-2 border-transparent hover:border-[#75c32c]/20 transition-all group">
            <ListFilter className="text-[#75c32c] mb-4 group-hover:scale-110 transition-transform" size={28} />
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Smart Filter</h3>
            <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
              Instantly filter by letter or keyword to pinpoint the exact multi-word verb you're looking for without scrolling.
            </p>
          </div>

          <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-[2rem] border-2 border-transparent hover:border-[#75c32c]/20 transition-all group">
            <TrendingUp className="text-[#75c32c] mb-4 group-hover:scale-110 transition-transform" size={28} />
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Build Fluency</h3>
            <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
              Incorporating phrasal verbs into everyday conversation makes your English sound natural and confident to native speakers.
            </p>
          </div>
        </div>

        {/* The main A–Z tool */}
        <section className="p-8 bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-[2.5rem]">
          <DataFilterDisplay words={Object.keys(PHRASALVERBS)} />
        </section>

        <AdsUnit slot="7782807936" />

        {/* Note */}
        <section className="p-6 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
            <strong className="text-gray-700 dark:text-gray-200">Note: </strong>
            The term "Group Verbs" is not widely used in standard grammar. It may be a less formal reference to phrasal verbs. Stick with "phrasal verbs" for these verb combinations in academic or professional writing.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Page;
