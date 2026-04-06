"use client";

import { useState } from "react";
import {
  BookOpen,
  FlaskConical,
  Gamepad2,
  Menu,
  Trophy,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import ThemeToggle from "@components/ThemeToggle";
import SearchBarNav from "@components/SearchNavBar";
import UserProfileDropDown from "@components/dropdowns/UserProfileDropDown";

// Desktop nav items — Home (logo) and Profile (avatar) are handled outside this list.
const DESKTOP_NAV = [
  // {
  //   label: "Leaderboard",
  //   href: "/leaderboard",
  //   icon: Trophy,
  //   matches: ["/leaderboard"],
  // },
  {
    label: "Library",
    href: "/lists",
    icon: BookOpen,
    matches: ["/lists"],
  },
  {
    label: "Lab",
    href: "/browse",
    icon: FlaskConical,
    matches: [
      "/browse",
      "/define",
      "/thesaurus",
      "/syllables",
      "/word-finder",
      "/rhyming-words",
      "/adjectives",
      "/phrasal-verbs",
    ],
    hasDropdown: true,
  },
];

const isActive = (pathname, item) => {
  if (item.exact) return pathname === item.href;
  return (item.matches || [item.href]).some(
    (m) => pathname === m || pathname.startsWith(`${m}/`)
  );
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl sticky top-0 z-[100]">
      <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-6">

        {/* ── Logo + Mobile Toggle ───────────────────────────────── */}
        <div className="z-50 py-2 sm:py-3 w-full md:w-auto flex justify-between items-center">
          <a
            href="/"
            className="flex items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#86d437] via-[#75c32c] to-[#4d8c18] shadow-[0_4px_12px_rgba(117,195,44,0.3)] ring-1 ring-black/5">
              <img src="/logo192.png" alt="WordPapa" className="h-[18px] w-[18px] object-contain" />
            </div>
            <span className="text-[1rem] font-black tracking-[-0.03em] text-zinc-950 dark:text-white">
              Word<span className="text-[#75c32c]">Papa</span>
            </span>
          </a>

          <div className="flex gap-2 md:hidden items-center">
            <ThemeToggle />
            <button
              onClick={() => setOpen(!open)}
              className="p-1.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 active:scale-90 transition-all"
            >
              {open ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
            </button>
          </div>
        </div>

        {/* ── Search Bar ────────────────────────────────────────── */}
        <div className="w-full md:flex-1 md:max-w-lg md:px-8 pb-3 md:pb-0">
          <SearchBarNav />
        </div>

        {/* ── Desktop Nav ───────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-1">
          {DESKTOP_NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item);

            // Lab uses the existing dropdown system — wrap it in a hover group
            if (item.hasDropdown) {
              return (
                <div key={item.href} className="relative group">
                  <a
                    href={item.href}
                    className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                      active
                        ? "text-[#75c32c] bg-[#75c32c]/10"
                        : "text-gray-500 dark:text-gray-400 hover:text-[#75c32c] hover:bg-gray-50 dark:hover:bg-white/5"
                    }`}
                  >
                    <Icon
                      size={15}
                      strokeWidth={active ? 2.8 : 2}
                      className="shrink-0"
                    />
                    {item.label}
                  </a>
                  {/* Reuse existing dropdown menu — positioned below trigger */}
                  <div className="absolute right-0 top-full hidden group-hover:block pt-2 z-50">
                    <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 shadow-xl rounded-2xl min-w-[190px] overflow-visible py-1">
                      {[
                        { name: "Word Dictionary", link: "/define" },
                        { name: "Thesaurus", link: "/thesaurus" },
                        { name: "Adjectives Finder", link: "/adjectives" },
                        { name: "Rhyming Words", link: "/rhyming-words" },
                        { name: "Syllable Counter", link: "/syllables" },
                        { name: "Word Unscrambler", link: "/word-finder" },
                        { name: "Phrasal Verbs", link: "/phrasal-verbs" },
                        { name: "All Dictionaries", link: "/browse" },
                      ].map((sub) => (
                        <a
                          key={sub.link}
                          href={sub.link}
                          className="block px-4 py-2.5 text-[11px] font-black uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#75c32c] transition-colors border-b border-gray-50 dark:border-gray-800/50 last:border-0"
                        >
                          {sub.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <a
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  active
                    ? "text-[#75c32c] bg-[#75c32c]/10"
                    : "text-gray-500 dark:text-gray-400 hover:text-[#75c32c] hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
              >
                <Icon
                  size={15}
                  strokeWidth={active ? 2.8 : 2}
                  className="shrink-0"
                />
                {item.label}
                {/* Spotlight dot on Arena when not active */}
                {item.spotlight && !active && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#75c32c]" />
                )}
              </a>
            );
          })}

          <div className="h-6 w-px bg-gray-100 dark:bg-gray-800 mx-2" />
          {/* ── Play CTA ── primary conversion button */}
          <a
            href="/games/hangman"
            className="group flex items-center gap-2 bg-[#75c32c] text-white px-4 py-2 rounded-full border-2 border-b-4 border-black/20 hover:border-b-2 hover:translate-y-px active:translate-y-[3px] active:border-b-1 transition-all duration-75 shadow-md shadow-[#75c32c]/30 whitespace-nowrap"
          >
            <Gamepad2 size={15} strokeWidth={3} className="group-hover:rotate-12 transition-transform" />
            <span className="text-[11px] font-black uppercase tracking-widest">Play</span>
          </a>
          <div className="h-6 w-px bg-gray-100 dark:bg-gray-800 mx-2" />
          <ThemeToggle />
          <UserProfileDropDown />
        </div>

        {/* ── Mobile Nav Overlay ────────────────────────────────── */}
        <div
          className={`md:hidden fixed inset-0 z-40 bg-white dark:bg-[#0a0a0a] flex flex-col p-6 transition-all duration-300 ease-in-out ${
            open ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
          }`}
        >
          <div className="mt-14 space-y-2">
            {DESKTOP_NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                    active
                      ? "bg-[#75c32c]/10 text-[#75c32c]"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#75c32c]"
                  }`}
                >
                  <Icon size={18} strokeWidth={active ? 2.8 : 2} />
                  {item.label}
                  {item.spotlight && !active && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-[#75c32c]" />
                  )}
                </a>
              );
            })}
            <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col items-center gap-4">
              <UserProfileDropDown />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
