"use client";
import { useState } from "react";
const SearchBarNav = () => {
  const [selectedOption, setSelectedOption] = useState("/adjectives/");
  const [word, setWord] = useState("");

  const urlOptions = [
    { value: "/adjectives/", label: "Find Adjectives" },
    { value: "/rhyming-words/", label: "Find Rhyming Words" },
    { value: "/synonyms/", label: "Find Synonyms" },
    { value: "/syllables/", label: "Count Syllables in" },
    { value: "/homophones/", label: "Find Homophones" },
  ];

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleLoadUrl = () => {
    if (selectedOption && word) {
      window.location.href = selectedOption + word + "/";
    }
  };

  return (
    <>
      <div className="search-bar-nav">
        <select
          value={selectedOption}
          onChange={handleOptionChange}
          className="search-select input-lg"
        >
          {urlOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <input
          className="input-lg search-input"
          type="text" 
          placeholder="Type Your Word Here..."
          onChange={(e) => setWord(e.target.value)}
        />
        <button onClick={handleLoadUrl} className="search-button">
          Search
        </button>
      </div>
    </>
  );
};

export default SearchBarNav;
