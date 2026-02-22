import AdsUnit from "@components/AdsUnit";
import { BookOpen, Search, Filter, Info } from "lucide-react";

const ptitle = "Thesaurus: Find Synonyms & Antonyms of English Words";

export const metadata = {
  title: ptitle,
  description:
    "WordPapa's Thesaurus is a reference tool that generates synonyms and antonyms for english words and phrases. It assists writers, speakers, and students by finding another words with similar or opposite meanings.",
};

function SimilarWordsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 min-h-screen">
      {/* Header Section */}
      <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#75c32c]/10 text-[#75c32c] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          <BookOpen size={14} /> Writing Assistant
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
          Thesaurus: Find <span className="text-[#75c32c]">Synonyms</span> & Antonyms
        </h1>
      </div>

      <div className="space-y-8">
        {/* Main Concept Card */}
        <section className="p-8 bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-[2.5rem] shadow-2xl shadow-[#75c32c]/5">
          <p className="text-lg md:text-xl font-bold text-gray-700 dark:text-gray-200 leading-relaxed mb-6">
            A thesaurus is like a magical treasure chest for finding synonyms and antonyms of a word! 
            Imagine you're telling a story, and you've used the word <span className="text-[#75c32c]">"happy"</span> a lot. 
            It is your friendly tool that will help you suggest other words with similar meanings, like "joyful," "content," or "cheerful."
          </p>
          <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
            It's not a dictionary that tells you what words mean; instead, it's a guide to finding another word for words or phrases. 
            Just type in a word, and the thesaurus opens up a world of possibilities, making your writing more interesting and colorful.
          </p>
        </section>

        <AdsUnit slot="7782807936" />

        {/* Informational Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-transparent hover:border-[#75c32c]/30 transition-all group">
            <Search className="text-[#75c32c] mb-4 group-hover:scale-110 transition-transform" size={28} />
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Linguistic Companion</h3>
            <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
              Think of it as a versatile synonym generator tool. Whether you're a writer, a crossword enthusiast seeking clues, 
              or a student expanding your vocabulary, this tool helps you explore words that share semantic similarities.
            </p>
          </div>

          <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-transparent hover:border-[#75c32c]/30 transition-all group">
            <Filter className="text-[#75c32c] mb-4 group-hover:scale-110 transition-transform" size={28} />
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Smart Filtering</h3>
            <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
              Using our <span className="font-bold text-gray-800 dark:text-white">"filter results"</span> option, you can sort 
              output based on length, starting, and ending characters—helping content creators find the exact words they need.
            </p>
          </div>
        </div>

        {/* Feature/Note Section */}
        <section className="p-8 border-l-4 border-[#75c32c] bg-[#75c32c]/5 rounded-r-[2rem]">
          <div className="flex items-center gap-2 mb-4 text-[#75c32c]">
            <Info size={20} strokeWidth={3} />
            <span className="font-black uppercase tracking-widest text-xs">Usage Tips</span>
          </div>
          <p className="text-gray-700 dark:text-gray-200 font-bold leading-relaxed mb-4">
            Output results consist of related words, synonyms, and antonyms. 
          </p>
          <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#75c32c]" />
              Click <span className="font-bold text-[#75c32c]">"Only synonyms"</span> for similar words.
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#75c32c]" />
              Click <span className="font-bold text-[#75c32c]">"Only antonyms"</span> for opposite meanings.
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#75c32c]" />
              Click <span className="font-bold text-[#75c32c]">"Related Words"</span> for the full linguistic map.
            </li>
          </ul>
        </section>

        <AdsUnit slot="7782807936" />

        <div className="text-center py-12">
          <p className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tighter mb-4">
            Sparkle & Shine
          </p>
          <p className="max-w-xl mx-auto text-gray-500 dark:text-gray-400 font-medium italic">
            "Thesaurus helps us explore the richness of language and uncover words that resonate with your 
            intended expression. Your perfect linguistic companion."
          </p>
        </div>
      </div>
    </div>
  );
}

export default SimilarWordsPage;

// import AdsUnit from "@components/AdsUnit";
// const ptitle = "Thesaurus: Find Synonyms & Antonyms of English Words";

// export const metadata = {
//   title: ptitle,
//   description:
//     "WordPapa's Thesaurus is a reference tool that generates synonyms and antonyms for english words and phrases. It assists writers, speakers, and students by finding another words with similar or opposite meanings.",
// };

// function SimilarWordsPage() {
//   return (
//     <div className="m-3 p-3">
//       <h1 className="mb-3 text-4xl font-bold">{ptitle}</h1>
//       <p className="mb-6 text-lg font-normal">
//         A thesaurus is like a magical treasure chest for finding
//         synonyms and antonyms of a word! Imagine you're telling a
//         story, and you've used the word "happy" a lot. It is your
//         friendly tool that will help you suggest other words with
//         similar meanings, like "joyful," "content," or "cheerful."
//       </p>
//       <p className="mb-6 text-lg font-normal">
//         It's not a dictionary that tells you what words mean; instead,
//         it's a guide to finding another word for words or phrases.
//         Just type in a word, and the thesaurus opens up a world of
//         possibilities, making your writing more interesting and
//         colorful.
//       </p> <AdsUnit slot='7782807936'/> 
//       <p className="mb-6 text-lg font-normal">
//         It's like having a map to explore a land of words where you
//         can choose the perfect one that fits your story or essay. So,
//         if you want your writing to sparkle and shine, a thesaurus is
//         the magical tool you need!
//       </p>
//       <p className="mb-6 text-lg font-normal">
//         You can think of a thesaurus as a versatile synonym generator
//         tool designed to help users explore and discover words that
//         share semantic similarities with a given input word. Whether
//         you're a writer looking for similar words, a crossword
//         enthusiast seeking clues, or a student expanding your
//         vocabulary, this tool is your perfect linguistic companion.
//       </p>
//       <p className="mb-6 text-lg font-normal">
//         Therefore, Thesaurus is sometimes called a synonym dictionary
//         or dictionary of synonyms. By suggesting list of words with
//         similar meaning it allows users to choose the most suitable
//         word to convey their intended message effectively.
//       </p>
//       <p className="mb-6 text-lg font-normal">
//         <strong>Note:</strong> Output result consits of related words,
//         synonyms and antonyms. You can click "Only synonyms" to see
//         synonym words, click "Only antonyms" to see opposite words,
//         click "Related Words" to see all the related words.
//       </p>
//       <p className="mb-6 text-lg font-normal">
//         Using our "filter results" option you can filter output based
//         on length, starting and ending charcters which futher helps
//         writers, content creators, and language enthusiasts to find
//         extact words they need.
//       </p>
//       <AdsUnit slot='7782807936'/> 
//       <p className="mb-6 text-lg font-normal">
//         Finally, we can say that thesaurus helps us explore the
//         richness of language and uncover words that resonate with your
//         intended expression.
//       </p>
//     </div>
//   );
// }

// export default SimilarWordsPage;
