import NOUN from "@app/browse/NOUNS";
import DataFilterDisplay from "@utils/DataFilterDisplay";
import { Tag } from "lucide-react";

export const revalidate = 2592000;

export async function generateStaticParams() {
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  return letters.map((letter) => ({ letter }));
}

export async function generateMetadata({ params }) {
  const L = decodeURIComponent(params.letter);
  const phraseSearch = L.length > 1 ? "" : "Letter";
  const titleStr = `Nouns Starting with ${phraseSearch} ${L.toUpperCase()}`;
  const descriptionStr = `Browse all nouns that begin with ${phraseSearch} ${L} and see how they name a person, place, thing, or concept.`;
  return { title: titleStr, description: descriptionStr };
}

const Page = async ({ params }) => {
  const L = decodeURIComponent(params.letter);
  const phraseSearch = L.length > 1 ? "" : "Letter";
  const regex = /^[a-zA-Z0-9]+$/;

  const words = NOUN.filter(
    (noun) => noun.length > 1 && noun.startsWith(L) && regex.test(noun)
  );

  const titleString = `Nouns Starting with ${phraseSearch} ${L.toUpperCase()}`;

  if (words.length === 0) {
    return (
      <div className="p-8 bg-gray-50 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[2rem] text-center">
        <h1 className="text-2xl font-black text-gray-400 mb-2">No Nouns Found</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          No nouns starting with <strong className="text-gray-700 dark:text-white">{L}</strong> were found. Try a different letter.
        </p>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-6">
      <div className="px-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#75c32c]/10 text-[#75c32c] text-[10px] font-black uppercase tracking-[0.2em] mb-3">
          <Tag size={12} /> Nouns
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
          {titleString.replace(L.toUpperCase(), "").trim()}{" "}
          <span className="text-[#75c32c]">{L.toUpperCase()}</span>
        </h1>
        <p className="mt-3 text-gray-500 dark:text-gray-400 font-medium">
          Explore the list of{" "}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#75c32c]/10 text-[#75c32c] text-sm font-black">{words.length}</span>{" "}
          nouns starting with {phraseSearch}{" "}
          <strong className="text-gray-800 dark:text-white">{L}</strong> — names of people, places, things, and concepts.
        </p>
      </div>

      <DataFilterDisplay words={words} />

      <p className="px-2 text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
        All nouns beginning with <strong className="text-gray-700 dark:text-white">{L}</strong> are sorted by length for easy browsing. Includes common nouns, proper nouns, concrete nouns, and abstract nouns.
      </p>
    </div>
  );
};

export default Page;