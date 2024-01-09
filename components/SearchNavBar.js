"use client";

import commonLinks from "@utils/commonLinks";
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation'

//usage of SessionStore is causing website to load slowly
const SearchBarNav = () => {
  const [selectedOption, setSelectedOption] = useState("/define/");
  const [word, setWord] = useState("");
  const pathname = usePathname();

  const urlOptions = [
    { value: commonLinks.definition, label: "Word Dictionary" },
    { value: commonLinks.adjectives, label: "Find Adjectives" },
    { value: commonLinks.rhyming, label: "Find Rhyming Words" },
    { value: commonLinks.thesaurus, label: "Thesaurus" },
    { value: commonLinks.syllables, label: "Count Syllables in" },
    { value: commonLinks.wordfinder, label: "Word Finder" },
  ];

  function checkOptionInSearch(obj, stringA) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] === stringA) {
          return true; // Found a match
        }
      }
    }
    return false; // No match found
  }

  // set selected Option based on page URL after page has loaded
  useEffect(() => {
    let path = pathname.split("/")[1];
    let ifOptionInSearchBar = checkOptionInSearch(commonLinks, "/"+path+"/")
    if(path != "" && ifOptionInSearchBar){
      setSelectedOption(`/${path}/`);
    }
  }, [pathname]);

  //this is used to facilitate Enter key press 
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLoadUrl();
    }
  };

  const handleOptionChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
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
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleLoadUrl} className="search-button">
          Search
        </button>
      </div>
    </>
  );
};

export default SearchBarNav;
