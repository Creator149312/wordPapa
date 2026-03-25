"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const Dropdown = ({ name, items }) => {
  const [openMobile, setOpenMobile] = useState(false);
  const [openSubmobileIndex, setOpenSubmobileIndex] = useState(null);

  const handleAction = (item) => {
    if (item.action === "signout") {
      signOut({ callbackUrl: "/login" });
    }
  };

  return (
    <div className="relative group w-full md:w-auto">
      {/* Trigger Button */}
      <button
        className="w-full md:w-auto py-2 flex items-center justify-between md:justify-start gap-1.5 font-black text-[13px] uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:text-[#75c32c] dark:hover:text-[#75c32c] transition-colors"
        onClick={() => setOpenMobile(!openMobile)}
      >
        {name}
        <ChevronDown 
          size={14} 
          strokeWidth={3}
          className={`transition-transform duration-200 ${openMobile ? 'rotate-180' : 'md:group-hover:rotate-180'}`} 
        />
      </button>

      {/* Desktop Dropdown Menu */}
      <div className="absolute right-0 top-full hidden md:group-hover:block pt-2 z-50">
        <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 shadow-xl rounded-2xl min-w-[180px] overflow-visible">
          {items.map((item, i) => (
            <div key={i} className="relative group/submenu">
              {item.submenu ? (
                <>
                  <button
                    className="w-full text-left px-5 py-3 text-[12px] font-black uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#75c32c] transition-colors border-b border-gray-50 dark:border-gray-800/50 last:border-0 flex items-center justify-between"
                  >
                    {item.name}
                    <ChevronRight size={14} className="group-hover/submenu:rotate-90 transition-transform" />
                  </button>
                  {/* Nested Submenu - Desktop */}
                  <div className="absolute left-full top-0 hidden group-hover/submenu:block pt-0 pl-1 z-50">
                    <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 shadow-xl rounded-2xl min-w-[200px] overflow-hidden">
                      {item.submenu.map((subitem, j) => (
                        <a
                          key={j}
                          href={subitem.link}
                          className="block px-5 py-3 text-[12px] font-black uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#75c32c] transition-colors border-b border-gray-50 dark:border-gray-800/50 last:border-0"
                        >
                          {subitem.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </>
              ) : item.action === "signout" ? (
                <button
                  onClick={() => handleAction(item)}
                  className="w-full text-left px-5 py-3 text-[12px] font-black uppercase tracking-wider text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center justify-between transition-colors border-b border-gray-50 dark:border-gray-800/50 last:border-0"
                >
                  {item.name}
                  <LogOut size={14} />
                </button>
              ) : (
                <a
                  href={item.link}
                  className="block px-5 py-3 text-[12px] font-black uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#75c32c] transition-colors border-b border-gray-50 dark:border-gray-800/50 last:border-0"
                >
                  {item.name}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Accordion Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${openMobile ? 'max-h-[800px] mt-2' : 'max-h-0'}`}>
        <div className="flex flex-col gap-1 bg-gray-50 dark:bg-white/5 rounded-2xl p-2">
          {items.map((item, i) => (
            <div key={i}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() => setOpenSubmobileIndex(openSubmobileIndex === i ? null : i)}
                    className="w-full text-left px-5 py-3 text-sm font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-[#75c32c] rounded-xl transition-all flex items-center justify-between"
                  >
                    {item.name}
                    <ChevronRight size={16} className={`transition-transform ${openSubmobileIndex === i ? 'rotate-90' : ''}`} />
                  </button>
                  {/* Mobile Submenu */}
                  <div className={`overflow-hidden transition-all duration-300 pl-4 ${openSubmobileIndex === i ? 'max-h-[400px]' : 'max-h-0'}`}>
                    <div className="flex flex-col gap-1 py-2">
                      {item.submenu.map((subitem, j) => (
                        <a
                          key={j}
                          href={subitem.link}
                          className="block px-5 py-2 text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-[#75c32c] rounded-xl transition-all"
                        >
                          {subitem.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => item.action === "signout" ? handleAction(item) : (window.location.href = item.link)}
                  className={`w-full text-left px-5 py-3 text-sm font-black uppercase tracking-widest rounded-xl transition-all ${
                    item.action === "signout" 
                    ? "text-red-500 hover:bg-red-50" 
                    : "text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-[#75c32c]"
                  }`}
                >
                  {item.name}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;

// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { ChevronDown, ChevronUp } from "lucide-react";
// import { signOut } from "next-auth/react";

// const Dropdown = ({ name, items }) => {
//   const [openMobile, setOpenMobile] = useState(false);

//   const handleAction = (item) => {
//     if (item.action === "signout") {
//       signOut({ callbackUrl: "/login" });
//     }
//   };

//   return (
//     <div className="relative group">
//       {/* Top-level button */}
//       <button
//         className="w-full md:w-auto px-3 py-2 flex items-center justify-between md:justify-start gap-1 font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//         onClick={() => setOpenMobile(!openMobile)}
//       >
//         {name}
//         <span className="md:hidden">
//           {openMobile ? (
//             <ChevronUp className="w-4 h-4" />
//           ) : (
//             <ChevronDown className="w-4 h-4" />
//           )}
//         </span>
//         <span className="hidden md:inline-block group-hover:rotate-180 transition-transform">
//           <ChevronDown className="w-4 h-4" />
//         </span>
//       </button>

//       {/* Desktop dropdown (hover) */}
//       <div className="absolute left-0 top-full hidden md:group-hover:block bg-white dark:bg-gray-800 shadow-lg rounded-md z-20 min-w-[200px]">
//         {items.map((item, i) =>
//           item.action === "signout" ? (
//             <button
//               key={i}
//               onClick={() => handleAction(item)}
//               className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//             >
//               {item.name}
//             </button>
//           ) : (
//             <a
//               key={i}
//               href={item.link}
//               className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//             >
//               {item.name}
//             </a>
//           )
//         )}
//       </div>

//       {/* Mobile dropdown (accordion style) */}
//       {openMobile && (
//         <div className="md:hidden mt-1 bg-white dark:bg-gray-900 rounded-md shadow-inner">
//           {items.map((item, i) =>
//             item.action === "signout" ? (
//               <button
//                 key={i}
//                 onClick={() => handleAction(item)}
//                 className="w-full text-left px-4 py-2 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//               >
//                 {item.name}
//               </button>
//             ) : (
//               <a
//                 key={i}
//                 href={item.link}
//                 className="block px-4 py-2 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//               >
//                 {item.name}
//               </a>
//             )
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dropdown;
