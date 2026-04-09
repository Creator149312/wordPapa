import Word from "@models/word";
import { Card, CardHeader, CardContent } from "@components/ui/card";
import { WORDMAP } from "../WORDMAP";
import AddToMyListsButton from "@components/AddToMyListsButton";
import { connectMongoDB } from "@lib/mongodb";
import AudioPronunciation from "../AudioPronunciation";
import { BookOpen, Quote, Sparkles } from "lucide-react";
import Link from "next/link";
import EnrichTrigger from "../EnrichTrigger";

export const revalidate = 3600 * 24 * 60; // revalidate every 2 months

let siteURL =
  process.env.NODE_ENV === "production"
    ? "https://words.englishbix.com"
    : "http://localhost:3000";

export async function generateMetadata({ params }) {
  let slug = decodeURIComponent(params.word);
  let word = slug;

  const ifInWordMap = WORDMAP[word.replace(/[ -]/g, "")];
  if (!ifInWordMap) {
    return {
      title: "Try a new word",
      description: "This word is not available in our word map. Please try another.",
      robots: { index: false },
    };
  }

  await connectMongoDB();
  const wordData = await Word.findOne({ word }).lean();

  const titleStr = `${word.toUpperCase()} Definition with Sentence Examples`;
  const descriptionStr = wordData
    ? `Learn the meaning of "${word}" as a ${wordData.entries
        .map((e) => e.pos)
        .join(", ")}. Includes definitions and example sentences.`
    : `Find what does "${word}" mean and see sentence examples using "${word}".`;

  let canonical = `${siteURL}/define/${slug}`;

  return {
    title: titleStr,
    description: descriptionStr,
    alternates: { canonical },
    robots: { index: false },
  };
}

// Utility function to validate single words
function isSingleWord(word) {
  const regex = /^[A-Za-z]+$/; // only alphabetic
  return regex.test(word);
}

// Utility function to validate parsed JSON
function isValidWordData(parsed) {
  if (!parsed || !Array.isArray(parsed.entries)) return false;

  return parsed.entries.every(
    (entry) =>
      entry.definition &&
      typeof entry.definition === "string" &&
      Array.isArray(entry.examples) &&
      entry.examples.length > 0,
  );
}

export default async function DefineWordPage({ params }) {
  await connectMongoDB();
  const decodedWord = decodeURIComponent(params.word);
  const ifInWordMap = WORDMAP[decodedWord.replace(/[ -]/g, "")];

  if (!ifInWordMap) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-4">
        <Card className="border-2 border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 rounded-3xl overflow-hidden">
          <CardContent className="pt-10 pb-10 text-center">
            <h1 className="text-4xl font-black text-red-600 mb-4">{decodedWord}</h1>
            <p className="text-gray-600 dark:text-red-200/60 font-medium">
              This word hasn't joined our dictionary yet. Please try another!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  let wordData = await Word.findOne({ word: decodedWord }).lean();

  // Word not in DB yet — return a placeholder immediately.
  // EnrichTrigger fires /api/words/enrich client-side after hydration,
  // saves the result to DB, then calls router.refresh() to show it.
  // All subsequent visits hit the DB + ISR cache; OpenAI is never called again.
  if (!wordData) {
    wordData = { word: decodedWord, entries: [] };
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      
      {/* Header Section: The "Title Card" */}
      <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-[#75c32c]/5 dark:shadow-none border border-gray-100 dark:border-gray-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-[#75c32c]">
              <Sparkles size={14} />
              Vocabulary Entry
            </span>
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-gray-900 dark:text-white capitalize">
              {decodedWord}
            </h1>
            <div className="flex items-center gap-3 pt-2">
               <AudioPronunciation word={decodedWord} />
               <span className="text-gray-300 dark:text-gray-700">|</span>
               <span className="text-sm font-medium text-gray-500 dark:text-gray-400 italic">
                 {wordData.entries.map(e => e.pos).join(" • ")}
               </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <AddToMyListsButton
              word={decodedWord}
              definition={wordData.entries[0]?.definition}
            />
            {/* <Link
              href={`/define/${decodedWord}/training`}
              className="flex items-center gap-2 px-6 py-3 bg-[#75c32c] hover:bg-[#66aa26] text-white rounded-2xl font-bold shadow-lg shadow-[#75c32c]/30 dark:shadow-none transition-all active:scale-95 group"
            >
              <Dumbbell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Start Training
            </Link> */}
          </div>
        </div>
        
        {/* Decorative background element */}
        <div className="absolute -right-10 -bottom-10 opacity-[0.03] dark:opacity-[0.07] pointer-events-none">
          <BookOpen size={300} strokeWidth={1} color="#75c32c" />
        </div>
      </section>

      {/* Content Section: Definitions & Examples */}
      <div className="grid grid-cols-1 gap-6">
        {wordData.entries.length === 0 ? (
          <>
            <EnrichTrigger word={decodedWord} />
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#75c32c]/10 text-[#75c32c] rounded-full text-xs font-black uppercase tracking-widest animate-pulse">
                <Sparkles size={12} />
                Fetching definition…
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Hang tight — generating the definition for <strong>{decodedWord}</strong> and saving it for next time.
              </p>
            </div>
          </>
        ) : (
          wordData.entries.map((entry, idx) => (
            <div key={idx} className="group bg-white dark:bg-gray-900 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800 hover:border-[#75c32c]/50 dark:hover:border-[#75c32c]/50 transition-colors shadow-sm">
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex items-center justify-center w-12 h-12 bg-[#75c32c]/10 dark:bg-[#75c32c]/20 text-[#75c32c] rounded-xl font-black text-xl italic">
                  {entry.pos[0].toUpperCase()}
                </div>
                <div className="space-y-4 flex-1">
                  <div>
                    <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-bold uppercase tracking-wider mb-2 group-hover:bg-[#75c32c]/10 group-hover:text-[#75c32c] transition-colors">
                      {entry.pos}
                    </span>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 leading-tight">
                      {entry.definition}
                    </h2>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Quote size={16} className="fill-[#75c32c]/30" />
                      <span className="text-xs font-bold uppercase tracking-widest text-[#75c32c]/60">Example Sentences</span>
                    </div>
                    <div className="grid gap-3">
                      {entry.examples.map((sent, i) => (
                        <div key={i} className="relative p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-transparent group-hover:border-[#75c32c]/10 transition-all">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                            "{sent}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom CTA */}
      {/* <section className="text-center py-10">
          <p className="text-gray-400 text-sm font-medium mb-4 uppercase tracking-widest">Ready to master this word?</p>
          <Link
            href={`/define/${decodedWord}/training`}
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#75c32c] text-white rounded-[2rem] font-black text-lg hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-[#75c32c]/30"
          >
            Practice Now
          </Link>
      </section> */}
    </div>
  );
}