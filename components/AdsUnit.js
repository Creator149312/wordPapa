"use client";
import { useEffect, useRef, useMemo } from "react";
import { usePathname } from "next/navigation";

/** 
 * AD_CONFIG defines the strict layout boundaries for different ad types.
 * Standardizing these prevents Cumulative Layout Shift (CLS).
 */
const AD_CONFIG = {
  header: {
    classes: "h-[90px] md:h-[100px] max-h-[90px] md:max-h-[100px]",
    intrinsic: "100px", 
    format: "horizontal",
    responsive: "false",
    padding: "pt-0"
  },
  tall: {
    classes: "min-h-[600px]",
    intrinsic: "600px",
    format: "vertical",
    responsive: "false",
    padding: "pt-5"
  },

  // Default covers "square" or "rectangle" in-content ads and "bottom-fixed"
  default: {
    classes: "min-h-[280px]",
    intrinsic: "280px",
    format: "auto",
    responsive: "true",
    padding: "pt-5"
  }
};

const AdsUnitInner = ({ slot, variant }) => {
  const insRef = useRef(null);
  
  // Map variant to config, fallback to default
  const config = useMemo(() => AD_CONFIG[variant] || AD_CONFIG.default, [variant]);

  useEffect(() => {
    const el = insRef.current;
    if (!el) return;

    const schedulePush = () => {
      if (typeof requestIdleCallback !== "undefined") {
        requestIdleCallback(doPush, { timeout: 3000 });
      } else {
        setTimeout(doPush, 500);
      }
    };

    function doPush() {
      if (!el.isConnected || el.dataset.adsActualPushed || el.getAttribute("data-adsbygoogle-status")) return;
      
      el.dataset.adsActualPushed = "1";
      try {
        const push = () => (window.adsbygoogle = window.adsbygoogle || []).push({});
        
        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => setTimeout(push, 100));
          });
        } else {
          setTimeout(push, 500);
        }
      } catch (e) {}
    }

    const ro = new ResizeObserver((entries) => {
      if ((entries[0]?.contentRect?.width ?? 0) === 0) return;
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

  return (
    <div 
      className={`w-full relative rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60 text-center overflow-hidden ${config.classes}`}
      style={{ containIntrinsicSize: `auto ${config.intrinsic}`, contentVisibility: "auto" }}
    >
      <span className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-300 dark:text-gray-600 select-none z-10">
        Advertisement
      </span>

      <div className={`${config.padding} h-full`}>
        <ins
          ref={insRef}
          style={{ display: "block", width: "100%", height: "100%" }}
          data-ad-client="ca-pub-6746947892342481"
          data-ad-slot={slot}
          data-ad-format={config.format}
          data-full-width-responsive={config.responsive}
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

