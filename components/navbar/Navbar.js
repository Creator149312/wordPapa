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
    <nav className="mx-2 py-2 border-b border-gray-200 dark:border-gray-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Logo + Mobile Toggle */}
        <div className="z-20 px-2 w-full md:w-auto flex justify-between items-center">
          <a href="/" className="text-2xl font-bold flex items-center gap-2">
            <img src="/logo192.png" alt="logo" className="h-8" />
            Wordpapa
          </a>
          <div className="flex gap-2 md:hidden items-center">
            <ThemeToggle />
            <button onClick={() => setOpen(!open)} className="text-2xl">
              {open ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-[60%]">
          <SearchBarNav />
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-4 text-sm font-medium">
          <ThemeToggle />
          <NavLinks />
          <UserProfileDropDown />
        </ul>

        {/* Mobile Nav */}
        <ul
          className={`md:hidden fixed w-full top-0 bottom-0 py-10 pl-4 overflow-y-auto duration-500 bg-white dark:bg-gray-900 ${
            open ? "left-0" : "left-[-100%]"
          }`}
        >
          <NavLinks />
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
