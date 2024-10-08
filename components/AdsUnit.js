const AdsUnit = ({ slot }) => {
  return (
    <div className="w-full bg-slate-50 dark:bg-slate-800 text-center px-0 md:mx-0 mt-3 mb-3 min-h-64">
      <div className="text-sm text-center">Advertisement</div>
      <div className="mt-4 justify-center">
      <ins
        className="adsbygoogle max-w-[320px] sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px]"
        style={{ display: 'block'}}
        data-ad-client="ca-pub-6746947892342481"
        data-ad-slot={ slot }
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      </div>
    </div>
  );
};

export default AdsUnit;
