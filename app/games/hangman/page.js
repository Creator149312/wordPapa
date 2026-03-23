import Hangman from "./Hangman";
import {
  Info,
  HelpCircle,
  Trophy,
  Coins,
  Zap,
  Share2,
  Users,
  Target,
  Flame,
} from "lucide-react";

// 1. SEO & Social Metadata
export const metadata = {
  title: "Hangman Online - Challenge Friends & Beat XP Milestones",
  description:
    "Play the ultimate Hangman game! Earn XP, reach new milestones, and challenge your friends to beat your high score. A free classic word game with a competitive twist.",
  keywords: [
    "Hangman game online",
    "challenge friends hangman",
    "word game milestones",
    "play hangman with friends",
    "Block Blast style word game",
  ],
  openGraph: {
    title: "Can you beat my Hangman score?",
    description:
      "I'm crushing milestones in Hangman Online. Think you can guess the words faster?",
    url: "https://yourhangman.com", // Change to your real URL
    siteName: "Hangman Online",
    images: [
      {
        url: "https://yourhangman.com/og-image.jpg", // Create a 1200x630 image
        width: 1200,
        height: 630,
        alt: "Hangman Challenge Mode",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hangman Online: XP & Milestones",
    description: "Beat the gallows, earn XP, and challenge your rivals.",
    images: ["https://yourhangman.com/twitter-image.jpg"],
  },
};

export default function Page() {
  // Function to trigger native social sharing
  const handleShare = async () => {
    const shareData = {
      title: "Hangman Online Challenge",
      text: "I just reached a new milestone in Hangman! Can you beat my XP? Play here:",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(
          `${shareData.text} ${shareData.url}`,
        );
        alert(
          "Challenge link copied to clipboard! Share it with your friends.",
        );
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 selection:bg-[#75c32c]/30 flex flex-col font-sans overflow-x-hidden transition-colors duration-300">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-gradient-to-b from-[#75c32c]/10 to-transparent blur-3xl -z-0 pointer-events-none" />

      <main className="flex-grow w-full mx-auto px-2 sm:px-4 lg:px-6 pt-2 pb-16 relative z-20">
        {/* SEO Hidden H1 */}
        <h1 className="sr-only">
          Hangman - Play Online & Challenge Friends to Beat XP High Scores
        </h1>

        {/* CLIENT COMPONENT: The Game Logic */}
        <div className="w-full max-w-5xl mx-auto">
          <Hangman />
        </div>

        <div className="max-w-4xl mx-auto mt-12 md:mt-20 space-y-12">
          {/* CHALLENGE SECTION: Block Blast Style XP/Milestones */}
          <section className="relative overflow-hidden bg-[#75c32c]/5 dark:bg-[#75c32c]/10 border-2 border-[#75c32c]/20 rounded-[2.5rem] p-8 md:p-12 text-center">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Flame className="w-32 h-32 text-[#75c32c]" />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center p-4 bg-[#75c32c] rounded-2xl mb-6 shadow-xl shadow-[#75c32c]/30">
                <Trophy className="text-white w-10 h-10" />
              </div>

              <h2 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white mb-4 tracking-tight">
                Challenge Your Friends!
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10 text-lg">
                Think you’re a word master? Earn **XP** for every correct letter
                and reach **Milestones** to prove your skills. Don't just
                play—make your friends try to beat your level!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10">
                <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-5 text-left transition-transform hover:scale-[1.02]">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-2xl">
                    <Target className="text-orange-600 dark:text-orange-400 w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase text-xs tracking-wider">
                      Ranks
                    </h4>
                    <p className="text-sm text-zinc-500">
                      Surpass level milestones to unlock prestigious new Ranks.
                    </p>
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-5 text-left transition-transform hover:scale-[1.02]">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-2xl">
                    <Share2 className="text-blue-600 dark:text-blue-400 w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase text-xs tracking-wider">
                      Social Bragging
                    </h4>
                    <p className="text-sm text-zinc-500">
                      Instantly share your high scores on Facebook or X.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FEATURES GRID */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: Zap,
                title: "Endless Mode",
                desc: "Challenge your vocabulary and see how long you can last.",
              },
              {
                icon: Trophy,
                title: "Categories",
                desc: "Animals, Cities, Movies, and Programming!",
              },
              {
                icon: Coins,
                title: "Earn Rewards",
                desc: "Win streaks earn you coins for unlocking hints.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-zinc-50/80 dark:bg-zinc-900/40 p-6 rounded-3xl flex flex-col items-center text-center border border-zinc-100 dark:border-zinc-800"
              >
                <feature.icon className="text-[#75c32c] w-8 h-8 mb-3" />
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </section>

          {/* HOW TO PLAY */}
          <section className="bg-zinc-50/80 dark:bg-zinc-900/40 rounded-[2rem] p-8 md:p-12 border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-[#75c32c]/10 p-3 rounded-2xl">
                <Info className="text-[#75c32c] w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                How to Play Hangman Online
              </h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
              Hangman is a classic <strong>word guessing game</strong>.
              Challenge yourself to reach new milestones and beat your previous
              XP score to climb the Leaderboard.
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Guess letters to reveal the hidden word.",
                "Earn Coins and reach streak Milestones to refill Balloons.",
                "Unlock new Ranks to earn bonus XP and Coins.",
                "Watch yourself climb the Hall of Fame—patience matters!",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400"
                >
                  <div className="w-2 h-2 rounded-full bg-[#75c32c]" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* MULTIPLAYER TEASER */}
          <section className="relative overflow-hidden bg-zinc-900 dark:bg-zinc-100 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-zinc-800 dark:border-zinc-200">
            <div className="relative z-10 max-w-md">
              <span className="inline-block px-4 py-1.5 bg-[#75c32c] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-5">
                Multiplayer Coming Soon
              </span>
              <h3 className="text-3xl font-black text-white dark:text-zinc-900 mb-4 leading-none">
                Real-Time <br />
                <span className="text-[#75c32c]">Battle Mode</span>
              </h3>
              <p className="text-zinc-400 dark:text-zinc-500 text-sm md:text-base">
                Soon you'll be able to duel opponents in 1v1 word battles. The
                first to guess the word wins the pot. Get ready to climb the
                Global Leaderboard!
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-center">
              <div className="flex -space-x-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-zinc-900 dark:border-zinc-100 bg-zinc-800 dark:bg-zinc-200 flex items-center justify-center shadow-2xl overflow-hidden`}
                  >
                    <Users className="text-zinc-600 dark:text-zinc-400 w-8 h-8" />
                  </div>
                ))}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-zinc-900 dark:border-zinc-100 bg-[#75c32c] flex items-center justify-center text-white font-bold text-xl shadow-2xl">
                  +VS
                </div>
              </div>
            </div>
            {/* Background Decorative Gradient */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#75c32c]/20 blur-[100px] pointer-events-none" />
          </section>

          {/* FAQ */}
          <section className="space-y-6 pb-12">
            <div className="flex items-center gap-3">
              <HelpCircle className="text-[#75c32c] w-6 h-6" />
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                Frequently Asked Questions
              </h3>
            </div>
            <div className="space-y-4">
              {[
                {
                  q: "Is Hangman Online free to play?",
                  a: "Yes! Play for free on any device with no download required.",
                },
                {
                  q: "How do I earn XP?",
                  a: "Correct guesses and completing words earn you XP. Win streaks provide multipliers!",
                },
                {
                  q: "Who can play?",
                  a: "Anyone who loves word games, ESL learners, or anyone looking to challenge their English vocabulary.",
                },
                {
                  q: "Can I play with friends?",
                  a: "Currently, you can challenge them by sharing your high score. A real-time 1v1 mode is launching soon!",
                },
              ].map((faq, index) => (
                <details
                  key={index}
                  className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
                >
                  <summary className="flex justify-between items-center p-5 cursor-pointer list-none hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {faq.q}
                    </span>
                    <span className="text-[#75c32c] group-open:rotate-180 transition-transform duration-300">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M2 4l4 4 4-4" />
                      </svg>
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
