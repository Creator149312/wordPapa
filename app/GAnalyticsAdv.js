'use client'
import Script from 'next/script'
import { useState, useEffect } from 'react';

export default function GAnalyticsAdv() {

    const [showComponent, setShowComponent] = useState(false);

    useEffect(() => {
        // This useEffect hook runs after the initial render
        // Set a timeout to delay the import of the package after the page has loaded
        const timer = setTimeout(() => {
            setShowComponent(true);
        }, 1000); // Delay the import by 5 seconds after page load

        // Clean up the timeout when the component unmounts
        return () => clearTimeout(timer);
    }, []); // Empty dependency array ensures this effect only runs once after initial render


    return (showComponent && <> {console.log("Analytics code is added")}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-X136WTSXEM" strategy="afterInteractive" />
        <Script id="google-analytics">
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-X136WTSXEM');
        `}
        </Script>
    </>
    );
}