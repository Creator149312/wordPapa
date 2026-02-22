import MostSearchedWordsList from "@components/MostSearchedWordsList";
import commonLinks from "@utils/commonLinks";
import AdsUnit from "@components/AdsUnit";
import { PenLine, Palette, SortAsc, Sparkles } from "lucide-react";

const ptitle = "Adjectives Finder: Get Describing Words for Nouns";

const mostSearchedWordsList = [
  "socks", "turtle", "grace", "watch", "months", "wish", "negotiation", "display", 
  "lunch", "dinner", "supervisors", "christian", "bond", "fan", "blue", "play", 
  "reader", "apps", "fountain", "office", "plan", "nails", "table", "rest", 
  "recitation", "model", "packaging", "condolences", "collection", "monday", 
  "construction", "tattoo", "portfolio", "gamer", "standard", "insect", "lipstick", 
  "task", "workout", "chef", "internet", "curtains", "speech", "poverty", "brownies", 
  "sunglasses", "decoration", "principal", "sloth", "machine", "seminar", "wisdom", 
  "sustainability", "startups", "bathroom", "gym", "material", "tea", "report", 
  "salad", "box", "program", "classmates", "accessories", "december", "soap", 
  "spices", "modern", "topic", "wall", "relaxing", "pasta", "spaghetti", "mentor", 
  "math", "connection", "message", "year", "group", "weekend", "laptop", "soup", 
  "playground", "vibes", "drums", "development", "leaves", "speaker", "rabbit", 
  "view", "pencil", "evening", "guidance", "morning", "plastic",
];

export const metadata = {
  title: ptitle,
  description:
    "Use our Adjectives Finder to find perfect describing words for Nouns or Objects to enhance the quality of your writings and make communications engaging.",
};

function AdjectivesExtractorPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 min-h-screen">
      {/* Header Section */}
      <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#75c32c]/10 text-[#75c32c] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          <Palette size={14} /> Creative Writing
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
          Adjectives <span className="text-[#75c32c]">Finder</span>: Describe Your World
        </h1>
      </div>

      <div className="space-y-8">
        {/* Intro Section */}
        <section className="p-8 bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-[2.5rem] shadow-2xl shadow-[#75c32c]/5">
          <p className="text-lg md:text-xl font-bold text-gray-700 dark:text-gray-200 leading-relaxed mb-6">
            Our Adjectives Finder is a handy resource for word enthusiasts and writers. 
            Also known as a <span className="text-[#75c32c]">describing words generator</span>, 
            it assists you in finding the perfect modifiers to enhance the details and imagery in your writing.
          </p>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
            <div className="bg-[#75c32c] p-2 rounded-lg text-white">
              <Sparkles size={20} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              Input a noun or object to instantly generate a list of adjectives that paint 
              a more vivid picture in your narratives or product descriptions.
            </p>
          </div>
        </section>

        <AdsUnit slot="7782807936" />

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-[2rem] border-2 border-transparent hover:border-[#75c32c]/20 transition-all group">
            <PenLine className="text-[#75c32c] mb-4 group-hover:scale-110 transition-transform" size={28} />
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Vivid Imagery</h3>
            <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
              Effortlessly generates curated lists of descriptive terms related to your chosen noun, 
              enhancing your vocabulary and creative storytelling.
            </p>
          </div>

          <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-[2rem] border-2 border-transparent hover:border-[#75c32c]/20 transition-all group">
            <SortAsc className="text-[#75c32c] mb-4 group-hover:scale-110 transition-transform" size={28} />
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Intuitive Sorting</h3>
            <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
              What sets us apart is the sorting feature—arranging adjectives alphabetically 
              and by length, making it a breeze to find the perfect word for your needs.
            </p>
          </div>
        </div>

        <AdsUnit slot="7782807936" />

        {/* Popular Searches Section */}
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-[2px] flex-grow bg-gray-100 dark:bg-gray-800" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 shrink-0">
              Browse Describing Words
            </span>
            <div className="h-[2px] flex-grow bg-gray-100 dark:bg-gray-800" />
          </div>
          
          <div className="bg-white dark:bg-transparent p-2 rounded-3xl">
            <MostSearchedWordsList
              wordList={mostSearchedWordsList}
              preText={"describing words for "}
              postText={""}
              slug={commonLinks.adjectives}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdjectivesExtractorPage;

// import MostSearchedWordsList from "@components/MostSearchedWordsList";
// import commonLinks from "@utils/commonLinks";
// import AdsUnit from "@components/AdsUnit";

// const ptitle = "Adjectives Finder: Get Describing Words for Nouns";

// const mostSearchedWordsList = [
//   "socks",
//   "turtle",
//   "grace",
//   "watch",
//   "months",
//   "wish",
//   "negotiation",
//   "display",
//   "lunch",
//   "dinner",
//   "supervisors",
//   "christian",
//   "bond",
//   "fan",
//   "blue",
//   "play",
//   "reader",
//   "apps",
//   "fountain",
//   "office",
//   "plan",
//   "nails",
//   "table",
//   "rest",
//   "recitation",
//   "model",
//   "packaging",
//   "condolences",
//   "collection",
//   "monday",
//   "construction",
//   "tattoo",
//   "portfolio",
//   "gamer",
//   "standard",
//   "insect",
//   "lipstick",
//   "task",
//   "workout",
//   "chef",
//   "internet",
//   "curtains",
//   "speech",
//   "poverty",
//   "brownies",
//   "sunglasses",
//   "decoration",
//   "principal",
//   "sloth",
//   "machine",
//   "seminar",
//   "wisdom",
//   "sustainability",
//   "startups",
//   "bathroom",
//   "gym",
//   "material",
//   "tea",
//   "report",
//   "salad",
//   "box",
//   "program",
//   "classmates",
//   "accessories",
//   "december",
//   "soap",
//   "spices",
//   "modern",
//   "topic",
//   "wall",
//   "relaxing",
//   "pasta",
//   "spaghetti",
//   "mentor",
//   "math",
//   "connection",
//   "message",
//   "year",
//   "group",
//   "weekend",
//   "laptop",
//   "soup",
//   "playground",
//   "vibes",
//   "drums",
//   "development",
//   "leaves",
//   "speaker",
//   "rabbit",
//   "view",
//   "pencil",
//   "evening",
//   "guidance",
//   "morning",
//   "plastic",
// ];

// export const metadata = {
//   title: ptitle,
//   description:
//     "Use our Adjectives Finder to find perfect describing words for Nouns or Objects to enhance the quality of your writings and make communications engaging.",
// };

// function AdjectivesExtractorPage() {
//   return (
//     <>
//       {/* <AdjectivesExtractor /> */}
//       <div className="m-2 p-2">
//         <h1 className="text-4xl font-extrabold mb-6">{ptitle}</h1>
//         <p className="mb-2">
//           Introducing our Adjectives Finder is a handy resource for word
//           enthusiasts, writers, and language lovers. Also known as an describing
//           words generator, assists users in finding adjectives or describing
//           words to enhance the details and imagery in their writing.
//         </p>
//         <p className="mb-2">
//           By inputting a noun or object, users can generate a list of adjectives
//           that can be used to paint a more vivid picture in their writing. This
//           tool is valuable for improving the descriptive quality of narratives,
//           product descriptions, and creative storytelling, helping writers
//           create more engaging and expressive content.
//         </p>
//         <AdsUnit slot='7782807936'/> 
//         <p className="mb-2">
//           You simply have to give it a word, this tool will effortlessly
//           generates a curated list of descriptive words related to your chosen
//           term, enhancing your vocabulary and creative writing.
//         </p>
//         <p className="mb-2">
//           What sets it apart is its intuitive sorting feature, arranging these
//           adjectives in alphabetical order by length, making it a breeze to find
//           the perfect word for your expression.
//         </p>
//       </div>
//       <div className="m-2 p-2">
//         <MostSearchedWordsList
//           wordList={mostSearchedWordsList}
//           preText={"describing words for "}
//           postText={""}
//           slug={commonLinks.adjectives}
//         />
//       </div>
//       <AdsUnit slot='7782807936'/> 
//     </>
//   );
// }

// export default AdjectivesExtractorPage;
