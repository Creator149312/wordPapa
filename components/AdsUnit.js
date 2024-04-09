const AdsUnit = ({ w, h, slot }) => {
  return (
    <div style={{backgroundColor: '#f0f0f0'}}>
      <ins
        className="adsbygoogle"
        style={{ display: 'inline-block', width: w, height: h }}
        data-ad-client="ca-pub-6746947892342481"
        data-ad-slot={{ slot }}
      />
    </div>
  );
};

export default AdsUnit;
