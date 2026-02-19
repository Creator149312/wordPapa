"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { signOut } from "next-auth/react";

const Dropdown = ({ name, items }) => {
  const [openMobile, setOpenMobile] = useState(false);

  const handleAction = (item) => {
    if (item.action === "signout") {
      signOut({ callbackUrl: "/login" });
    }
  };

  return (
    <div className="relative group">
      {/* Top-level button */}
      <button
        className="w-full md:w-auto px-3 py-2 flex items-center justify-between md:justify-start gap-1 font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onClick={() => setOpenMobile(!openMobile)}
      >
        {name}
        <span className="md:hidden">
          {openMobile ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </span>
        <span className="hidden md:inline-block group-hover:rotate-180 transition-transform">
          <ChevronDown className="w-4 h-4" />
        </span>
      </button>

      {/* Desktop dropdown (hover) */}
      <div className="absolute left-0 top-full hidden md:group-hover:block bg-white dark:bg-gray-800 shadow-lg rounded-md z-20 min-w-[200px]">
        {items.map((item, i) =>
          item.action === "signout" ? (
            <button
              key={i}
              onClick={() => handleAction(item)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {item.name}
            </button>
          ) : (
            <a
              key={i}
              href={item.link}
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {item.name}
            </a>
          )
        )}
      </div>

      {/* Mobile dropdown (accordion style) */}
      {openMobile && (
        <div className="md:hidden mt-1 bg-white dark:bg-gray-900 rounded-md shadow-inner">
          {items.map((item, i) =>
            item.action === "signout" ? (
              <button
                key={i}
                onClick={() => handleAction(item)}
                className="w-full text-left px-4 py-2 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {item.name}
              </button>
            ) : (
              <a
                key={i}
                href={item.link}
                className="block px-4 py-2 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {item.name}
              </a>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
