import { Card } from "@/components/ui/card";
import { Coffee, Zap, Play, Globe, Users } from "lucide-react";

export default function ModeSelector({ onSelect }) {
  return (
    <Card className="p-10 md:p-16 rounded-[3rem] border-2 border-gray-100 shadow-2xl text-center bg-white dark:bg-gray-900 max-w-4xl mx-auto">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-[#75c32c]/10 rounded-full animate-pulse">
          <Play className="text-[#75c32c] fill-[#75c32c]" size={48} />
        </div>
      </div>
      
      <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter italic">WordPapa</h2>
      <p className="text-gray-500 mb-10 font-medium uppercase text-xs tracking-[0.3em]">Select your battleground</p>
      
      {/* Grid updated to 3 columns for desktop */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* CLASSIC MODE */}
        <button 
          onClick={() => onSelect('classic')}
          className="group p-8 rounded-[2.5rem] border-2 border-gray-50 hover:border-[#75c32c] hover:bg-[#75c32c]/5 transition-all text-left flex flex-col justify-between"
        >
          <div>
            <Coffee className="text-blue-500 mb-4 group-hover:rotate-12 transition-transform" size={32} />
            <h3 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter">Classic</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 leading-tight">Relaxed play.<br/>No timer.</p>
          </div>
        </button>

        {/* BLITZ MODE */}
        <button 
          onClick={() => onSelect('blitz')}
          className="group p-8 rounded-[2.5rem] border-2 border-gray-50 hover:border-yellow-500 hover:bg-yellow-50/50 transition-all text-left flex flex-col justify-between"
        >
          <div>
            <Zap className="text-yellow-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter">Blitz</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 leading-tight">Fast pace.<br/>+5s per hit.</p>
          </div>
        </button>

        {/* ONLINE 1v1 MODE */}
        <button 
          onClick={() => onSelect('online')}
          className="group p-8 rounded-[2.5rem] border-2 border-blue-100 bg-blue-50/30 hover:border-blue-500 hover:bg-blue-50 transition-all text-left flex flex-col justify-between relative overflow-hidden"
        >
          {/* Live Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-500 text-white text-[8px] font-black uppercase tracking-widest">
            <span className="w-1 h-1 rounded-full bg-white animate-ping" />
            Live
          </div>

          <div>
            <Globe className="text-blue-600 mb-4 group-hover:spin-slow transition-transform" size={32} />
            <h3 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter">Online Duel</h3>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-1 leading-tight">1v1 Race.<br/>2 Min Sprint.</p>
          </div>
        </button>

      </div>

      <div className="mt-12 flex items-center justify-center gap-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">
        <Users size={14} />
        <span>1,402 Players Online</span>
      </div>
    </Card>
  );
}