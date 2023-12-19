export default function GAnalytics() {
  return (<>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-X136WTSXEM"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments)}
      gtag('js', new Date());
    
      gtag('config', 'G-X136WTSXEM');
    </script>
    </>
  );
}