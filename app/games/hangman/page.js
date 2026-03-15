// page.js
import GameClientHeader from "./GameClientHeader";
import Hangman from "./Hangman";
import { Info, HelpCircle, Trophy, Coins, Zap } from "lucide-react";

export const metadata = {
  title: "Hangman Game Online - Free Classic Word Guessing Game",
  description: "Play the classic Hangman game online for free! Challenge your vocabulary with categories like Cities, Animals, and Movies. Earn coins, maintain streaks, and test your skills.",
  keywords: ["Hangman game online", "free word games", "play hangman", "vocabulary games", "classic hangman"],
};

export default function Page() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 selection:bg-[#75c32c]/30 flex flex-col font-sans overflow-x-hidden transition-colors duration-300">
      {/* Background Glow - Decorative only */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-gradient-to-b from-[#75c32c]/10 to-transparent blur-3xl -z-0 pointer-events-none" />

      {/* CLIENT COMPONENT: Interactive Header/Stats */}
      <GameClientHeader />

      <main className="flex-grow w-full mx-auto px-2 sm:px-4 lg:px-6 pt-2 pb-16 relative z-20">
        
        {/* CLIENT COMPONENT: The Game Logic */}
        <div className="w-full max-w-5xl mx-auto">
          <Hangman />
        </div>

        {/* SERVER-SIDE SEO CONTENT */}
        <div className="max-w-4xl mx-auto mt-12 md:mt-20 space-y-10">
          
          {/* Features Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Zap, title: "Multiple Modes", desc: "Play Classic mode to challenge your vocabulary." },
              { icon: Trophy, title: "Word Categories", desc: "Animals, Cities, Countries, Movies, and more!" },
              { icon: Coins, title: "Earn Coins", desc: "Maintain your streak to earn coins and unlock hints." }
            ].map((feature, i) => (
              <div key={i} className="bg-zinc-50/80 dark:bg-zinc-900/40 p-6 rounded-[2rem] flex flex-col items-center text-center">
                <feature.icon className="text-[#75c32c] w-8 h-8 mb-3" />
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">{feature.title}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{feature.desc}</p>
              </div>
            ))}
          </section>

          {/* How to Play Section */}
          <section className="bg-zinc-50/80 dark:bg-zinc-900/40 rounded-[2rem] p-6 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#75c32c]/10 p-2 rounded-xl">
                <Info className="text-[#75c32c] w-6 h-6" />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                How to Play
              </h2>
            </div>
            
            <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed text-sm md:text-base">
              Hangman is a classic <strong>word guessing game</strong>. Select a category and try to figure out the hidden word by suggesting letters one by one.
            </p>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              {[
                "Select your favorite word category.",
                "Maintain your win streak to earn daily coins.",
                "Use coins to unlock hints when you're stuck.",
                "Win by guessing before the man is hanged!",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#75c32c] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* FAQ Section */}
          <section className="space-y-6 pb-12 px-2">
            <div className="flex items-center gap-3">
              <HelpCircle className="text-[#75c32c] w-6 h-6" />
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">FAQ</h3>
            </div>
            
            <div className="space-y-3">
              {[
                { q: "Is this Hangman game free?", a: "Yes! Our online Hangman game is 100% free with no registration required." },
                { q: "What categories are available?", a: "Choose from Cities, Animals, Countries, Programming, and Hollywood Movies." }
              ].map((faq, index) => (
                <details key={index} className="group bg-zinc-50/50 dark:bg-zinc-900/20 rounded-2xl overflow-hidden transition-all">
                  <summary className="flex justify-between items-center p-5 cursor-pointer list-none hover:bg-zinc-100 dark:hover:bg-zinc-800/40 transition-colors">
                    <span className="font-semibold text-sm md:text-base text-zinc-800 dark:text-zinc-200">{faq.q}</span>
                    <span className="text-[#75c32c] group-open:rotate-180 transition-transform duration-300">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-sm text-zinc-500 dark:text-zinc-400">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
