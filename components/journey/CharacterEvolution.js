"use client";

import { useEffect, useState } from "react";

const CharacterEvolution = ({ stage, size = "medium", animate = false }) => {
  const [currentFrame, setCurrentFrame] = useState(0);

  // Character sprites for different stages
  const characters = {
    infant: {
      emoji: "👶",
      size: size === "large" ? "text-6xl" : size === "small" ? "text-2xl" : "text-4xl",
      description: "Just starting the journey"
    },
    toddler: {
      emoji: "🧒",
      size: size === "large" ? "text-6xl" : size === "small" ? "text-2xl" : "text-4xl",
      description: "Learning first words"
    },
    child: {
      emoji: "👦",
      size: size === "large" ? "text-6xl" : size === "small" ? "text-2xl" : "text-4xl",
      description: "Building vocabulary"
    },
    teen: {
      emoji: "👨‍🎓",
      size: size === "large" ? "text-6xl" : size === "small" ? "text-2xl" : "text-4xl",
      description: "Mastering language skills"
    },
    young_adult: {
      emoji: "👨‍💼",
      size: size === "large" ? "text-6xl" : size === "small" ? "text-2xl" : "text-4xl",
      description: "Becoming a wordsmith"
    },
    adult: {
      emoji: "👨‍🏫",
      size: size === "large" ? "text-6xl" : size === "small" ? "text-2xl" : "text-4xl",
      description: "Language expert"
    },
    wordpapa: {
      emoji: "👴",
      size: size === "large" ? "text-6xl" : size === "small" ? "text-2xl" : "text-4xl",
      description: "Ultimate WordPapa Master"
    }
  };

  const character = characters[stage] || characters.infant;

  // Simple animation for idle state
  useEffect(() => {
    if (!animate) return;

    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % 3); // 3-frame animation
    }, 500);

    return () => clearInterval(interval);
  }, [animate]);

  return (
    <div className="relative group">
      {/* Character Sprite */}
      <div
        className={`
          ${character.size} transition-all duration-500 ease-in-out
          ${animate ? 'animate-bounce' : ''}
          filter drop-shadow-lg
        `}
        style={{
          animationDelay: `${currentFrame * 0.2}s`,
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}
      >
        {character.emoji}
      </div>

      {/* Evolution indicator */}
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#75c32c] rounded-full flex items-center justify-center">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
      </div>

      {/* Hover tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
        <div className="bg-black text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
          {character.description}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
        </div>
      </div>

      {/* Growth particles effect */}
      {animate && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#75c32c] rounded-full animate-ping"
              style={{
                left: `${30 + i * 20}%`,
                top: `${20 + i * 15}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CharacterEvolution;