"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const TOPIC_TAGS = [
  { label: "All Lists", value: null },
  { label: "🐾 Animals", value: "animals" },
  { label: "🍎 Food & Drinks", value: "food" },
  { label: "💼 Business", value: "business" },
  { label: "⚖️ Law", value: "law" },
  { label: "💻 Technology", value: "technology" },
  { label: "⚽ Sports", value: "sports" },
  { label: "✈️ Travel", value: "travel" },
  { label: "🏥 Medical", value: "medical" },
  { label: "🎓 Academic", value: "academic" },
];

function BarInner({ hideOnScroll = true }) {
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftRef = useRef(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Scroll-hide/show — mirrors the MobileAppChrome logic
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (!hideOnScroll) return;
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      // Always show when at/near top
      if (currentY <= 10) {
        setVisible(true);
        lastScrollY.current = currentY;
        return;
      }

      // Ignore micro-jitter
      if (Math.abs(delta) < 6) return;

      setVisible(delta < 0); // show on scroll-up, hide on scroll-down
      lastScrollY.current = currentY;
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Also reset visibility on route change
  useEffect(() => {
    if (!hideOnScroll) return;
    setVisible(true);
    lastScrollY.current = 0;
  }, [pathname, hideOnScroll]);

  const isListsPage = pathname === "/lists" || pathname.startsWith("/lists/");
  const activeTag = isListsPage ? searchParams.get("tag") : "__none__";

  function onPointerDown(e) {
    if (!scrollRef.current) return;
    if (e.target.tagName === "A") return;
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.getBoundingClientRect().left;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
    scrollRef.current.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!isDragging.current || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.getBoundingClientRect().left;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
  }

  function onPointerUp() {
    isDragging.current = false;
  }

  return (
    <div
      className={`bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800/70 ${
        hideOnScroll
          ? `transition-transform duration-300 ease-out ${visible ? "translate-y-0" : "-translate-y-full"}`
          : ""
      }`}
    >
      <div
        ref={scrollRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="no-scrollbar flex overflow-x-auto gap-1.5 px-4 py-1.5 select-none touch-pan-x"
      >
        {TOPIC_TAGS.map(({ label, value }) => {
          const isActive = isListsPage && activeTag === value;
          const href = value ? `/lists?tag=${encodeURIComponent(value)}` : "/lists";
          return (
            <Link
              key={label}
              href={href}
              draggable={false}
              className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap border transition-all duration-150 ${
                isActive
                  ? "bg-[#75c32c] text-white border-[#75c32c] shadow-sm shadow-[#75c32c]/30"
                  : "bg-gray-100/80 dark:bg-white/5 text-gray-600 dark:text-gray-300 border-transparent hover:border-[#75c32c]/50 hover:text-[#75c32c] dark:hover:text-[#75c32c]"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function CollectionsBar({ hideOnScroll = true }) {
  return (
    <Suspense
      fallback={
        <div className="h-9 bg-white dark:bg-[#0a0a0a] border-b border-gray-100 dark:border-gray-800/70" />
      }
    >
      <BarInner hideOnScroll={hideOnScroll} />
    </Suspense>
  );
}
