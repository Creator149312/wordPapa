import commonLinks from "@utils/commonLinks";
import { Card } from "@/components/ui/card";
import {
  Book,
  Sparkles,
  Layers,
  Music,
  Search,
  Hash,
  GraduationCap,
  Gamepad2,
  ListTodo,
  Zap
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

      {/* CTA Section - Games & Lists */}
      <section className="max-w-6xl mx-auto px-6 pb-12 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Hangman Game CTA */}
          <Link href="/games/hangman" className="group">
            <Card className="relative overflow-hidden h-full p-10 rounded-[2.5rem] border-2 border-gray-100 dark:border-gray-800 hover:border-[#75c32c] transition-all duration-300 group-hover:-translate-y-3 shadow-sm hover:shadow-2xl hover:shadow-[#75c32c]/20 bg-gradient-to-br from-[#75c32c]/10 to-white dark:from-[#75c32c]/10 dark:to-gray-800">
              <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 rounded-[1.25rem] bg-[#75c32c]/20 text-[#75c32c] flex items-center justify-center transition-all group-hover:rotate-6 group-hover:scale-110 shadow-inner">
                  <Gamepad2 className="w-8 h-8" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white">
                    Test Your Skills
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                    Play Hangman and challenge yourself with daily word puzzles. Compete on the leaderboard and earn rewards!
                  </p>
                </div>

                <div className="pt-4 text-[#75c32c] font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-opacity">
                  <Zap size={14} />
                  Play Now <span className="text-lg">→</span>
                </div>
              </div>

              {/* Decorative Element */}
              <div className="absolute -right-12 -top-12 w-32 h-32 bg-[#75c32c]/5 rounded-full blur-2xl" />
            </Card>
          </Link>

          {/* Manage Lists CTA */}
          <Link href="/lists" className="group">
            <Card className="relative overflow-hidden h-full p-10 rounded-[2.5rem] border-2 border-gray-100 dark:border-gray-800 hover:border-[#75c32c] transition-all duration-300 group-hover:-translate-y-3 shadow-sm hover:shadow-2xl hover:shadow-[#75c32c]/20 bg-gradient-to-br from-[#75c32c]/10 to-white dark:from-[#75c32c]/10 dark:to-gray-800">
              <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 rounded-[1.25rem] bg-[#75c32c]/20 text-[#75c32c] flex items-center justify-center transition-all group-hover:rotate-6 group-hover:scale-110 shadow-inner">
                  <ListTodo className="w-8 h-8" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white">
                    Curate Your Lists
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                    Create and manage personalized word lists. Organize your learning journey and track your progress!
                  </p>
                </div>

                <div className="pt-4 text-[#75c32c] font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-opacity">
                  <Zap size={14} />
                  Get Started <span className="text-lg">→</span>
                </div>
              </div>

              {/* Decorative Element */}
              <div className="absolute -right-12 -top-12 w-32 h-32 bg-[#75c32c]/5 rounded-full blur-2xl" />
            </Card>
          </Link>
        </div>

        {/* Tools Section Heading */}
        <div className="mt-24 mb-12 text-center">
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-3">
            Experiment with Your Toolkit
          </h2>
          <p className="text-gray-600 dark:text-gray-300 font-medium max-w-2xl mx-auto">
            Master English with our comprehensive collection of learning tools
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
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

                  <div className="pt-2 text-[#75c32c] font-black text-xs uppercase tracking-widest flex items-center justify-center md:justify-start gap-2 transition-opacity">
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