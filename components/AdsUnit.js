const AdsUnit = ({ slot }) => {
  return (
    <div className="w-full bg-slate-50 text-center p-0 mx-auto mt-3 mb-3 min-h-64">
      <div className="text-sm text-center">Advertisement</div>
      <div className="mt-4">
      <ins
        className="adsbygoogle"
        style={{ display: 'inline-block' }}
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
