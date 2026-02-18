"use client";

import { useEffect } from "react";

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg flex items-center space-x-2 z-50">
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-white hover:text-gray-200 focus:outline-none"
      >
        ✕
      </button>
    </div>
  );
}
