import ALLCLEANWORDS from "@app/browse/ALLCLEANWORDS";
import DataFilterDisplaybyStartingLetter from "@/utils/DataFilterDisplaybyStartingLetter";
import { BookOpen } from "lucide-react";

export const revalidate = 2592000; // ✅ Cache full page HTML

export async function generateStaticParams() {
  return Array.from({ length: 20 }, (_, i) => ({ length: String(i + 1) }));
}

export async function generateMetadata({ params }) {
  const L = parseInt(decodeURIComponent(params.length), 10);

  const titleStr = `${L} Letter Words in English`;
  const descriptionStr = `Browse the list of all ${L} English words and filter them according to starting letters, ending letters, and containing letters.`;

  const toIndex = L > 0 && L <= 30;

  return {
    title: titleStr,
    description: descriptionStr,
    alternates: {
      canonical: `https://www.wordpapa.com/browse/words/length/${L}`,
    },
    robots: {
      index: toIndex,
      follow: true,
    },
  };
}

const Page = async ({ params }) => {
  const L = parseInt(params.length, 10);
  const regex = /^[a-zA-Z]+$/;

  const words = ALLCLEANWORDS.filter(
    (w) => w.length === L && regex.test(w)
  );

  const titleString = `${L} Letter Words in English`;

  if (words.length === 0) {
    return (
      <div className="px-4 md:px-8 py-8">
        <div className="p-8 bg-gray-50 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[2rem] text-center">
          <h1 className="text-2xl font-black text-gray-400 mb-2">No Words Found</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Sorry, we couldn’t find any {L}-letter words. Try a different length.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 py-8 md:py-12 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#75c32c]/10 text-[#75c32c] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          <BookOpen size={12} /> Word Explorer
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
          <span className="text-[#75c32c]">{L} Letter</span> Words{" "}
          <span className="text-gray-400 dark:text-gray-600">in English</span>
        </h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 font-medium max-w-2xl">
          Explore the complete list of{" "}
          <span className="text-[#75c32c] font-black">{words.length.toLocaleString()}</span>{" "}
          Common {L}-letter English words. Use the filters below to sort them by starting, ending, or containing letters.
        </p>
      </div>

      <DataFilterDisplaybyStartingLetter words={words} />
    </div>
  );
};


export default Page;
