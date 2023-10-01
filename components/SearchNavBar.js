"use client";
import { useState } from "react";
const SearchBarNav = () => {
  const [selectedOption, setSelectedOption] = useState("/adjectives-finder/");
  const [word, setWord] = useState("");

  const urlOptions = [
    { value: "/adjectives-finder/", label: "Find Adjectives" },
    { value: "/rhyming-words/", label: "Rhyming Words" },
    { value: "/similar-words/", label: "Similar Words" },
    { value: "/homophones-finder/", label: "Homophones Words" },
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
          {" "}
          {urlOptions.map((option) => (
            <option key={option.value} value={option.value}>
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
        <button onClick={handleLoadUrl} className="search-button">
          Search
        </button>
      </div>
    </>
  );
};

export default SearchBarNav;
