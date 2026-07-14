"use client";
import { useEffect } from "react";

const AdsScriptLoader = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let loaded = false;
    const ADS_ID = "ca-pub-6746947892342481"; 

    const loadAdsScript = () => {
      if (loaded) return;
      loaded = true;

      const script = document.createElement("script");
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_ID}`;
      script.crossOrigin = "anonymous";
      script.async = true;
      // Use fetchpriority="low" to ensure the script doesn't compete with LCP images
      script.setAttribute("fetchpriority", "low");
      document.head.appendChild(script);
    };

    // Setup Interaction Listeners immediately on mount
    const activityEvents = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    const listenerOptions = { once: true, passive: true };

    const handleActivity = () => {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(() => loadAdsScript());
      } else {
        loadAdsScript();
      }
      cleanUpListeners();
    };

    const cleanUpListeners = () => {
      activityEvents.forEach((event) => {
        document.removeEventListener(event, handleActivity, listenerOptions);
      });
    };

    activityEvents.forEach((event) => {
      document.addEventListener(event, handleActivity, listenerOptions);
    });

    return () => {
      cleanUpListeners();
    };
  }, []);

  return null;
};

export default AdsScriptLoader;

