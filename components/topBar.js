const TopBar = () => {
  return (
    <div className="w-full shadow-md m-0 p-0 mx-auto">
      <div className="w-full bg-slate-50 dark:bg-slate-800 text-center px-0 md:mx-0 mt-1 min-h-64">
        <div className="text-xs text-center">Advertisement</div>
        <div className="justify-center">
          <ins
            className="adsbygoogle max-w-[320px] sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px]"
            style={{ display: "block" }}
            data-ad-client="ca-pub-6746947892342481"
            data-ad-slot={"1177026196"}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
