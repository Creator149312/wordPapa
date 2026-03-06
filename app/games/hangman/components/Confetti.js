'use client';

export default function Confetti() {
  const colors = ['#75c32c', '#60a5fa', '#f59e0b', '#ef4444', '#a855f7'];
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-sm animate-bounce"
          style={{
            backgroundColor: colors[i % colors.length],
            left: `${Math.random() * 100}%`,
            top: `-10px`,
            animation: `fall ${Math.random() * 2 + 1}s linear infinite`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}
      <style jsx>{`
        @keyframes fall {
          to { transform: translateY(400px) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}