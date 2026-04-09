import AdsUnit from "@components/AdsUnit";
import { BookOpen, ScanText, MessageSquareText, Sparkles } from "lucide-react";

const ptitle = "Word Dictionary: Find Definition & Meanings of English Words";

export const metadata = {
  title: ptitle,
  description:
    "This simple word dictionary provides a simple and intuitive interface for users to look up the definitions of words or phrases and access example sentences.",
};

function WordsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 min-h-screen">
      {/* Header */}
      <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#75c32c]/10 text-[#75c32c] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          <BookOpen size={14} /> Word Tools
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
          Word <span className="text-[#75c32c]">Dictionary</span>: Meanings & More
        </h1>
      </div>

      <div className="space-y-8">
        {/* Intro */}
        <section className="p-8 bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-[2.5rem] shadow-2xl shadow-[#75c32c]/5">
          <p className="text-lg md:text-xl font-bold text-gray-700 dark:text-gray-200 leading-relaxed mb-6">
            Enter any English word and instantly unlock its <span className="text-[#75c32c]">definition</span>, part of speech, and real-world sentence examples — your complete vocabulary companion.
          </p>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
            <div className="bg-[#75c32c] p-2 rounded-lg text-white shrink-0">
              <Sparkles size={20} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              Search any word — from everyday nouns like <strong>"elephant"</strong> to complex verbs — and get clear, structured results suitable for students, writers, and language learners.
            </p>
          </div>
        </section>

        <AdsUnit slot="7782807936" />

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-[2rem] border-2 border-transparent hover:border-[#75c32c]/20 transition-all group">
            <BookOpen className="text-[#75c32c] mb-4 group-hover:scale-110 transition-transform" size={28} />
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Definitions</h3>
            <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
              Clear, concise meanings pulled from a comprehensive English lexicon — no jargon, just plain understanding.
            </p>
          </div>

          <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-[2rem] border-2 border-transparent hover:border-[#75c32c]/20 transition-all group">
            <ScanText className="text-[#75c32c] mb-4 group-hover:scale-110 transition-transform" size={28} />
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Parts of Speech</h3>
            <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
              Discover whether a word is a noun, verb, adjective, adverb, and understand how it functions in a sentence.
            </p>
          </div>

          <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-[2rem] border-2 border-transparent hover:border-[#75c32c]/20 transition-all group">
            <MessageSquareText className="text-[#75c32c] mb-4 group-hover:scale-110 transition-transform" size={28} />
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Sentence Examples</h3>
            <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
              See words in action with real-life example sentences that show exactly how to use them naturally.
            </p>
          </div>
        </div>

        <AdsUnit slot="7782807936" />

        {/* Usage note */}
        <section className="p-8 bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-[2.5rem]">
          <h2 className="text-xl font-black text-gray-800 dark:text-white mb-4">Who is it for?</h2>
          <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
            The Word Dictionary is designed for <strong className="text-gray-800 dark:text-white">students</strong> building vocabulary, <strong className="text-gray-800 dark:text-white">writers</strong> seeking precise word choices, and <strong className="text-gray-800 dark:text-white">language learners</strong> looking to deepen their understanding of English. The clean interface makes it easy to search and explore without distraction.
          </p>
        </section>
      </div>
    </div>
  );
}

export default WordsPage;
