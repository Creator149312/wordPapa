import ADJECTIVE from "../../ADJECTIVE_WORDS";
import DataFilterDisplay from "@utils/DataFilterDisplay";
import { Palette } from "lucide-react";

export const revalidate = 2592000;

export async function generateStaticParams() {
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  return letters.map((letter) => ({ letter }));
}

export async function generateMetadata({ params }) {
  const L = decodeURIComponent(params.letter).toLowerCase();
  const phraseSearch = L.length > 1 ? "" : "Letter";
  const titleStr = `Adjective Words Starting with ${phraseSearch} ${L.toUpperCase()}`;
  const descriptionStr = `Browse all adjectives that begin with ${phraseSearch} ${L} to perfectly describe nouns and objects`;
  
  const toIndex = L.length === 1 && /^[a-z]$/.test(L);

  return { 
    title: titleStr, 
    description: descriptionStr,
    alternates: {
      canonical: `https://www.wordpapa.com/browse/adjectives/${L}`,
    },
    robots: {
      index: toIndex,
      follow: true,
    },
  };
}

const Page = async ({ params }) => {
  const L = decodeURIComponent(params.letter).toLowerCase();
  const phraseSearch = L.length > 1 ? "" : "Letter";
  const regex = /^[a-zA-Z0-9]+$/;

  const words = ADJECTIVE.filter(
    (adj) => adj.length > 1 && adj.startsWith(L) && regex.test(adj)
  );

  const titleString = `Adjective Words Starting with ${phraseSearch} ${L.toUpperCase()}`;

  if (words.length === 0) {
    return (
      <div className="px-4 md:px-8 py-8">
        <div className="p-8 bg-gray-50 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[2rem] text-center">
          <h1 className="text-2xl font-black text-gray-400 mb-2">No Adjectives Found</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            No adjectives starting with <strong className="text-gray-700 dark:text-white">{L}</strong> were found. Try a different letter.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 py-8 md:py-12 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#75c32c]/10 text-[#75c32c] text-[10px] font-black uppercase tracking-[0.2em] mb-3">
          <Palette size={12} /> Adjectives
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
          {titleString.replace(L.toUpperCase(), "").trim()}{" "}
          <span className="text-[#75c32c]">{L.toUpperCase()}</span>
        </h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 font-medium max-w-2xl">
          Explore the list of{" "}
          <span className="text-[#75c32c] font-black">{words.length.toLocaleString()}</span>{" "}
          positive and negative adjective words starting with{" "}
          {phraseSearch} <strong className="text-gray-800 dark:text-white">{L.toUpperCase()}</strong> to describe a person, place, or thing.
        </p>
      </div>

      <DataFilterDisplay words={words} />

      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-3xl">
        The list also contains describing words that indicate the grammatical role (e.g., common adjective, proper adjective) of each adjective to help you find even more precise and contrasting words for your writing.
      </p>
    </div>
  );
};


export default Page;