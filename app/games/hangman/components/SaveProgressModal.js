'use client';
import { Card } from "@/components/ui/card";
import { Ghost, X } from "lucide-react";
import { signIn } from "next-auth/react";

export default function SaveProgressModal({ isOpen, onClose, xp, points }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <Card className="w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border-none shadow-2xl text-center relative overflow-hidden">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Icon Header */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400/20 blur-2xl rounded-full" />
            <div className="relative p-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <Ghost className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
        
        <h2 className="text-3xl font-black mb-3 dark:text-white tracking-tight">Save Your Legend!</h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">
          You've built up <span className="font-bold text-blue-500">{xp} XP</span> and 
          <span className="font-bold text-green-500 ml-1">{points} Coins</span>. 
          Sign in now to keep your progress forever!
        </p>

        <div className="flex flex-col items-center space-y-4">
          {/* Your Custom Green Button */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/games/hangman" })}
            className="w-full px-5 py-5 rounded-2xl bg-[#75c32c] text-white text-base font-black uppercase tracking-widest shadow-lg shadow-[#75c32c]/20 hover:scale-105 active:scale-95 transition-all"
          >
            Sign In with Google
          </button>
          
          <button 
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors font-medium text-sm"
            onClick={onClose}
          >
            I'll risk losing it
          </button>
        </div>
      </Card>
    </div>
  );
}