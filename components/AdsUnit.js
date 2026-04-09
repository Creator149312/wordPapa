const AdsUnit = ({ slot, variant = "default" }) => {
  // Fixed heights (not min-height) are required to prevent CLS — Google AdSense
  // dynamically injects an iframe whose height differs from a min-height container,
  // shifting page content below the ad unit.
  const containerHeight =
    variant === "banner" ? "h-[90px]" :
    variant === "tall"   ? "h-[600px]" :
                           "h-[280px]"; // default = medium rectangle 300×280
  return (
    <div className={`w-full relative rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60 text-center overflow-hidden ${containerHeight}`}>
      <span className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-300 dark:text-gray-600 select-none">
        Advertisement
      </span>
      <div className="pt-5 h-full">
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "100%" }}
        data-ad-client="ca-pub-6746947892342481"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      </div>
    </div>
  );
};

export default AdsUnit;
