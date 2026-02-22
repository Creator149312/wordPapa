"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

export default function Toast({ message, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mount with animation
    setIsVisible(true);

    // Auto-close timer
    const timer = setTimeout(() => {
      handleClose();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for fade-out animation
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-[300] flex items-center gap-4 px-5 py-4 
        bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 
        shadow-[0_20px_50px_rgba(117,195,44,0.15)] rounded-2xl min-w-[300px] 
        transition-all duration-300 ease-in-out
        ${isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95"}
      `}
    >
      {/* Brand Icon */}
      <div className="flex-shrink-0">
        <CheckCircle2 size={22} className="text-[#75c32c]" strokeWidth={2.5} />
      </div>

      {/* Message */}
      <div className="flex-grow">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#75c32c] mb-0.5">
          Notification
        </p>
        <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
          {message}
        </p>
      </div>

      {/* Manual Close */}
      <button
        onClick={handleClose}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
      >
        <X size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
}
// "use client";

// import { useEffect } from "react";

// export default function Toast({ message, onClose }) {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       onClose();
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, [onClose]);

//   return (
//     <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg flex items-center space-x-2 z-50">
//       <span>{message}</span>
//       <button
//         onClick={onClose}
//         className="ml-2 text-white hover:text-gray-200 focus:outline-none"
//       >
//         ✕
//       </button>
//     </div>
//   );
// }
