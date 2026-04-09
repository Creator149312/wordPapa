const AdsUnit = ({ slot, variant = "default" }) => {
  const minHeight = variant === "banner" ? "min-h-[90px]" : "min-h-64";
  return (
    <div className={`w-full relative rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60 text-center overflow-hidden ${minHeight}`}>
      <span className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-300 dark:text-gray-600 select-none">
        Advertisement
      </span>
      <div className="pt-5">
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
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
