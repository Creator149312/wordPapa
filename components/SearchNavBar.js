"use client";
import commonLinks from "@utils/commonLinks";
import { useState } from "react";
import { usePathname } from 'next/navigation'

const SearchBarNav = () => {
  const [selectedOption, setSelectedOption] = useState("/define/");
  const [word, setWord] = useState("");
  const [path, setPath] = usePathname();

  const urlOptions = [
    { value: commonLinks.definition, label: "Word Dictionary" },
    { value: commonLinks.adjectives, label: "Find Adjectives" },
    { value: commonLinks.rhyming, label: "Find Rhyming Words" },
    { value: commonLinks.thesaurus, label: "Thesaurus" },
    { value: commonLinks.syllables, label: "Count Syllables in" },
    // { value: "/homophones/", label: "Find Homophones" },
  ];

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleLoadUrl = () => {
    if (selectedOption && word) {
      // let encodedWord = decodeURIComponent(word.toLowerCase()).split(' ').join('-');
      let encodedWord = "";

      try {
        encodedWord = decodeURIComponent(word.toLowerCase());
      } catch (error) {
        // Handle the error
        // You might choose to assign a default value in case of an error
        encodedWord = "";
      }

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
          name="tool"
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
