const AdsUnit = ({ slot }) => {
  return (
    <div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6746947892342481"
        data-ad-slot={ slot }
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdsUnit;
