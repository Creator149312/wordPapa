import Hangman from './Hangman';
import { GraduationCap } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 overflow-hidden">
      {/* Hero Header matching Home Page */}
      <section className="relative pt-16 pb-12 px-6 bg-[#75c32c]/5">
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#75c32c] text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-[#75c32c]/30">
            <GraduationCap size={14} strokeWidth={3} />
            Daily Challenge
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 dark:text-white">
            Hang<span className="text-[#75c32c]">Papa</span>
          </h1>
          <p className="text-lg text-gray-500 font-medium uppercase tracking-widest">
            Guess the word, save the Papa
          </p>
        </div>
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#75c32c]/10 rounded-full blur-[100px] -z-0" />
      </section>

      {/* Game Area */}
      <section className="max-w-4xl mx-auto px-6 pb-24 -mt-8 relative z-20">
        <Hangman />
      </section>
    </div>
  );
}