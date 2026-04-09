import commonLinks from "@utils/commonLinks";
import { Library, ArrowRight } from "lucide-react";

export async function generateMetadata({ params }, parent) {
  return {
    title: `WordPapa English Dictionaries`,
    description: `Browse the Ultimate List of Dictionaries in English to find the words you want.`,
  };
}

const dictionaries = [
  {
    href: "/define",
    label: "Word Dictionary",
    description: "Definitions, parts of speech & sentence examples for any English word.",
    count: "100,000+",
    countLabel: "words",
  },
  {
    href: "/thesaurus",
    label: "Thesaurus",
    description: "Find synonyms and antonyms to expand your vocabulary and avoid repetition.",
    count: "100,000+",
    countLabel: "words",
  },
  {
    href: "/browse/nouns",
    label: "Noun Dictionary",
    description: "Explore the complete list of English nouns — people, places, things, and ideas.",
    count: "80,000+",
    countLabel: "nouns",
  },
  {
    href: "/browse/adjectives",
    label: "Adjectives Dictionary",
    description: "Browse describing words that add color, detail, and precision to your writing.",
    count: "21,000+",
    countLabel: "adjectives",
  },
  {
    href: "/browse/verbs",
    label: "Verbs Dictionary",
    description: "Find action words and state-of-being verbs to bring your sentences to life.",
    count: "11,000+",
    countLabel: "verbs",
  },
  {
    href: "/phrasal-verbs",
    label: "Phrasal Verbs",
    description: "A to Z list of multi-word verb combinations — essential for natural English fluency.",
    count: "8,000+",
    countLabel: "phrasal verbs",
  },
];

const Page = async () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 min-h-screen">
      {/* Header */}
      <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#75c32c]/10 text-[#75c32c] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          <Library size={14} /> Dictionary Hub
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
          WordPapa <span className="text-[#75c32c]">Dictionaries</span>
        </h1>
        <p className="mt-4 text-lg font-medium text-gray-500 dark:text-gray-400 max-w-2xl">
          Your one-stop hub for exploring the building blocks of English — from nouns and verbs to phrasal expressions and synonyms.
        </p>
      </div>

      {/* Dictionary Cards Grid */}
      <div className="grid md:grid-cols-2 gap-5">
        {dictionaries.map((dict) => (
          <a
            key={dict.href}
            href={dict.href}
            className="group p-7 bg-white dark:bg-[#111] border-2 border-gray-100 dark:border-gray-800 rounded-[2rem] shadow-sm hover:border-[#75c32c]/40 hover:shadow-lg hover:shadow-[#75c32c]/5 transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <h2 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-[#75c32c] transition-colors">
                {dict.label}
              </h2>
              <ArrowRight
                size={18}
                className="text-gray-300 dark:text-gray-600 group-hover:text-[#75c32c] group-hover:translate-x-1 transition-all shrink-0 mt-1"
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-4">
              {dict.description}
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#75c32c]/10 text-[#75c32c] text-[11px] font-black uppercase tracking-widest">
              {dict.count} {dict.countLabel}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Page;
