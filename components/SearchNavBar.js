'use client'
import {useState} from 'react';
const SearchBarNav = () => {
  const [selectedUrl, setSelectedUrl] = useState('');
  const [word, setWord] = useState('');
  const urlOptions = [
    { value: '/adjectives-finder/', label: 'Find Adjectives' },
    { value: '/rhyming-words/', label: 'Rhyming Words' },
    { value: '/similar-words/', label: 'Similar Words' },
    { value: '/homophones-finder/', label: 'Homophones Words' },
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
    <>
    <div className="search-bar-nav">
      <select
        value={selectedUrl}
        onChange={handleUrlChange}
        className="search-select input-lg"
      ><option>Choose Your Operation </option>
        {urlOptions.map((option) => (
          <option key={option.value} value={ option.value +""+word}>
            {option.label}
          </option>
        ))}
      </select>
      <input
      className="input-lg search-input"
        type="text"
        placeholder="Type Your Word or Phrase"
        onChange={(e) => setWord(e.target.value)}
      />
      <button onClick={handleLoadUrl} className="search-button">Search</button>
    </div>
  </>
  );
};

export default SearchBarNav;
