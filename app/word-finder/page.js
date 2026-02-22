import AdsUnit from "@components/AdsUnit";
import { Sparkles, Zap, GraduationCap } from "lucide-react";

const ptitle = "Word Finder: Unscramble Letters to Make Words";

export const metadata = {
  title: ptitle,
  description:
    "Word Finder: Your Ultimate Word Unscrambler! Quickly find words from jumbled letters, enhance vocabulary, and ace word games. Perfect for students, teachers, and word enthusiasts. Filter words and Unlock the secrets of scrambled words!",
};

function WordFinderPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 min-h-screen">
      {/* Header Section */}
      <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#75c32c]/10 text-[#75c32c] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          <Sparkles size={14} /> Power Tool
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
          Word <span className="text-[#75c32c]">Finder</span>: Unscramble Letters to Make Words
        </h1>
      </div>

      <div className="space-y-8">
        {/* Intro Card */}
        <section className="relative p-8 bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-[2.5rem] shadow-2xl shadow-[#75c32c]/5">
          <p className="text-lg md:text-xl font-bold text-gray-700 dark:text-gray-200 leading-relaxed mb-6">
            Word Finder is a powerful tool that helps unscramble jumbled letters and
            find all the words you can form with given letters. It's super handy
            because it quickly sorts out the mixed-up letters, saving you time and
            effort. You can even find words with missing letters—just use <span className="text-[#75c32c] font-black underline underline-offset-4">(?)</span> in
            place of unknown letter as a wildcard.
          </p>
          <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
            Ever found yourself scratching your head over a mess of jumbled letters,
            desperately trying to solve them into coherent words? If so, let me
            introduce you to your new best friend: Word Finder! This free tool is
            like having a super-smart sidekick who can unscramble words faster than
            you can say "alphabet soup," saving you heaps of time and frustration.
          </p>
        </section>

        <AdsUnit slot="7782807936" />

        {/* Features Grid-style layout */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-transparent hover:border-[#75c32c]/30 transition-colors">
            <Zap className="text-[#75c32c] mb-4" size={28} />
            <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
              Word Finder isn't your run-of-the-mill word unscrambler—it's packed with 
              advanced features that make it a powerhouse for word enthusiasts of all stripes. 
              With options to filter words based on length, pattern, or even known letters, 
              it's like having a Swiss army knife for wordplay at your fingertips.
            </p>
          </div>

          <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-transparent hover:border-[#75c32c]/30 transition-colors">
            <GraduationCap className="text-[#75c32c] mb-4" size={28} />
            <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
              It doubles as your go-to cheat for word games and puzzles. From helping in 
              Scrabble showdowns to cracking crossword clues, it's the ultimate tool for 
              turning downtime into playtime. It works online, so you can use it on 
              your phone or computer from anywhere.
            </p>
          </div>
        </div>

        <section className="p-8 border-l-4 border-[#75c32c] bg-[#75c32c]/5 rounded-r-[2rem]">
          <p className="text-gray-700 dark:text-gray-200 font-bold leading-relaxed mb-6">
            Word Unscrambler isn't just for kids or casual word enthusiasts—it's for everyone! 
            Teachers can use it to spice up their lesson plans with interactive word games, 
            while professionals can rely on it for crafting polished resumes or writing snappy emails.
          </p>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Whether you're a student, a teacher, a professional, or just someone who
            loves to play with words, It is your trusty sidekick for solving the
            mysteries of scrambled letters and having a blast with language.
          </p>
        </section>

        <AdsUnit slot="7782807936" />

        <div className="text-center py-12">
          <p className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tighter mb-4">
            Ready to solve?
          </p>
          <p className="max-w-xl mx-auto text-gray-500 dark:text-gray-400 font-medium italic">
            "Give Word Finder a spin today and prepare to be amazed at
            how it transforms your wordplay game from 'meh' to 'marvelous' in no
            time. Your linguistic adventure starts here!"
          </p>
        </div>
      </div>
    </div>
  );
}

export default WordFinderPage;

// import AdsUnit from "@components/AdsUnit";
// const ptitle = "Word Finder: Unscramble Letters to Make Words";

// export const metadata = {
//   title: ptitle,
//   description:
//     "Word Finder: Your Ultimate Word Unscrambler! Quickly find words from jumbled letters, enhance vocabulary, and ace word games. Perfect for students, teachers, and word enthusiasts. Filter words and Unlock the secrets of scrambled words!",
// };

// function WordFinderPage() {
//   return (
//     <div className="m-3 p-3">
//       <h1 className="text-4xl font-extrabold mb-6">{ptitle}</h1>
//       <p className="mb-6 text-lg font-normal">
//         Word Finder is a powerful tool that helps unscramble jumbled letters and
//         find all the words you can form with given letters. It's super handy
//         because it quickly sorts out the mixed-up letters, saving you time and
//         effort. You can even find words with missing letters just use (?) in
//         place of unknown letter as a wildcard.
//       </p>
//       <p className="mb-6 text-lg font-normal">
//         Ever found yourself scratching your head over a mess of jumbled letters,
//         desperately trying to solve them into coherent words? If so, let me
//         introduce you to your new best friend: Word Finder! This free tool is
//         like having a super-smart sidekick who can unscramble words faster than
//         you can say "alphabet soup," saving you heaps of time and frustration.
//       </p>
//       <AdsUnit slot='7782807936'/> 
//       <p className="mb-6 text-lg font-normal">
//         But wait, there's more! Word Finder isn't your run-of-the-mill word
//         unscrambler—it's packed with advanced features that make it a powerhouse
//         for word enthusiasts of all stripes. With options to filter words based
//         on length, pattern, or even known letters, it's like having a Swiss army
//         knife for wordplay at your fingertips. Whether you're a word nerd
//         looking to expand your vocabulary or a student trying to find words
//         using given letters, Word Finder has got you covered.
//       </p>
//       <p className="mb-6 text-lg font-normal">
//         And let's not forget about the fun factor! When you're not busy
//         impressing your friends with your word wizardry, It doubles as your
//         go-to cheat for word games and puzzles. From helping in Scrabble
//         showdowns to cracking crossword clues, it's the ultimate tool for
//         turning downtime into playtime. It works online, so you can use it on
//         your phone or computer from anywhere.
//       </p>
//       <p className="mb-6 text-lg font-normal">
//         But here's the real kicker: Word Unscrambler isn't just for kids or
//         casual word enthusiasts—it's for everyone! Teachers can use it to spice
//         up their lesson plans with interactive word games, while professionals
//         can rely on it for crafting polished resumes or writing snappy emails.
//         Whether you're a student, a teacher, a professional, or just someone who
//         loves to play with words, It is your trusty sidekick for solving the
//         mysteries of scrambled letters and having a blast with language.
//       </p>
//       <AdsUnit slot='7782807936'/> 
//       <p className="mb-6 text-lg font-normal">
//         So why wait? Give Word Finder a spin today and prepare to be amazed at
//         how it transforms your wordplay game from "meh" to "marvelous" in no
//         time. With Word Finder by your side, the only limit to your linguistic
//         adventures is your imagination!
//       </p>
//     </div>
//   );
// }

// export default WordFinderPage;
