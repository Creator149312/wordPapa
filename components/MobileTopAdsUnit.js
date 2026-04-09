const MobileTopAdsUnit = ({ slot }) => {
  return (
    <div className="w-full bg-slate-50 dark:bg-slate-800 text-center px-0 md:mx-0 mt-1">
      {/* Fixed height reserves layout space to prevent CLS */}
      <div
        className="flex justify-center"
        style={{ height: "280px" }}
      >
        <ins
          className="adsbygoogle max-w-[320px] sm:max-w-[640px]"
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

export default MobileTopAdsUnit;
