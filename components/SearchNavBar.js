"use client";
import commonLinks from "@utils/commonLinks";
import { useState } from "react";
const SearchBarNav = () => {
  const [selectedOption, setSelectedOption] = useState("/define/");
  const [word, setWord] = useState("");

  const urlOptions = [
    { value: commonLinks.definition, label: "Definition and Examples" },
    { value: commonLinks.adjectives, label: "Find Adjectives" },
    { value: commonLinks.rhyming, label: "Find Rhyming Words" },
    { value: commonLinks.thesaurus, label: "Find Synonyms" },
    { value: commonLinks.syllables, label: "Count Syllables in" },
    // { value: "/homophones/", label: "Find Homophones" },
  ];

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleLoadUrl = () => {
    if (selectedOption && word) {
      let encodedWord = decodeURIComponent(word.toLowerCase()).split(' ').join('-');
      window.location.href = selectedOption + encodedWord + "/";
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
          className="input-xlg search-input"
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
