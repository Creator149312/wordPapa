const AlphabetLinks = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  return (
    <div className='max-w-6xl mx-auto px-6 py-10'>
      <div className="flex items-center gap-3 mb-6 ml-2">
        <div className="h-6 w-1.5 bg-[#75c32c] rounded-full" />
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
          Browse by Alphabet
        </h2>
      </div>
      
      <div className='flex flex-wrap justify-center gap-2'>
        {/* Number/Symbol Link */}
        <a 
          href={`/browse/0`} 
          className='min-w-[45px] h-[45px] flex items-center justify-center bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 font-bold rounded-xl shadow-sm hover:border-[#75c32c] hover:text-[#75c32c] hover:shadow-lg hover:shadow-[#75c32c]/20 hover:-translate-y-1 transition-all duration-200'
        >
          #
        </a>

        {/* Alphabet Links */}
        {alphabet.split('').map((letter, index) => (
          <a 
            key={index} 
            href={`/browse/${letter.toLowerCase()}`} 
            className='min-w-[55px] h-[45px] flex items-center justify-center bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-200 font-black rounded-xl shadow-sm hover:border-[#75c32c] hover:text-[#75c32c] hover:shadow-lg hover:shadow-[#75c32c]/20 hover:-translate-y-1 transition-all duration-200'
          >
            {letter}<span className="text-[10px] opacity-50 ml-0.5">{letter.toLowerCase()}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default AlphabetLinks;