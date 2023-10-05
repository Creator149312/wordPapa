"use client"
import React, { useState } from 'react';

function HaikuChecker() {
  const [inputText, setInputText] = useState('');
  const [isHaiku, setIsHaiku] = useState(false);

  // Function to count syllables in a word
  function countSyllables(word) {
    word = word.toLowerCase();
    let count = 0;
    const vowels = "aeiouy";
    if (word[0] in vowels) {
      count += 1;
    }
    for (let i = 1; i < word.length; i++) {
      if (word[i] in vowels && word[i - 1] !== vowels) {
        count += 1;
      }
    }
    if (word.endsWith("e")) {
      count -= 1;
    }
    if (word.endsWith("le") && word.length > 2 && word[word.length - 3] !== vowels) {
      count += 1;
    }
    if (count === 0) {
      count = 1;
    }
    return count;
  }

  // Function to check if a line is a Haiku line (5, 7, or 5 syllables)
  function isHaikuLine(line) {
    const syllables = line.split(' ').map(word => countSyllables(word));
    const totalSyllables = syllables.reduce((acc, curr) => acc + curr, 0);
    return totalSyllables === 5 || totalSyllables === 7 || totalSyllables === 5;
  }

  // Function to check if the input text is a Haiku (5-7-5 syllable structure)
  function checkHaiku() {
    const lines = inputText.trim().split('\n');
    if (lines.length === 3 && lines.every(line => isHaikuLine(line))) {
      setIsHaiku(true);
    } else {
      setIsHaiku(false);
    }
  }

  return (
    <div>
      <h1>Haiku Checker</h1>
      <textarea
        rows="5"
        cols="40"
        placeholder="Enter your Haiku here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      ></textarea>
      <button onClick={checkHaiku}>Check Haiku</button>
      {isHaiku && <p>This is a Haiku!</p>}
      {!isHaiku && <p>This is not a Haiku.</p>}
    </div>
  );
}

export default HaikuChecker;
