import commonLinks from "@utils/commonLinks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Book, 
  Sparkles, 
  Layers, 
  Music, 
  Search, 
  Hash, 
  GraduationCap 
} from "lucide-react";
import Link from "next/link";

const Page = () => {
  const tools = [
    {
      title: "Word Dictionary",
      description: "Explore definitions, pronunciations, and real-world sentence examples.",
      link: "/define",
      icon: <Book className="w-6 h-6" />,
      color: "text-[#75c32c]",
      bg: "bg-[#75c32c]/10",
    },
    {
      title: "Adjectives Finder",
      description: "Find the perfect words to describe any person, place, or object.",
      link: "/adjectives",
      icon: <Sparkles className="w-6 h-6" />,
      color: "text-[#75c32c]",
      bg: "bg-[#75c32c]/10",
    },
    {
      title: "Thesaurus",
      description: "Expand your vocabulary with curated synonyms and antonyms.",
      link: "/thesaurus",
      icon: <Layers className="w-6 h-6" />,
      color: "text-[#75c32c]",
      bg: "bg-[#75c32c]/10",
    },
    {
      title: "Rhyming Dictionary",
      description: "Discover perfect rhymes for poetry, lyrics, and creative writing.",
      link: "/rhyming-words",
      icon: <Music className="w-6 h-6" />,
      color: "text-[#75c32c]",
      bg: "bg-[#75c32c]/10",
    },
    {
      title: "Syllable Counter",
      description: "Break down words to find the exact number of syllables.",
      link: "/syllables",
      icon: <Hash className="w-6 h-6" />,
      color: "text-[#75c32c]",
      bg: "bg-[#75c32c]/10",
    },
    {
      title: "Word Finder",
      description: "Generate all possible word combinations from your letters.",
      link: "/word-finder",
      icon: <Search className="w-6 h-6" />,
      color: "text-[#75c32c]",
      bg: "bg-[#75c32c]/10",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section with your Green Theme */}
      <section className="relative pt-20 pb-16 px-6 overflow-hidden bg-[#75c32c]/5">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#75c32c] text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-[#75c32c]/30">
            <GraduationCap size={14} strokeWidth={3} />
            Language Mastery
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-gray-900 dark:text-white">
            Word<span className="text-[#75c32c]">Papa</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            The fun and effective way to master words. 
            <span className="block text-sm font-bold text-[#75c32c] mt-2 uppercase tracking-widest">by EnglishBix</span>
          </p>
        </div>

        {/* Dynamic Background Circle */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#75c32c]/10 rounded-full blur-[100px] -z-0" />
      </section>

      {/* Tools Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <Link href={tool.link} key={index} className="group">
              <Card className="h-full p-8 rounded-[2.5rem] border-2 border-gray-100 dark:border-gray-800 hover:border-[#75c32c] transition-all duration-300 group-hover:-translate-y-3 shadow-sm hover:shadow-2xl hover:shadow-[#75c32c]/20">
                <div className="space-y-6 text-center md:text-left">
                  <div className={`w-16 h-16 mx-auto md:mx-0 rounded-[1.25rem] ${tool.bg} ${tool.color} flex items-center justify-center transition-all group-hover:rotate-6 group-hover:scale-110 shadow-inner`}>
                    {tool.icon}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                      {tool.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm font-medium">
                      {tool.description}
                    </p>
                  </div>

                  <div className="pt-2 text-[#75c32c] font-black text-xs uppercase tracking-widest flex items-center justify-center md:justify-start gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore Tool <span className="text-lg">→</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Footer Mission Card */}
        <div className="mt-20 p-12 bg-gray-900 dark:bg-[#75c32c] rounded-[3.5rem] text-center shadow-2xl shadow-black/20">
          <h2 className="text-3xl font-black text-white">
            Unlock the power of your vocabulary.
          </h2>
          <div className="w-12 h-1.5 bg-[#75c32c] dark:bg-white mx-auto my-6 rounded-full" />
          <p className="text-gray-400 dark:text-white/80 max-w-xl mx-auto italic font-medium">
            "An enriching vocabulary hub where language mastery begins. Dive into the intricacies of adjectives and discover the nuances of expression."
          </p>
        </div>
      </section>
    </div>
  );
};

export default Page;