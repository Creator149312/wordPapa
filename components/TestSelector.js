'use client';
import React, { useState } from 'react';

const TestSelector = () => {
  const [selectedUrl, setSelectedUrl] = useState('');
  const [word, setWord] = useState('');
  const urlOptions = [
    { value: '/adjectives-finder/', label: 'Find Adjectives' },
    { value: '/rhyming-words/', label: 'Rhyming Words' },
    { value: '/similar-words/', label: 'Similar Words' },
  ];

  const handleUrlChange = (e) => {
    setSelectedUrl(e.target.value);
  };

  const handleLoadUrl = () => {
    if (selectedUrl) {
      window.location.href = selectedUrl;
    }
  };

  return (
    <div>
      <h2>URL Loader</h2>
      <input type="text" onChange={(e) => {setWord(e.target.value)}}/>
      <select
        value={selectedUrl}
        onChange={handleUrlChange}
      >
        <option value="" disabled>Select a URL</option>
        {urlOptions.map((option) => (
          <option key={option.value} value={ option.value + word}>
            {option.label}
          </option>
        ))}
      </select>
      <button onClick={handleLoadUrl}>Search</button>
    </div>
  );
};

export default TestSelector;
