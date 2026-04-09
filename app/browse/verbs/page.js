import AdsUnit from "@components/AdsUnit";
import { Zap, ArrowRight } from "lucide-react";

export async function generateMetadata() {
  return {
    title: `Verb Dictionary: List of All Verbs in English`,
    description: `Browse Verb Dictionary of 11000+ verbs which are commonly used in English language to describe positive and negative actions of a person, place or thing.`,
  };
}

const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));
const verbEndingSuffixes = ["ed", "ch", "sh", "e", "s", "y", "x", "o", "z", "ee", "d", "en", "es", "ie", "ss", "ing", "ir"];

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
          <Zap size={14} /> Action Words
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
          Verb <span className="text-[#75c32c]">Dictionary</span>: All Verbs A–Z
        </h1>
      </div>

      <div className="space-y-10">
        {/* Intro */}
        <section className="p-8 bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-[2.5rem] shadow-2xl shadow-[#75c32c]/5">
          <p className="text-lg font-bold text-gray-700 dark:text-gray-200 leading-relaxed">
            Browse <span className="text-[#75c32c]">11,000+ verbs</span> in English — action words and states of being that breathe life into your sentences. From "help" and "win" to "struggle" and "wonder".
          </p>
        </section>

        <AdsUnit slot="7782807936" />

        {/* A–Z by Letter */}
        <section className="p-8 bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-[2.5rem]">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Verbs Starting With</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6">
            Alphabetically sorted verb lists — each starting with a specific letter.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {letters.map((l) => (
              <LinkChip key={l} href={`/browse/verbs/${l}`} label={`Letter ${l.toUpperCase()} Verbs`} />
            ))}
            <LinkChip href="/browse/verbs/re" label='Verbs starting with "re"' />
          </div>
        </section>

        <AdsUnit slot="7782807936" />

        {/* Ending patterns */}
        <section className="p-8 bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-[2.5rem]">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Verbs Ending With</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6">
            Common verb endings — useful for understanding tense patterns and conjugation rules.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {verbEndingSuffixes.map((s) => (
              <LinkChip key={s} href={`/browse/verbs/end/${s}`} label={`Verbs ending in "${s}"`} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Page;
