"use client";
import { useEffect } from "react";

const AdsScriptLoader = () => {
  useEffect(() => {
    if (typeof document !== "undefined") {
      let scriptLoaded = false;
      // const timeoutId = setTimeout(() => {
      //   if (!scriptLoaded) {
      //     scriptLoaded = newFunction(scriptLoaded);
      //   }
      // }, 6000);

      const handleInteraction = () => {
        // clearTimeout(timeoutId);
        if (!scriptLoaded) {
          scriptLoaded = newFunction(scriptLoaded);
        }
      };

      document.addEventListener("mousemove", handleInteraction);
      document.addEventListener("scroll", handleInteraction);
      // document.addEventListener("keypress", handleInteraction);
      // document.addEventListener("touchstart", handleInteraction);
      document.addEventListener("load", handleInteraction);

      return () => {
        // Cleanup function to remove event listeners on component unmount
        document.removeEventListener("mousemove", handleInteraction);
        document.removeEventListener("scroll", handleInteraction);
        // document.removeEventListener("keypress", handleInteraction);
        // document.removeEventListener("touchstart", handleInteraction);
        document.removeEventListener("load", handleInteraction);
      };
    }
  }, []);

  return (
    <div>
      {/* Your page content */}
      {/* Conditionally render ad code here (similar to hook approach) */}
    </div>
  );
};

export default AdsScriptLoader;

function newFunction(scriptLoaded) {
  const script = document.createElement("script");
  script.src =
    "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6746947892342481";
  script.crossorigin = "anonymous";
  script.async = true;
  script.onload = () => {
    var ads = document.getElementsByClassName("adsbygoogle").length;
    for (var i = 0; i < ads; i++) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {}
    }
  };
  document.body.appendChild(script);
  scriptLoaded = true;
  return scriptLoaded;
}
