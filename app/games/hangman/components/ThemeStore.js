import { Card } from "@/components/ui/card";
import { Lock, CheckCircle2 } from "lucide-react";

const AVAILABLE_THEMES = [
  { id: 'classic', name: 'Classic', price: 0 },
  { id: 'cyberpunk', name: 'Neon Night', price: 500 },
  { id: 'medieval', name: 'Dungeon', price: 1000 },
];

export default function ThemeStore({ profile, onPurchase, onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {AVAILABLE_THEMES.map((theme) => {
        const isUnlocked = profile.unlockedThemes.includes(theme.id);
        const isSelected = profile.currentTheme === theme.id;

        return (
          <Card 
            key={theme.id}
            onClick={() => isUnlocked ? onSelect(theme.id) : onPurchase(theme)}
            className={`p-4 cursor-pointer transition-all border-2 ${
              isSelected ? 'border-[#75c32c] bg-[#75c32c]/5' : 'border-transparent'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-black uppercase text-xs tracking-tighter">{theme.name}</span>
              {isUnlocked ? (
                isSelected && <CheckCircle2 className="text-[#75c32c]" size={16} />
              ) : (
                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                  <Lock size={12} /> {theme.price}
                </div>
              )}
            </div>
            {/* Small Preview Box */}
            <div className={`h-16 w-full rounded-lg ${theme.id === 'cyberpunk' ? 'bg-gray-900' : 'bg-gray-100'}`} />
          </Card>
        );
      })}
    </div>
  );
}