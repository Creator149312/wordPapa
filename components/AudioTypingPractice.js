"use client";

import { useState, useEffect } from "react";
import { Volume2, CheckCircle2, ChevronRight, X } from "lucide-react";

export default function AudioTypingPractice({ words }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [brianVoice, setBrianVoice] = useState(null);
  const [emmaVoice, setEmmaVoice] = useState(null);
  const [shuffledLetters, setShuffledLetters] = useState([]);

  const currentWord = words[currentIndex]?.word;

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      const brian = availableVoices.find(v => v.name.includes("Brian") && v.lang.includes("en"));
      const emma = availableVoices.find(v => v.name.includes("Emma") && v.lang.includes("en"));
      setBrianVoice(brian || availableVoices[0]);
      setEmmaVoice(emma || availableVoices[1]);
    };
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  useEffect(() => {
    if (currentWord) {
      const shuffled = [...currentWord].sort(() => Math.random() - 0.5);
      setShuffledLetters(shuffled);
    }
  }, [currentWord]);

  const playAudio = () => {
    if (!currentWord) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentWord);
    utterance.voice = currentIndex % 2 === 0 ? brianVoice : emmaVoice;
    utterance.rate = 0.85;
    speechSynthesis.speak(utterance);
  };

  const checkAnswer = () => {
    if (input.trim().toLowerCase() === currentWord.toLowerCase()) {
      setFeedback({ message: "✨ Perfect spelling!", type: "success" });
    } else {
      setFeedback({ message: `Oops! It's "${currentWord}".`, type: "error" });
    }
  };

  const nextWord = () => {
    setInput("");
    setFeedback({ message: "", type: "" });
    setCurrentIndex((prev) => (prev + 1) % words.length);
  };

  return (
    // Reduced outer gap from gap-6 to gap-3
    <div className="flex flex-col gap-3 p-3 w-full max-w-md mx-auto">
      
      {/* Progress & Speaker Header - Reduced padding and internal spacing */}
      <div className="bg-white dark:bg-gray-900 rounded-[1.5rem] p-3 shadow-sm border border-gray-100 dark:border-gray-800 text-center space-y-2">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#75c32c]">
          Listening {currentIndex + 1}/{words.length}
        </span>
        
        <div className="flex justify-center">
          <button
            onClick={playAudio}
            // Reduced size from w-20 h-20 to w-14 h-14
            className="w-14 h-14 bg-[#75c32c] text-white rounded-2xl shadow-lg shadow-[#75c32c]/30 flex items-center justify-center active:scale-90 transition-transform"
          >
            <Volume2 size={28} fill="currentColor" />
          </button>
        </div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tap to Listen</p>
      </div>

      {/* Input Display Area - Tighter spacing */}
      <div className="space-y-2">
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Spell it..."
            // Reduced padding from py-5 to py-3, font from 2xl to xl
            className="w-full text-center text-xl font-black tracking-widest border-2 border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3 focus:border-[#75c32c] outline-none bg-white dark:bg-gray-900 dark:text-white transition-all shadow-sm"
          />
          {input && (
            <button 
              onClick={() => setInput("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-400 active:scale-75"
            >
              <X size={14} strokeWidth={3} />
            </button>
          )}
        </div>

        {/* Unified Letter Tiles - Optimized for finger size but smaller gap */}
        <div className="flex flex-wrap gap-1.5 justify-center py-1">
          {shuffledLetters.map((letter, i) => (
            <button
              key={`${currentIndex}-${i}`}
              onClick={() => { setInput(prev => prev + letter); setFeedback({ message: "", type: "" }); }}
              // Reduced size from w-11 h-14 to w-10 h-12
              className="w-10 h-12 flex items-center justify-center bg-white dark:bg-gray-800 border-b-4 border-gray-200 dark:border-gray-950 rounded-lg text-lg font-black text-gray-700 dark:text-gray-200 shadow-sm active:translate-y-0.5 active:border-b-0 transition-all uppercase"
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Actions Area - Tighter gaps */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <button
            onClick={checkAnswer}
            disabled={!input}
            // Reduced padding from py-4 to py-3
            className="flex-[2] bg-[#75c32c] disabled:bg-gray-200 text-white py-3 rounded-xl font-black text-lg shadow-lg shadow-[#75c32c]/20 flex items-center justify-center gap-2 active:bg-[#66aa26]"
          >
            <CheckCircle2 size={18} />
            Check
          </button>
          
          {words.length > 1 && (
            <button
              onClick={nextWord}
              className="flex-1 bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 text-gray-500 rounded-xl font-black flex items-center justify-center active:bg-gray-50"
            >
              <ChevronRight size={22} />
            </button>
          )}
        </div>

        {/* Feedback Message - Smaller padding */}
        {feedback.message && (
          <div className={`p-3 rounded-xl text-center font-black text-sm animate-in slide-in-from-bottom-2 ${
            feedback.type === "success" 
              ? "bg-[#75c32c]/10 text-[#75c32c] border border-[#75c32c]/20" 
              : "bg-red-50 text-red-600 border border-red-100"
          }`}>
            {feedback.message}
          </div>
        )}
      </div>
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";

// export default function AudioTypingPractice({ words }) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [input, setInput] = useState("");
//   const [feedback, setFeedback] = useState({ message: "", type: "" });
//   const [brianVoice, setBrianVoice] = useState(null);
//   const [emmaVoice, setEmmaVoice] = useState(null);
//   const [shuffledLetters, setShuffledLetters] = useState([]);

//   const currentWord = words[currentIndex]?.word;

//   useEffect(() => {
//     const loadVoices = () => {
//       const availableVoices = speechSynthesis.getVoices();
//       const brian = availableVoices.find(v => v.name.includes("Brian") && v.lang.includes("en"));
//       const emma = availableVoices.find(v => v.name.includes("Emma") && v.lang.includes("en"));
//       setBrianVoice(brian || availableVoices[0]);
//       setEmmaVoice(emma || availableVoices[1]);
//     };
//     loadVoices();
//     speechSynthesis.onvoiceschanged = loadVoices;
//   }, []);

//   useEffect(() => {
//     if (currentWord) {
//       const shuffled = [...currentWord].sort(() => Math.random() - 0.5);
//       setShuffledLetters(shuffled);
//     }
//   }, [currentWord]);

//   const playAudio = () => {
//     if (!currentWord) return;
//     speechSynthesis.cancel(); // Stop current speech
//     const utterance = new SpeechSynthesisUtterance(currentWord);
//     utterance.voice = currentIndex % 2 === 0 ? brianVoice : emmaVoice;
//     utterance.rate = 0.9;
//     speechSynthesis.speak(utterance);
//   };

//   const checkAnswer = () => {
//     if (input.trim().toLowerCase() === currentWord.toLowerCase()) {
//       setFeedback({ message: "✨ Spot on! Perfect spelling.", type: "success" });
//     } else {
//       setFeedback({ message: `Close! The correct spelling is "${currentWord}".`, type: "error" });
//     }
//   };

//   const nextWord = () => {
//     setInput("");
//     setFeedback({ message: "", type: "" });
//     setCurrentIndex((prev) => (prev + 1) % words.length);
//   };

//   const handleLetterClick = (letter) => {
//     setInput((prev) => prev + letter);
//     setFeedback({ message: "", type: "" });
//   };

//   return (
//     <div className="max-w-md mx-auto p-8 space-y-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
//       {/* Header & Speaker */}
//       <div className="text-center space-y-4">
//         <span className="text-xs font-bold uppercase tracking-widest text-blue-500">
//           Listening Practice {currentIndex + 1}/{words.length}
//         </span>
        
//         <div className="flex justify-center">
//           <button
//             onClick={playAudio}
//             className="group relative w-20 h-20 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none transition-all flex items-center justify-center hover:scale-105 active:scale-95"
//           >
//             <span className="text-3xl transition-transform group-hover:scale-110">🔊</span>
//             <span className="absolute -bottom-8 text-xs font-semibold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
//               Replay Audio
//             </span>
//           </button>
//         </div>
//       </div>

//       {/* Input Display Area */}
//       <div className="space-y-4">
//         <div className="relative group">
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Type what you hear..."
//             className="w-full text-center text-2xl font-bold tracking-widest border-2 border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-4 focus:border-blue-500 outline-none bg-gray-50/50 dark:bg-gray-900/50 dark:text-white transition-all shadow-inner"
//           />
//           {input && (
//             <button 
//               onClick={() => setInput("")}
//               className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 font-bold"
//             >
//               ✕
//             </button>
//           )}
//         </div>

//         {/* Shuffled Letter Tiles */}
//         <div className="flex flex-wrap gap-2 justify-center py-2">
//           {shuffledLetters.map((letter, i) => (
//             <button
//               key={`${currentIndex}-${i}`}
//               onClick={() => handleLetterClick(letter)}
//               className="w-12 h-14 flex items-center justify-center bg-white dark:bg-gray-700 border-b-4 border-gray-200 dark:border-gray-900 rounded-xl shadow-sm text-xl font-bold text-gray-700 dark:text-gray-200 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:-translate-y-1 active:translate-y-0.5 active:border-b-0"
//             >
//               {letter}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Action Area */}
//       <div className="space-y-3">
//         <div className="flex gap-3">
//           <button
//             onClick={checkAnswer}
//             disabled={!input}
//             className="flex-1 bg-green-600 disabled:bg-gray-200 text-white py-4 rounded-2xl font-bold hover:bg-green-700 shadow-lg shadow-green-100 dark:shadow-none transition-all"
//           >
//             Check Answer
//           </button>
//           {words.length > 1 && (
//             <button
//               onClick={nextWord}
//               className="px-6 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
//             >
//               Next
//             </button>
//           )}
//         </div>

//         {/* Feedback Alert */}
//         {feedback.message && (
//           <div className={`p-4 rounded-xl text-center font-bold animate-in zoom-in duration-300 ${
//             feedback.type === "success" 
//               ? "bg-green-100 text-green-800" 
//               : "bg-red-50 text-red-800"
//           }`}>
//             {feedback.message}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }