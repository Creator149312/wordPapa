"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import {
  Bell,
  BookOpen,
  FlaskConical,
  Home,
  Search,
  Swords,
  UserRound,
  Zap,
} from "lucide-react";
import SearchBarNav from "@components/SearchNavBar";
import CollectionsBar from "@components/CollectionsBar";

const NAV_ITEMS = [
  {
    label: "Home",
    href: "/",
    icon: Home,
    matches: ["/"],
    exact: true,
  },
  {
    label: "Library",
    href: "/lists",
    icon: BookOpen,
    matches: ["/lists"],
  },
  {
    label: "Arena",
    href: "/games/hangman",
    icon: Swords,
    matches: ["/games/hangman", "/journey"],
    spotlight: true,
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
      "/dataValidator",
    ],
  },
  {
    label: "Profile",
    href: "/dashboard",
    icon: UserRound,
    matches: ["/dashboard", "/settings", "/login", "/register"],
  },
];

const isMatch = (pathname, item) => {
  if (item.exact) {
    return pathname === item.href;
  }

  return item.matches.some((match) => pathname === match || pathname.startsWith(`${match}/`));
};

const MobileAppChrome = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [isChromeVisible, setIsChromeVisible] = useState(true);
  const [themeMounted, setThemeMounted] = useState(false);
  const [hud, setHud] = useState(null);
  const [xpFlash, setXpFlash] = useState(false);
  const prevXpRef = useRef(null);
  const lastScrollYRef = useRef(0);

  const fetchHud = async () => {
    try {
      const res = await fetch("/api/user/hud");
      if (!res.ok) return;
      const data = await res.json();
      if (!data.hud) return;
      // Flash the pill if XP went up since last fetch
      if (prevXpRef.current !== null && data.hud.xp > prevXpRef.current) {
        setXpFlash(true);
        setTimeout(() => setXpFlash(false), 1200);
      }
      prevXpRef.current = data.hud.xp;
      setHud(data.hud);
    } catch {}
  };

  useEffect(() => {
    fetchHud();
    // Re-fetch whenever a quiz session completes
    window.addEventListener("journeyProgressUpdated", fetchHud);
    return () => window.removeEventListener("journeyProgressUpdated", fetchHud);
  }, []);

  useEffect(() => {
    setThemeMounted(true);
  }, []);

  useEffect(() => {
    setSearchOpen(false);
    setNoticeOpen(false);
    setIsChromeVisible(true);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollYRef.current;

      if (currentScrollY <= 24) {
        setIsChromeVisible(true);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      if (Math.abs(delta) < 12) {
        return;
      }

      if (delta > 0) {
        setIsChromeVisible(false);
      } else {
        setIsChromeVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    lastScrollYRef.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (searchOpen || noticeOpen) {
      setIsChromeVisible(true);
    }
  }, [noticeOpen, searchOpen]);

  useEffect(() => {
    const handleVisibilityEvent = (event) => {
      const nextVisible = event?.detail?.visible;

      if (typeof nextVisible === "boolean") {
        setIsChromeVisible(nextVisible);
      }
    };

    window.addEventListener("wordpapa:mobile-chrome-visibility", handleVisibilityEvent);

    return () => {
      window.removeEventListener("wordpapa:mobile-chrome-visibility", handleVisibilityEvent);
    };
  }, []);

  return (
    <>
      <div
        className={`md:hidden sticky top-0 z-[120] border-b border-black/5 bg-white/90 backdrop-blur-xl transition-transform duration-300 ease-out supports-[backdrop-filter]:bg-white/75 dark:border-white/10 dark:bg-[#090909]/90 dark:supports-[backdrop-filter]:bg-[#090909]/75 ${
          isChromeVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="px-3 pt-2 pb-2">
          <div className="flex items-center justify-between gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#86d437] via-[#75c32c] to-[#4d8c18] shadow-[0_6px_16px_rgba(117,195,44,0.25)] ring-1 ring-black/5">
                <Image
                  src="/logo192.png"
                  alt="WordPapa"
                  width={18}
                  height={18}
                  className="h-[18px] w-[18px] object-contain"
                  priority
                />
              </div>
              <p className="text-[0.95rem] font-black tracking-[-0.03em] text-zinc-950 dark:text-white">
                Word<span className="text-[#75c32c]">Papa</span>
              </p>
            </Link>

            {/* ── Game HUD pill: rank + XP ── */}
            {hud && (
              <Link
                href="/dashboard"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all active:scale-95 ${
                  xpFlash
                    ? "border-[#75c32c]/60 bg-[#75c32c]/10 shadow-[0_0_12px_rgba(117,195,44,0.35)]"
                    : "border-black/5 bg-zinc-100 dark:border-white/10 dark:bg-white/5"
                }`}
              >
                <span
                  className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md"
                  style={{ backgroundColor: hud.color + "22", color: hud.color }}
                >
                  {hud.name}
                </span>
                <span className="flex items-center gap-0.5 text-[10px] font-black tabular-nums text-zinc-700 dark:text-zinc-200">
                  <Zap size={9} className="text-[#75c32c]" strokeWidth={3} />
                  {hud.xp >= 1000
                    ? `${(hud.xp / 1000).toFixed(1)}k`
                    : hud.xp}
                </span>
              </Link>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-black/5 bg-zinc-100 text-zinc-700 transition active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200"
                aria-label="Toggle theme"
              >
                {themeMounted && (
                  <>
                    <SunIcon className="h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <MoonIcon className="absolute h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setNoticeOpen((current) => !current);
                  setSearchOpen(false);
                }}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-black/5 bg-zinc-100 text-zinc-700 transition active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200"
                aria-label="Open notifications"
              >
                <Bell className="h-5 w-5" strokeWidth={2.3} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-[#75c32c] dark:border-[#090909]" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchOpen((current) => !current);
                  setNoticeOpen(false);
                }}
                className={`flex h-9 w-9 items-center justify-center rounded-xl border transition active:scale-95 ${
                  searchOpen
                    ? "border-[#75c32c]/30 bg-[#75c32c] text-white shadow-[0_12px_24px_rgba(117,195,44,0.3)]"
                    : "border-black/5 bg-zinc-100 text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200"
                }`}
                aria-label="Open search"
              >
                <Search className="h-5 w-5" strokeWidth={2.4} />
              </button>
            </div>
          </div>

          {(searchOpen || noticeOpen) && (
            <div className="mt-2 overflow-hidden rounded-[1.75rem] border border-black/5 bg-white/95 p-2 shadow-[0_18px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#111111]/95">
              {searchOpen ? (
                <div>
                  <SearchBarNav />
                </div>
              ) : (
                <div className="rounded-[1.35rem] bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 p-4 text-white">
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/55">
                    Notifications
                  </p>
                  <p className="mt-2 text-sm font-bold leading-6 text-white/90">
                    No new alerts yet. Journey unlocks, streak nudges, and list activity can live here next.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Collections filter bar — slides with the chrome */}
        <CollectionsBar hideOnScroll={false} />
      </div>

      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-[120] bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-black/8 dark:border-white/8 transition-transform duration-300 ease-out ${
          isChromeVisible ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="grid grid-cols-5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isMatch(pathname, item);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-0.5 py-2 transition-all active:scale-90 ${
                  active ? "text-[#75c32c]" : "text-zinc-400 dark:text-zinc-500"
                }`}
              >
                <div className={`relative flex items-center justify-center w-10 h-7 rounded-2xl transition-all ${
                  active ? "bg-[#75c32c]/10" : ""
                }`}>
                  <Icon
                    className={`transition-all ${active ? "h-[18px] w-[18px]" : "h-[18px] w-[18px]"}`}
                    strokeWidth={active ? 2.8 : 2}
                  />
                  {item.spotlight && !active && (
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#75c32c]" />
                  )}
                </div>
                <span className={`text-[9px] font-bold tracking-tight ${active ? "font-black" : ""}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MobileAppChrome;
