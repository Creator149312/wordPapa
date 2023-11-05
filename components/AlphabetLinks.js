import React from 'react';

const AlphabetLinks = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  return (
    <div className='text-center'>
      {alphabet.split('').map((letter, index) => (
        <a key={index} href={`/browse/${letter.toLowerCase()}`} className='custom-button-small'>{letter}{letter.toLowerCase()}</a>
      ))}
    </div>
  );
};

export default AlphabetLinks;
