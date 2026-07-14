"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const AdsUnitInner = ({ slot, variant }) => {
  const insRef = useRef(null);

  useEffect(() => {
    const el = insRef.current;
    if (!el) return;

    const schedulePush = () => {
      if (typeof requestIdleCallback !== "undefined") {
        requestIdleCallback(doPush, { timeout: 2000 });
      } else {
        setTimeout(doPush, 0);
      }
    };

    function doPush() {
      if (!el.isConnected) return;
      if (el.dataset.adsActualPushed) return;
      if (el.getAttribute("data-adsbygoogle-status")) return;
      
      el.dataset.adsActualPushed = "1";
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        // Safe to ignore race conditions
      }
    }

    const ro = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect?.width ?? 0;
      if (width === 0) return;
      
      if (el.dataset.adsScheduled || el.getAttribute("data-adsbygoogle-status")) {
        ro.disconnect();
        return;
      }

      el.dataset.adsScheduled = "1";
      el.classList.add("adsbygoogle");
      ro.disconnect();
      schedulePush();
    });

    ro.observe(el);

    return () => ro.disconnect();
  }, [slot]);

  const containerHeight =
    variant === "header" ? "h-[100px]" :
    variant === "banner" ? "h-[90px]" :
    variant === "bottom-fixed" ? "h-[250px] md:h-[280px]" :
    variant === "tall"   ? "h-[600px]" :
                           "h-[280px]";

  const adFormat = 
    variant === "header" ? "horizontal" :
    variant === "banner" ? "horizontal" :
    variant === "bottom-fixed" ? "auto" :
    variant === "tall"   ? "vertical" :
                           "auto";

  return (
    <div className={`w-full relative rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60 text-center overflow-hidden ${containerHeight}`}>
      <span className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-300 dark:text-gray-600 select-none">
        Advertisement
      </span>
      <div className="pt-5 h-full">
        <ins
          ref={insRef}
          style={{ display: "block", width: "100%", height: "100%" }}
          data-ad-client="ca-pub-6746947892342481"
          data-ad-slot={slot}
          data-ad-format={adFormat}
          data-full-width-responsive={variant === "tall" ? "false" : "true"}
        />
      </div>
    </div>
  );
};

const AdsUnit = ({ slot, variant = "default", index = 0 }) => {
  const pathname = usePathname();
  // Using pathname and index in key forces component to remount on route change,
  // triggering a fresh ad load for the new page. Also handles multiple ads of same slot.
  return <AdsUnitInner key={`${pathname}-${slot}-${index}`} slot={slot} variant={variant} />;
};

export default AdsUnit;

