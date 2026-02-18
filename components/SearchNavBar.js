"use client";

import commonLinks from "@utils/commonLinks";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import FINALCLEANWORDS from "../app/browse/FINALCLEANWORDS";

const SearchBarNav = () => {
  const [selectedOption, setSelectedOption] = useState("/define/");
  const [word, setWord] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const pathname = usePathname();
  const [inputError, setInputError] = useState(false);
  const [placeholder, setPlaceHolder] = useState(
    "Enter Word to Find Definitions",
  );

  const urlOptions = [
    {
      value: commonLinks.definition,
      label: "Word Dictionary",
      placeholder: "Enter Word to Find Definitions",
    },
    {
      value: commonLinks.wordfinder,
      label: "Word Finder",
      placeholder: "Enter Letters to Unscramble",
    },
    {
      value: commonLinks.thesaurus,
      label: "Thesaurus",
      placeholder: "Enter Word to Find Synonyms",
    },
    {
      value: commonLinks.rhyming,
      label: "Rhyming Dictionary",
      placeholder: "Enter Word to Find Rhyming Words",
    },
    {
      value: commonLinks.syllables,
      label: "Syllable Counter",
      placeholder: "Enter Word to Count Syllables",
    },
    {
      value: commonLinks.adjectives,
      label: "Adjectives Finder",
      placeholder: "Enter Word to Find Adjectives",
    },
  ];

  function checkOptionInSearch(obj, stringA) {
    return Object.values(obj).includes(stringA);
  }

  function findPlaceholder(selectedValue) {
    const option = urlOptions.find((opt) => opt.value === selectedValue);
    if (option) setPlaceHolder(option.placeholder);
  }

  useEffect(() => {
    let path = pathname.split("/")[1];
    let ifOptionInSearchBar = checkOptionInSearch(
      commonLinks,
      "/" + path + "/",
    );
    if (path !== "" && ifOptionInSearchBar) {
      setSelectedOption(`/${path}/`);
    }
    findPlaceholder(`/${path}/`);
  }, [pathname]);

  const handleKeyPress = (event) => {
    if (!inputError && event.key === "Enter") {
      handleLoadUrl();
    }
  };

  const handleOptionChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    findPlaceholder(value);
  };

  const handleLoadUrl = () => {
    if (selectedOption && word) {
      let encodedWord = "";
      try {
        encodedWord = decodeURIComponent(
          word.toLowerCase().replace(/\?/g, "_"),
        );
      } catch {
        encodedWord = "";
      }
      window.location.href = selectedOption + encodedWord;
    }
  };

  function sanitizeInput(input) {
    let regex = /^[a-zA-Z' \-?0-9]+$/;
    if (input.length > 0) {
      if (regex.test(input)) {
        if (input.includes("?")) {
          const questionMarks = (input.match(/\?/g) || []).length;
          if (questionMarks <= 3) return input;
          return null;
        }
        return input;
      }
      return null;
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value;
    const isInputGood = sanitizeInput(value);
    if (isInputGood !== null) {
      setWord(value);
      setInputError(false);

      // Only show suggestions if 2+ letters typed
      if (value.length >= 2) {
        const filtered = FINALCLEANWORDS.filter((w) =>
          w.toLowerCase().startsWith(value.toLowerCase()),
        ).slice(0, 8);
        setSuggestions(filtered);
      } else {
        setSuggestions([]);
      }
    } else {
      setInputError(true);
      setSuggestions([]);
    }
  };

  return (
    <div className="relative w-full md:w-[60%] m-auto p-2">
      <div className="grid md:grid-cols-6">
        <select
          value={selectedOption}
          onChange={handleOptionChange}
          className="p-2 md:mr-2 border-2 md:col-span-2 text-sm rounded-l-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring focus:ring-blue-300"
          name="tool"
        >
          {urlOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="md:col-span-4 flex border-2 rounded-r-md items-center relative bg-white dark:bg-gray-800">
          <input
            className={`flex-grow text-sm px-2 py-2 focus:outline-none bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 ${
              inputError ? "border-red-500" : ""
            }`}
            type="text"
            placeholder={placeholder}
            value={word}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />

          <button
            onClick={handleLoadUrl}
            disabled={inputError}
            className="flex items-center justify-center h-full px-3 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
            aria-label="Search"
          >
            <FiSearch size={24} />
          </button>

          {/* Suggestions dropdown */}
          {suggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md z-10">
              {suggestions.map((s, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    setWord(s);
                    setSuggestions([]);
                    window.location.href = selectedOption + s.toLowerCase();
                  }}
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBarNav;
