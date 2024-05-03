import Link from 'next/link';
import React from 'react';

const AlphabetLinks = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  return (
    <div className='text-center'>
      {<Link key={0} href={`/browse/0`} className='bg-[#75c32c] border-0 p-[0.60rem] m-1 rounded-sm shadow-lg inline-block'>#</Link>}
      {alphabet.split('').map((letter, index) => (
        <Link key={index} href={`/browse/${letter.toLowerCase()}`} className='bg-[#75c32c] border-0 p-[0.60rem] m-1 rounded-sm shadow-lg inline-block'>{letter}{letter.toLowerCase()}</Link>
      ))}
    </div>
  );
};

export default AlphabetLinks;
