import Word from "@models/word";
import { Card, CardHeader, CardContent } from "@components/ui/card";
import { WORDMAP } from "../WORDMAP";
import AddToMyListsButton from "@components/AddToMyListsButton";
import { connectMongoDB } from "@lib/mongodb";
import AudioPronunciation from "../AudioPronunciation";
import { BookOpen, Quote, Sparkles, UserRound } from "lucide-react";
import Link from "next/link";
import EnrichTrigger from "../EnrichTrigger";
import AdsUnit from "@components/AdsUnit";
import { cache } from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";

export const revalidate = 3600 * 24 * 60; // revalidate every 2 months

let siteURL =
  process.env.NODE_ENV === "production"
    ? "https://words.englishbix.com"
    : "http://localhost:3000";

// ✅ Deduplicate DB calls: Shared between metadata and page component
const getWordData = cache(async (word) => {
  await connectMongoDB();
  return await Word.findOne({ word: word.toLowerCase() }).lean();
});

// ✅ Pre-generate 5,000 pages to save Vercel execution budget
// The rest will be generated on-demand and cached via ISR
export async function generateStaticParams() {
  // Use a Set to ensure unique display words
  const uniqueWords = Array.from(new Set(Object.values(WORDMAP)));
  
  // Pick 5,000 clean single words for static generation
  return uniqueWords
    .filter(word => /^[A-Za-z]+$/.test(word))
    .slice(0, 5000)
    .map((word) => ({
      word: word.toLowerCase(),
    }));
}

// Utility function to normalize slugs for lookup
// This handles: spaces -> hyphens, trailing punctuation, and casing
function getNormalizedWord(slug) {
  if (!slug) return "";
  
  // 1. Basic cleaning: decode, lowercase, and trim trailing punctuation like ! or ?
  let word = decodeURIComponent(slug)
    .toLowerCase()
    .replace(/[!?.]+$/, "") // Remove trailing punctuation for the lookup
    .trim();

  // 2. Check WORDMAP with variations
  // Variation A: Exact match
  if (WORDMAP[word]) return word;
  
  // Variation B: Remove all spaces and hyphens (standard for your WORDMAP)
  let cleanKey = word.replace(/[ -]/g, "");
  if (WORDMAP[cleanKey]) return cleanKey;

  // Variation C: Handle apostrophes (e.g., o-clock -> o'clock)
  // If the word contains a hyphen where an apostrophe might be
  let withApostrophe = word.replace(/-/g, "'");
  if (WORDMAP[withApostrophe]) return withApostrophe;
  
  // Return the best guess if no match
  return word;
}

export async function generateMetadata({ params }) {
  const rawSlug = params.word;
  const word = getNormalizedWord(rawSlug);
  const ifInWordMap = WORDMAP[word.replace(/[ -]/g, "")] || WORDMAP[word];

  const displayWord = ifInWordMap || word; 
  const wordData = await getWordData(displayWord);

  const titleStr = `${displayWord.toUpperCase()} Definition with Sentence Examples`;
  const descriptionStr = wordData
    ? `Learn the meaning of "${displayWord}" as a ${wordData.entries
        .map((e) => e.pos)
        .join(", ")}. Includes definitions and example sentences.`
    : `Find what does "${displayWord}" mean and see sentence examples using "${displayWord}".`;

  // Always point canonical to a clean, hyphenated version
  let canonicalSlug = displayWord.toLowerCase().replace(/ /g, "-");
  let canonical = `${siteURL}/define/${canonicalSlug}`;

  // Indexing Policy:
  // 1. MUST be in the curated WORDMAP to be indexed (prevent low-quality/garbage pages)
  // 2. MUST be a single word (standard SEO policy)
  // 3. MUST have data
  const shouldIndex = !!ifInWordMap && isSingleWord(displayWord) && !!wordData;

  return {
    title: titleStr,
    description: descriptionStr,
    alternates: { canonical },
    robots: { 
      index: shouldIndex,
      follow: true 
    },
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
  const rawSlug = params.word;
  const normalizedKey = getNormalizedWord(rawSlug);
  const session = await getServerSession(authOptions);
  
  // Try to find the exact display word from mapping, else fallback to normalized raw slug
  const ifInWordMap = WORDMAP[normalizedKey.replace(/[ -]/g, "")] || WORDMAP[normalizedKey];
  const displayWord = ifInWordMap || normalizedKey;

  // Basic sanity check: Don't try to define very long/short strings or numbers
  const isLikelyWord = /^[a-zA-Z-]{2,30}$/.test(displayWord);

  if (!displayWord || !isLikelyWord) {
    const decodedWord = decodeURIComponent(rawSlug);
    return (
      <div className="max-w-2xl mx-auto mt-10 p-4">
        <Card className="border-2 border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 rounded-3xl overflow-hidden">
          <CardContent className="pt-10 pb-10 text-center">
            <h1 className="text-4xl font-black text-red-600 mb-4">{decodedWord}</h1>
            <p className="text-gray-600 dark:text-red-200/60 font-medium">
              This doesn't look like a standard word. Please try another!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const finalWord = displayWord.toLowerCase();
  let wordData = await getWordData(finalWord);

  if (!wordData) {
    wordData = { word: finalWord, entries: [] };
  }

  const decodedWord = displayWord; // Use the correctly formatted version for the UI
  const isAuth = !!session;
  const canTriggerAI = !!ifInWordMap || isAuth;

  return (
    <div className="max-w-4xl mx-auto p-0 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-700">
      
      {/* Header Section: The "Title Card" */}
      <section className="bg-white dark:bg-gray-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 shadow-xl shadow-[#75c32c]/5 dark:shadow-none border border-gray-100 dark:border-gray-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-[#75c32c]">
              <Sparkles size={14} />
              Vocabulary Entry
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-gray-900 dark:text-white capitalize break-words">
              {decodedWord}
            </h1>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 pt-2">
               <AudioPronunciation word={decodedWord} />
               <span className="text-gray-300 dark:text-gray-700">|</span>
               <span className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 italic">
                 {wordData.entries.map(e => e.pos).join(" • ")}
               </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <AddToMyListsButton
              word={decodedWord}
              definition={wordData.entries[0]?.definition}
            />
          </div>
        </div>
        
        {/* Decorative background element */}
        <div className="absolute -right-10 -bottom-10 opacity-[0.03] dark:opacity-[0.07] pointer-events-none">
          <BookOpen size={300} strokeWidth={1} color="#75c32c" />
        </div>
      </section>

      {/* In-Content Ad — below the fold, above definitions */}
      <div className="rounded-2xl overflow-hidden">
        <AdsUnit slot="1177026196" variant="default" index={2} />
      </div>

      {/* Content Section: Definitions & Examples */}
      <div className="grid grid-cols-1 gap-6">
        {wordData.entries.length === 0 ? (
          <>
            {canTriggerAI ? (
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
              <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 rounded-full">
                  <UserRound size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Community definition needed</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                    This word isn't in our core library yet. <strong>Sign in</strong> to trigger an AI definition for the community!
                  </p>
                </div>
                <div className="pt-2">
                  <Link 
                    href="/login" 
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#75c32c] text-white rounded-full font-black text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-[#75c32c]/20 transition-all"
                  >
                    Sign In to Define
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : (

          wordData.entries.map((entry, idx) => (
            <div key={idx} className="group bg-white dark:bg-gray-900 rounded-[2rem] p-6 md:p-8 border border-gray-100 dark:border-gray-800 hover:border-[#75c32c]/50 dark:hover:border-[#75c32c]/50 transition-colors shadow-sm">
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex items-center justify-center w-12 h-12 bg-[#75c32c]/10 dark:bg-[#75c32c]/20 text-[#75c32c] rounded-xl font-black text-xl italic shrink-0">
                  {entry.pos[0].toUpperCase()}
                </div>
                <div className="space-y-4 flex-1">
                  <div>
                    <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider mb-2 group-hover:bg-[#75c32c]/10 group-hover:text-[#75c32c] transition-colors">
                      {entry.pos}
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 leading-tight">
                      {entry.definition}
                    </h2>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Quote size={16} className="fill-[#75c32c]/30" />
                      <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#75c32c]/60">Example Sentences</span>
                    </div>
                    <div className="grid gap-3">
                      {entry.examples.map((sent, i) => (
                        <div key={i} className="relative p-3 md:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-transparent group-hover:border-[#75c32c]/10 transition-all">
                          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed italic">
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
    </div>
  );
}

