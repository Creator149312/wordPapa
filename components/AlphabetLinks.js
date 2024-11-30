const AlphabetLinks = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  return (
    <div className='text-center'>
      {<a key={0} href={`/browse/0`} className='bg-[#75c32c] border-0 p-[0.60rem] m-1 rounded-sm shadow-lg inline-block'>#</a>}
      {alphabet.split('').map((letter, index) => (
        <a key={index} href={`/browse/${letter.toLowerCase()}`} className='bg-[#75c32c] border-0 p-[0.60rem] m-1 rounded-sm shadow-lg inline-block'>{letter}{letter.toLowerCase()}</a>
      ))}
    </div>
  );
};

export default AlphabetLinks;
