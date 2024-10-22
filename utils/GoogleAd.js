'use client'
import { useEffect } from 'react';

const GoogleAd = ({slotID}) => {
  useEffect(() => {
    // Create a function to load the Google Ads script
    const loadGoogleAdsScript = () => {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6746947892342481';
      script.async = true;
      script.crossorigin = "anonymous";
      script.onload = () => {
        // Load the ad units once the script has fully loaded
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      };
      document.body.appendChild(script);
    };

    // Add an event listener for the window.onload event
    window.onload = loadGoogleAdsScript;

    // Clean up the event listener when the component unmounts
    return () => {
      window.onload = null;
    };

  }, []); 

  return (
    <div>
      {/* This div is used as a placeholder for the ad */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6746947892342481"
        data-ad-slot={slotID}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default GoogleAd;
