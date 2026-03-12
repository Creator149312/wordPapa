'use client';
import { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Loader2, Image as ImageIcon } from "lucide-react";

export default function ScoreCardGenerator({ 
  word, 
  category, 
  isWon, 
  streak = 0, 
  mode = 'classic',
  myScore = 0,
  oppScore = 0,
  oppName = 'Rival'
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef(null);

  const generateImage = async () => {
    setIsGenerating(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // 1. Setup Dimensions (Perfect for Instagram/WhatsApp)
    canvas.width = 1080;
    canvas.height = 1080;

    // 2. Draw Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
    gradient.addColorStop(0, '#0f172a'); // Slate 900
    gradient.addColorStop(1, '#1e293b'); // Slate 800
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1080);

    // 3. Draw Decorative Accents (Subtle Green Glow)
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = '#75c32c';
    ctx.beginPath();
    ctx.arc(1080, 0, 600, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // 4. Logo / Brand Header
    ctx.fillStyle = '#75c32c';
    ctx.font = 'black 60px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('WORDPAPA HANGMAN', 540, 120);

    // 5. Category Box
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.roundRect(340, 160, 400, 60, 30);
    ctx.fill();
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 30px Inter';
    ctx.fillText(category.toUpperCase(), 540, 200);

    // 6. Word Visual (Boxes)
    const letters = word.toUpperCase().split('');
    const boxSize = 80;
    const gap = 15;
    const totalWidth = letters.length * (boxSize + gap) - gap;
    let startX = (1080 - totalWidth) / 2;

    letters.forEach((l, i) => {
      ctx.fillStyle = isWon ? '#75c32c' : '#ef4444';
      ctx.roundRect(startX + (i * (boxSize + gap)), 300, boxSize, boxSize, 15);
      ctx.fill();
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 45px monospace';
      ctx.fillText(l, startX + (i * (boxSize + gap)) + 40, 355);
    });

    // 7. Main Stats Section
    if (mode === 'classic') {
      // CLASSIC LAYOUT
      ctx.fillStyle = '#fb923c'; // Orange 400
      ctx.font = 'black 220px Inter';
      ctx.fillText(streak.toString(), 540, 650);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 40px Inter';
      ctx.fillText('CLEARED STREAK', 540, 720);
    } else {
      // 1VS1 LAYOUT
      // My Score
      ctx.fillStyle = '#75c32c';
      ctx.font = 'black 180px Inter';
      ctx.fillText(myScore.toString(), 340, 650);
      ctx.font = 'bold 40px Inter';
      ctx.fillText('YOU', 340, 710);

      // VS
      ctx.fillStyle = '#475569';
      ctx.font = 'italic bold 60px Inter';
      ctx.fillText('VS', 540, 600);

      // Opponent Score
      ctx.fillStyle = '#ef4444';
      ctx.font = 'black 180px Inter';
      ctx.fillText(oppScore.toString(), 740, 650);
      ctx.font = 'bold 40px Inter';
      ctx.fillText(oppName.toUpperCase(), 740, 710);
    }

    // 8. Footer Info
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = 'bold 30px Inter';
    ctx.fillText('PLAY NOW AT WORDPAPA.COM', 540, 1000);

    // 9. Download the result
    setTimeout(() => {
      const link = document.createElement('a');
      link.download = `wordpapa-${mode}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setIsGenerating(false);
    }, 500);
  };

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />
      <Button 
        onClick={generateImage}
        disabled={isGenerating}
        className="bg-[#75c32c] hover:bg-[#64a825] text-white font-black px-8 h-14 rounded-2xl uppercase text-[10px] tracking-widest transition-all flex items-center gap-2 shadow-lg"
      >
        {isGenerating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ImageIcon className="w-4 h-4" />
        )}
        {isGenerating ? "Creating..." : "Download Card"}
      </Button>
    </>
  );
}