"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import NavLinks from "./NavLinks";
import ThemeToggle from "@components/ThemeToggle";
import SearchBarNav from "@components/SearchNavBar";
import UserProfileDropDown from "@components/dropdowns/UserProfileDropDown";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] sticky top-0 z-[100]">
      <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-6">
        
        {/* Logo + Mobile Toggle */}
        <div className="z-50 py-3 w-full md:w-auto flex justify-between items-center">
          <a
            href="/"
            className="flex items-center gap-2 text-xl font-black tracking-tighter text-gray-900 dark:text-white"
          >
            <img src="/logo192.png" alt="logo" className="h-7 w-auto" />
            <span>Word<span className="text-[#75c32c]">Papa</span></span>
          </a>
          
          <div className="flex gap-3 md:hidden items-center">
            <ThemeToggle />
            <button
              onClick={() => setOpen(!open)}
              className="p-1 text-gray-500 dark:text-gray-400 active:scale-90 transition-transform"
            >
              {open ? <X size={26} strokeWidth={2.5} /> : <Menu size={26} strokeWidth={2.5} />}
            </button>
          </div>
        </div>

        {/* Search Bar - Centered and Slimmed */}
        <div className="w-full md:flex-1 md:max-w-xl md:px-8 pb-3 md:pb-0">
          <SearchBarNav />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-6 text-[13px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
            <NavLinks />
          </ul>
          <div className="h-6 w-px bg-gray-100 dark:bg-gray-800" />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserProfileDropDown />
          </div>
        </div>

        {/* Mobile Nav Overlay */}
        <div
          className={`md:hidden fixed inset-0 z-40 bg-white dark:bg-[#0a0a0a] flex flex-col p-8 transition-all duration-300 ease-in-out ${
            open ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
          }`}
        >
          <div className="mt-12 space-y-8 text-center">
            <ul className="flex flex-col gap-6 text-lg font-black uppercase tracking-widest text-gray-900 dark:text-white">
              <NavLinks onClick={() => setOpen(false)} />
            </ul>
            <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col items-center gap-6">
               <UserProfileDropDown />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

// "use client";

// import { useState } from "react";
// import { Menu, X } from "lucide-react";
// import NavLinks from "./NavLinks";
// import ThemeToggle from "@components/ThemeToggle";
// import SearchBarNav from "@components/SearchNavBar";
// import UserProfileDropDown from "@components/dropdowns/UserProfileDropDown";

// const Navbar = () => {
//   const [open, setOpen] = useState(false);

//   return (
//     <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
//       <div className="flex flex-col md:flex-row items-center justify-between gap-2">
//         {/* Logo + Mobile Toggle */}
//         <div className="z-50 p-2 w-full md:w-auto flex justify-between items-center">
//           <a
//             href="/"
//             className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-100"
//           >
//             <img src="/logo192.png" alt="logo" className="h-8" />
//             Wordpapa
//           </a>
//           <div className="flex gap-2 md:hidden items-center">
//             <ThemeToggle />
//             <button
//               onClick={() => setOpen(!open)}
//               className="text-2xl text-gray-700 dark:text-gray-200"
//             >
//               {open ? <X size={28} /> : <Menu size={28} />}
//             </button>
//           </div>
//         </div>

//         {/* Search Bar */}
//         <div className="w-full md:w-[60%]">
//           <SearchBarNav />
//         </div>

//         {/* Desktop Nav */}
//         <ul className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-700 dark:text-gray-200">
//           <ThemeToggle />
//           <NavLinks />
//           <UserProfileDropDown />
//         </ul>

//         {/* Mobile Nav */}
//         <ul
//           className={`md:hidden mt-3 fixed w-full top-0 bottom-0 py-10 z-40 duration-500 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 ${
//             open ? "left-0" : "left-[-100%]"
//           }`}
//         >
//           <NavLinks />
//           <UserProfileDropDown />
//         </ul>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
