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
    <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Logo + Mobile Toggle */}
        <div className="z-50 p-2 w-full md:w-auto flex justify-between items-center">
          <a
            href="/"
            className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-100"
          >
            <img src="/logo192.png" alt="logo" className="h-8" />
            Wordpapa
          </a>
          <div className="flex gap-2 md:hidden items-center">
            <ThemeToggle />
            <button
              onClick={() => setOpen(!open)}
              className="text-2xl text-gray-700 dark:text-gray-200"
            >
              {open ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-[60%]">
          <SearchBarNav />
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-700 dark:text-gray-200">
          <ThemeToggle />
          <NavLinks />
          <UserProfileDropDown />
        </ul>

        {/* Mobile Nav */}
        <ul
          className={`md:hidden mt-3 fixed w-full top-0 bottom-0 py-10 z-40 duration-500 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 ${
            open ? "left-0" : "left-[-100%]"
          }`}
        >
          <NavLinks />
          <UserProfileDropDown />
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
