"use client";
import { useEffect } from "react";

const AdsScriptLoader = () => {
  let scriptLoaded = false;
  useEffect(() => {
    if (typeof document !== "undefined") {
      const adElements = document.querySelectorAll(".adsbygoogle"); // Select all ad slots
      const timeoutId = setTimeout(() => {
        if (!scriptLoaded) {
          loadAdsScript();
        }
      }, 5000);

      const isMobile = () => /Mobi|Android/i.test(navigator.userAgent);

      const loadAdsScript = () => {
        const script = document.createElement("script");
        script.src =
          "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6746947892342481";
        script.crossorigin = "anonymous";
        script.async = true;
        script.onload = () => {
          if (!isMobile()) {
            //if it is desktop device we load ads after script is loaded
            var ads = document.getElementsByClassName("adsbygoogle").length;
            for (var i = 0; i < ads; i++) {
              try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
              } catch (e) {}
            }
          }
          scriptLoaded = true;
        };
        document.body.appendChild(script);
      };

      const loadAd = () => {
        // Push an ad into the adsbygoogle array
        try {
          window.adsbygoogle = window.adsbygoogle || [];
          window.adsbygoogle.push({});
        } catch (e) {}
      };

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && scriptLoaded) {
              loadAd();
              observer.unobserve(entry.target); // Stop observing after loading
            }
          });
        },
        { threshold: 0.02 }
      );

      const handleInteraction = () => {
        clearTimeout(timeoutId);
        if (!scriptLoaded) {
          loadAdsScript();
        }
      };

      if (isMobile()) {
        adElements.forEach((adElement) => {
          observer.observe(adElement); // Observe each ad element
        });

        document.addEventListener("scroll", handleInteraction);
      } else {
        const events = [
          "mousemove",
          "click",
          "scroll",
          "keypress",
          "touchstart",
        ];
        events.forEach((event) => {
          document.addEventListener(event, handleInteraction);
        });
      }

      return () => {
        if (isMobile()) {
          document.removeEventListener("scroll", handleInteraction);

          adElements.forEach((adElement) => {
            observer.unobserve(adElement);
          });
        } else {
          const events = [
            "mousemove",
            "click",
            "scroll",
            "keypress",
            "touchstart",
          ];
          events.forEach((event) => {
            document.removeEventListener(event, handleInteraction);
          });
        }
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

// function newFunction(scriptLoaded) {
//   return scriptLoaded;
// }
