"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import NavLinks from "./NavLinks";
import ThemeToggle from "@components/ThemeToggle";
import SearchBarNav from "@components/SearchNavBar";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <nav className="mx-2 py-2">
      <div className="flex flex-col md:flex-row items-center font-medium justify-between gap-2">
        {/* Logo + Mobile Toggle */}
        <div className="z-20 px-2 w-full md:w-auto flex justify-between items-center">
          <a href="/" className="text-2xl font-bold flex items-center gap-2">
            <img
              src="/logo192.png"
              alt="logo"
              className="md:cursor-pointer h-8"
            />
            Wordpapa
          </a>
          <div className="flex gap-2 md:hidden items-center">
            <ThemeToggle />
            <div className="text-2xl" onClick={() => setOpen(!open)}>
              {open ? <X size={28} /> : <Menu size={28} />}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-[60%]">
          <SearchBarNav />
        </div>

        {/* Desktop Nav Links */}
        <ul className="z-10 hidden md:flex items-center gap-2 text-sm">
          <ThemeToggle />
          <NavLinks />
          <li>
            <Link href="/thesaurus" className="px-2 py-2 inline-block text-base">
              Thesaurus
            </Link>
          </li>
        </ul>

        {/* Mobile Nav */}
        <ul
          className={`z-10 md:hidden dark:bg-[#020817] bg-white fixed w-full top-0 bottom-0 py-10 pl-4 overflow-y-auto duration-500 ${
            open ? "left-0" : "left-[-100%]"
          }`}
        >
          <NavLinks setOpen={setOpen} />
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
