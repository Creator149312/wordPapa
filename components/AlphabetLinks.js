import Link from 'next/link';
import React from 'react';

const AlphabetLinks = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  return (
    <div className='text-center'>
      {<Link key={0} href={`/browse/0`} className='custom-button-small'>#</Link>}
      {alphabet.split('').map((letter, index) => (
        <Link key={index} href={`/browse/${letter.toLowerCase()}`} className='custom-button-small'>{letter}{letter.toLowerCase()}</Link>
      ))}
    </div>
  );
};

export default AlphabetLinks;
