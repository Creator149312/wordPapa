const MobileTopAdsUnit = ({ slot }) => {
  return (
    <div className="w-full bg-slate-50 dark:bg-slate-800 text-center px-0 md:mx-0 mt-1">
      <div
        className="justify-center"
        style={{ height: "358px", maxHeight: "358px" }}
      >
        <ins
          className="adsbygoogle max-w-[320px] sm:max-w-[640px]"
          style={{ display: "block", maxheight: "100%", maxHeight: "100%" }}
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
