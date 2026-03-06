export default function HangmanDrawing({ errorCount, theme = 'classic' }) {
 const styles = {
    classic: { stroke: "stroke-gray-900", gallows: "stroke-gray-200" },
    cyberpunk: { stroke: "stroke-cyan-400", gallows: "stroke-pink-500" },
    medieval: { stroke: "stroke-amber-900", gallows: "stroke-stone-400" }
  };

  const currentStyle = styles[theme] || styles.classic;

  return (
    <svg width="140" height="140" viewBox="0 0 100 100" className={`${currentStyle.stroke} fill-none stroke-[3]`}>
      <path d="M20 90 L80 90 M30 90 L30 10 L60 10 L60 20" className={currentStyle.gallows} strokeWidth="2" />    
        {/* Character - Each part appears based on errorCount */}
        {errorCount > 0 && <circle cx="60" cy="30" r="10" className="animate-in fade-in duration-300" />}
        {errorCount > 1 && <line x1="60" y1="40" x2="60" y2="70" className="animate-in slide-in-from-top-2" />}
        {errorCount > 2 && <line x1="60" y1="50" x2="45" y2="40" className="animate-in slide-in-from-right-2" />}
        {errorCount > 3 && <line x1="60" y1="50" x2="75" y2="40" className="animate-in slide-in-from-left-2" />}
        {errorCount > 4 && <line x1="60" y1="70" x2="45" y2="85" className="animate-in slide-in-from-bottom-2" />}
        {errorCount > 5 && <line x1="60" y1="70" x2="75" y2="85" className="stroke-red-500 animate-pulse" strokeWidth="4" />}
     </svg>
  );
}