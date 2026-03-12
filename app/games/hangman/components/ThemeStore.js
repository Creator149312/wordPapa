import { Card } from "@/components/ui/card";
import { Lock, CheckCircle2, Coins } from "lucide-react";

const AVAILABLE_THEMES = [
  { 
    id: 'classic', 
    name: 'Classic', 
    price: 0, 
    colors: "bg-gray-100 dark:bg-gray-800",
    description: "The original WordPapa experience." 
  },
  { 
    id: 'cyberpunk', 
    name: 'Neon Night', 
    price: 500, 
    colors: "bg-indigo-900 border-pink-500",
    description: "High tech, low life. Neon accents everywhere." 
  },
  { 
    id: 'medieval', 
    name: 'Dungeon', 
    price: 1000, 
    colors: "bg-stone-800 border-amber-700",
    description: "Steel, stone, and ancient scrolls." 
  },
];

export default function ThemeStore({ profile, onPurchase, onSelect }) {
  
  const handleAction = (theme) => {
    const isUnlocked = profile.unlockedThemes.includes(theme.id);
    
    if (isUnlocked) {
      onSelect(theme.id);
    } else {
      if (profile.papaPoints < theme.price) {
        alert("💰 Not enough Papa Points!");
        return;
      }
      // Confirm purchase
      if (confirm(`Unlock ${theme.name} for ${theme.price} points?`)) {
        onPurchase(theme.id, theme.price);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-4">
        <h3 className="font-black uppercase tracking-tighter text-lg">Appearance</h3>
        <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-full text-amber-600 dark:text-amber-400 font-bold text-sm">
          <Coins size={14} />
          {profile.papaPoints}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {AVAILABLE_THEMES.map((theme) => {
          const isUnlocked = profile.unlockedThemes.includes(theme.id);
          const isSelected = profile.currentTheme === theme.id;

          return (
            <Card 
              key={theme.id}
              onClick={() => handleAction(theme)}
              className={`group relative p-5 cursor-pointer transition-all duration-300 rounded-[1.5rem] border-2 overflow-hidden ${
                isSelected 
                  ? 'border-[#75c32c] shadow-lg shadow-[#75c32c]/10 scale-[1.02]' 
                  : 'border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
              }`}
            >
              <div className="flex justify-between items-start mb-3 relative z-10">
                <div>
                  <h4 className="font-black uppercase text-sm tracking-tight">{theme.name}</h4>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight pr-4">
                    {theme.description}
                  </p>
                </div>
                
                {isUnlocked ? (
                  isSelected && (
                    <div className="bg-[#75c32c] p-1 rounded-full">
                      <CheckCircle2 className="text-white" size={14} />
                    </div>
                  )
                ) : (
                  <div className="flex items-center gap-1 bg-amber-500 text-white px-2 py-1 rounded-lg font-bold text-[10px]">
                    <Lock size={10} /> {theme.price}
                  </div>
                )}
              </div>

              {/* Visual Preview */}
              <div className={`mt-2 h-20 w-full rounded-xl border relative overflow-hidden transition-transform group-hover:scale-[1.02] ${theme.colors}`}>
                {/* Minimalist UI Preview inside the box */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <div className="flex gap-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-4 h-1 bg-current rounded-full" />
                    ))}
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className="absolute bottom-0 right-0 left-0 h-1 bg-[#75c32c]" />
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}