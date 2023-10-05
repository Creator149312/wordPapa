"use client"
import React, { useState } from 'react';
import axios from "axios";

const HaikuChecker = () => {
  const [inputText, setInputText] = useState('');
  const [isHaiku, setIsHaiku] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const countSyllables = async (word) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate an asynchronous API request (replace with your actual API call)
      const response = await axios.get(`https://api.datamuse.com/words?sp=${word}&qe=sp&md=s&max=1`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.data[0];
      setData(data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

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
