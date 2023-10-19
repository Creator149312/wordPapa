import React from 'react';

const AlphabetLinks = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  return (
    <div>
      {alphabet.split('').map((letter, index) => (
        <a key={index} href={`#${letter}`}>{letter}{letter.toLowerCase()}</a>
      ))}
    </div>
  );
};

export default AlphabetLinks;
