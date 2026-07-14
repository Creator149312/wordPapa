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
        // Ensure the task is truly deferred to a non-blocking frame
        const push = () => (window.adsbygoogle = window.adsbygoogle || []).push({});
        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(() => setTimeout(push, 50));
        } else {
          setTimeout(push, 200);
        }
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
          data-full-width-responsive={variant === "header" || variant === "banner" ? "true" : "false"}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

const AdsUnit = ({ slot, variant = "default", index = 0, sticky = false }) => {
  const pathname = usePathname();
  // Global/Sticky ads (like header/footer) shouldn't remount on every navigation
  // this prevents "Heavy Ad Intervention" from Chrome by not churning iframes.
  const refreshKey = sticky ? "sticky" : pathname;
  
  return <AdsUnitInner key={`${refreshKey}-${slot}-${index}`} slot={slot} variant={variant} />;
};

export default AdsUnit;

