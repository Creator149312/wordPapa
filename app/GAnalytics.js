import Script from 'next/script'

export default function GAnalytics() {
  return (<>
    <Script src="https://www.googletagmanager.com/gtag/js?id=G-X136WTSXEM" strategy="afterInteractive"/>
      <Script id="google-analytics"  strategy="afterInteractive">
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