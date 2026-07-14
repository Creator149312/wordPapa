import allUSWords from "../allUsWords";
import unScrambledWordsSet from "../unscrambled-wordsSET"
import DataFilterDisplay from "@/utils/DataFilterDisplay";
import { ArrowLeft, Zap, Sparkles } from "lucide-react";
import Link from "next/link";

export const revalidate = 2592000; // Revalidate 

export async function generateStaticParams() {
  const popularCombos = ["stone", "apple", "train", "react", "words"];
  return popularCombos.map((letters) => ({ letters }));
}

export async function generateMetadata({ params }) {
  const letters = decodeURIComponent(params.letters);
  const toIndex = unScrambledWordsSet.has(letters.toLowerCase()) && /^[a-zA-Z_]+$/.test(letters);
  const ltUp = letters.toUpperCase();

  return {
    title: `Unscramble ${ltUp} | Find Words with letters in ${ltUp}`,
    description: `Explore list of words you can make using letters in ${ltUp} when you unscramble.`,
    alternates: {
      canonical: `https://words.englishbix.com/word-finder/${letters.toLowerCase()}`,
    },
    robots: {
      index: toIndex,
      follow: true,
    },
  };
}

function getWords(letters) {
  const questionMarks = (letters.match(/_/g) || []).length;
  const maxLength = letters.length;
  const minLength = 2;

  // Build frequency map of input letters
  const letterFreq = {};
  for (const char of letters) {
    if (char !== "_") {
      letterFreq[char] = (letterFreq[char] || 0) + 1;
    }
  }

  const matchingWords = [];

  for (const word of allUSWords) {
    const wordLen = word.length;

    // Skip words that are too short or too long
    if (wordLen < minLength) continue;
    if (wordLen > maxLength) break; // Because list is sorted by length

    // Build frequency map of the word
    const wordFreq = {};
    for (const char of word) {
      wordFreq[char] = (wordFreq[char] || 0) + 1;
    }

    let wildcardsUsed = 0;
    let canForm = true;

    for (const char in wordFreq) {
      const required = wordFreq[char];
      const available = letterFreq[char] || 0;
      if (required > available) {
        wildcardsUsed += required - available;
        if (wildcardsUsed > questionMarks) {
          canForm = false;
          break;
        }
      }
    }

    if (canForm) {
      matchingWords.push(word);
    }
  }

  return matchingWords;
}


export default async function Page({ params }) {
  const letters = decodeURIComponent(params.letters);
  const wordsWithLetters = getWords(letters);
  const letterinUppercase = letters.toUpperCase();
  const pageHeading = `Unscramble ${letterinUppercase} | Find Words with letters in ${letterinUppercase}`;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 min-h-screen">
      {/* Navigation */}
      <Link 
        href="/word-finder" 
        className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#75c32c] transition-colors mb-8 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Word Finder
      </Link>

      {/* Header Section */}
      <div className="mb-8 md:mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#75c32c]/10 text-[#75c32c] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          <Zap size={14} /> Unscramble Pro
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
          {pageHeading}
        </h1>
        <p className="mt-4 text-base md:text-lg font-medium text-gray-500 dark:text-gray-400 max-w-2xl">
          Following is a list of English words you can form using letters in <strong>{letterinUppercase}</strong> when unscrambled.
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
              We found <strong>{wordsWithLetters.length}</strong> possible words that can be formed using these letters.
            </p>
          </div>

          <div className="min-h-[400px]">
            <DataFilterDisplay words={wordsWithLetters} />
          </div>
        </section>
      </div>
    </div>
  );
}

