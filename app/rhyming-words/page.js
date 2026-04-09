import MostSearchedWordsList from "@components/MostSearchedWordsList";
import commonLinks from "@utils/commonLinks";
import AdsUnit from "@components/AdsUnit";
import { Music2, SlidersHorizontal, GraduationCap, Sparkles } from "lucide-react";

/**
 * In future : we'll create another tool called AI Rhymes Generator which will generate poems, songs and lyrics 
 */
const ptitle = "Rhyming Dictionary: Find Rhyming Words of a Word";

const mostSearchedWordsList = [
  "you", "me", "love", "time", "life", "day", "heart", "home",
  "tree", "word", "sky", "bed", "world", "friend", "up", "back",
  "with", "free", "top", "run", "bob", "eleven"
];

export const metadata = {
  title: ptitle,
  description:
    "Use Rhyming Dictionary to find delightful array of words and phrases that rhyme with your word. Use it craft engaging poems, songs, and activities that inspire kids to discover the beauty of language.",
};

function RhymingWordsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 min-h-screen">
      {/* Header */}
      <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#75c32c]/10 text-[#75c32c] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          <Music2 size={14} /> Poetry &amp; Lyrics
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
          Rhyming <span className="text-[#75c32c]">Dictionary</span>: Find Perfect Rhymes
        </h1>
      </div>

      <div className="space-y-8">
        {/* Intro */}
        <section className="p-8 bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-[2.5rem] shadow-2xl shadow-[#75c32c]/5">
          <p className="text-lg md:text-xl font-bold text-gray-700 dark:text-gray-200 leading-relaxed mb-6">
            A rhyming dictionary is a vital tool for <span className="text-[#75c32c]">poets, lyricists, and rappers</span> — helping you find words that share similar end sounds to craft rhythm and musicality in your writing.
          </p>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
            <div className="bg-[#75c32c] p-2 rounded-lg text-white shrink-0">
              <Sparkles size={20} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              Select <strong>"Find Rhyming Words"</strong> from the dropdown, input your word, and instantly get a curated list organized by letter and syllable count — including near rhymes for creative flexibility.
            </p>
          </div>
        </section>

        <AdsUnit slot="7782807936" />

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-[2rem] border-2 border-transparent hover:border-[#75c32c]/20 transition-all group">
            <Music2 className="text-[#75c32c] mb-4 group-hover:scale-110 transition-transform" size={28} />
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Poets &amp; Songwriters</h3>
            <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
              Elevate your verse with exact and near rhymes, giving your lyrics the perfect beat and flow for any style.
            </p>
          </div>

          <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-[2rem] border-2 border-transparent hover:border-[#75c32c]/20 transition-all group">
            <SlidersHorizontal className="text-[#75c32c] mb-4 group-hover:scale-110 transition-transform" size={28} />
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Powerful Filters</h3>
            <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
              Refine results by prefix, suffix, or substring — quickly narrow down to rhymes that match your exact structural needs.
            </p>
          </div>

          <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-[2rem] border-2 border-transparent hover:border-[#75c32c]/20 transition-all group">
            <GraduationCap className="text-[#75c32c] mb-4 group-hover:scale-110 transition-transform" size={28} />
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">For Students</h3>
            <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
              Teachers use the rhyming dictionary to make phonics and creative writing lessons exciting, connecting learning with imagination.
            </p>
          </div>
        </div>

        <AdsUnit slot="7782807936" />

        {/* Browse section */}
        <div className="mt-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-[2px] flex-grow bg-gray-100 dark:bg-gray-800" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 shrink-0">
              Popular Rhyme Searches
            </span>
            <div className="h-[2px] flex-grow bg-gray-100 dark:bg-gray-800" />
          </div>
          <div className="bg-white dark:bg-transparent p-2 rounded-3xl">
            <MostSearchedWordsList
              wordList={mostSearchedWordsList}
              preText={"words that rhyme with "}
              postText={""}
              slug={commonLinks.rhyming}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RhymingWordsPage;
