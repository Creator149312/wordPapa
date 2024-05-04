const AdsUnit = ({ w="100%", h="100%", slot }) => {
  return (
    <div>
      <ins
        className="adsbygoogle"
        style={{ display: 'inline-block', width: w, height: h }}
        data-ad-client="ca-pub-6746947892342481"
        data-ad-slot={ slot }
      />
    </div>
  );
};

export default AdsUnit;
