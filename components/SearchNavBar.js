"use client";

import commonLinks from "@utils/commonLinks";
import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import FINALCLEANWORDS from "../app/browse/FINALCLEANWORDS";

const TOOL_OPTIONS = [
  { value: commonLinks.definition, label: "Dictionary", placeholder: "Define a word..." },
  { value: commonLinks.wordfinder, label: "Finder", placeholder: "Letters to unscramble..." },
  { value: commonLinks.thesaurus, label: "Thesaurus", placeholder: "Find synonyms..." },
  { value: commonLinks.rhyming, label: "Rhymes", placeholder: "Find rhyming words..." },
  { value: commonLinks.syllables, label: "Syllables", placeholder: "Count syllables..." },
  { value: commonLinks.adjectives, label: "Adjectives", placeholder: "Find adjectives..." },
];

const SearchBarNav = () => {
  const [selectedOption, setSelectedOption] = useState("/define/");
  const [word, setWord] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputError, setInputError] = useState(false);
  const isListsSearch = pathname.startsWith("/lists");

  // Sync state with URL on initial load
  useEffect(() => {
    if (isListsSearch) {
      setSelectedOption("/lists");
      setWord(searchParams.get("search") || "");
      setSuggestions([]);
      setInputError(false);
      return;
    }

    let path = pathname.split("/")[1];
    const option = TOOL_OPTIONS.find(opt => opt.value === `/${path}/`);
    if (option) {
      setSelectedOption(option.value);
    }
  }, [isListsSearch, pathname, searchParams]);

  useEffect(() => {
    if (!isListsSearch) {
      return;
    }

    const query = word.trim();

    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timerId = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/list?search=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        const data = await response.json();
        const nextSuggestions = (data.lists || [])
          .map((list) => list.title)
          .filter(Boolean)
          .slice(0, 6);
        setSuggestions(nextSuggestions);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("List search suggestions failed:", error);
        }
      }
    }, 160);

    return () => {
      window.clearTimeout(timerId);
      controller.abort();
    };
  }, [isListsSearch, word]);

  // Derived state: Get the placeholder of the currently selected tool
  const currentPlaceholder = isListsSearch
    ? "Search public lists..."
    : TOOL_OPTIONS.find(opt => opt.value === selectedOption)?.placeholder || "Search WordPapa...";

  const handleKeyPress = (e) => {
    if (!inputError && e.key === "Enter") handleLoadUrl();
  };

  const handleLoadUrl = () => {
    if (isListsSearch) {
      const query = word.trim();
      const params = new URLSearchParams(searchParams.toString());

      if (query) {
        params.set("search", query);
      } else {
        params.delete("search");
      }

      router.push(`/lists${params.toString() ? `?${params.toString()}` : ""}`);
      setSuggestions([]);
      return;
    }

    if (selectedOption && word) {
      const cleanWord = word.toLowerCase().trim().replace(/\?/g, "_");
      window.location.href = selectedOption + encodeURIComponent(cleanWord);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (isListsSearch) {
      setWord(value);
      setInputError(false);
      return;
    }

    if (/^[a-zA-Z' \-?0-9]*$/.test(value)) {
      setWord(value);
      setInputError(false);
      if (value.length >= 2) {
        const filtered = FINALCLEANWORDS.filter((w) =>
          w.toLowerCase().startsWith(value.toLowerCase())
        ).slice(0, 6);
        setSuggestions(filtered);
      } else {
        setSuggestions([]);
      }
    } else {
      setInputError(true);
    }
  };

  return (
    <div className="relative w-full max-w-2xl px-2">
      <div className={`flex items-center bg-gray-50 dark:bg-white/5 rounded-2xl border transition-all overflow-hidden ${
        inputError ? "border-red-500/50" : "border-gray-100 dark:border-gray-800 focus-within:border-[#75c32c] focus-within:ring-1 focus-within:ring-[#75c32c]/20"
      }`}>

        {!isListsSearch && (
          <div className="relative flex items-center">
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="appearance-none bg-transparent pl-4 pr-8 py-2 text-[11px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 focus:outline-none cursor-pointer border-r border-gray-100 dark:border-gray-800"
            >
              {TOOL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value} className="bg-white dark:bg-[#0a0a0a] text-gray-800 dark:text-gray-200">
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 pointer-events-none text-gray-400">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="fill-current">
                <path d="M7 2L4 5L1 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        )}

        {isListsSearch && (
          <div className="flex items-center border-r border-gray-100 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#75c32c] dark:border-gray-800">
            Lists
          </div>
        )}

        {/* Input Field */}
        <div className="flex-grow flex items-center relative">
          <input
            type="text"
            className="w-full bg-transparent px-4 py-2 text-sm font-medium focus:outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600"
            placeholder={currentPlaceholder}
            value={word}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
          />

          {/* Search Icon/Button */}
          <button
            onClick={handleLoadUrl}
            disabled={inputError}
            className={`px-4 text-gray-400 hover:text-[#75c32c] transition-colors ${inputError ? 'opacity-20 cursor-not-allowed' : ''}`}
          >
            <FiSearch size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Suggestions Popover */}
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 mx-2 bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl z-[110] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setWord(s);
                setSuggestions([]);
                if (isListsSearch) {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("search", s);
                  router.push(`/lists?${params.toString()}`);
                } else {
                  window.location.href = selectedOption + encodeURIComponent(s.toLowerCase());
                }
              }}
              className="w-full text-left px-5 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-[#75c32c]/10 hover:text-[#75c32c] transition-colors border-b border-gray-50 dark:border-gray-800/50 last:border-0"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBarNav;

// "use client";

// import commonLinks from "@utils/commonLinks";
// import { useState, useEffect } from "react";
// import { usePathname } from "next/navigation";
// import { FiSearch } from "react-icons/fi";
// import FINALCLEANWORDS from "../app/browse/FINALCLEANWORDS";

// const SearchBarNav = () => {
//   const [selectedOption, setSelectedOption] = useState("/define/");
//   const [word, setWord] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const pathname = usePathname();
//   const [inputError, setInputError] = useState(false);
//   const [placeholder, setPlaceHolder] = useState(
//     "Enter Word to Find Definitions",
//   );

//   const urlOptions = [
//     {
//       value: commonLinks.definition,
//       label: "Word Dictionary",
//       placeholder: "Enter Word to Find Definitions",
//     },
//     {
//       value: commonLinks.wordfinder,
//       label: "Word Finder",
//       placeholder: "Enter Letters to Unscramble",
//     },
//     {
//       value: commonLinks.thesaurus,
//       label: "Thesaurus",
//       placeholder: "Enter Word to Find Synonyms",
//     },
//     {
//       value: commonLinks.rhyming,
//       label: "Rhyming Dictionary",
//       placeholder: "Enter Word to Find Rhyming Words",
//     },
//     {
//       value: commonLinks.syllables,
//       label: "Syllable Counter",
//       placeholder: "Enter Word to Count Syllables",
//     },
//     {
//       value: commonLinks.adjectives,
//       label: "Adjectives Finder",
//       placeholder: "Enter Word to Find Adjectives",
//     },
//   ];

//   function checkOptionInSearch(obj, stringA) {
//     return Object.values(obj).includes(stringA);
//   }

//   function findPlaceholder(selectedValue) {
//     const option = urlOptions.find((opt) => opt.value === selectedValue);
//     if (option) setPlaceHolder(option.placeholder);
//   }

//   useEffect(() => {
//     let path = pathname.split("/")[1];
//     let ifOptionInSearchBar = checkOptionInSearch(
//       commonLinks,
//       "/" + path + "/",
//     );
//     if (path !== "" && ifOptionInSearchBar) {
//       setSelectedOption(`/${path}/`);
//     }
//     findPlaceholder(`/${path}/`);
//   }, [pathname]);

//   const handleKeyPress = (event) => {
//     if (!inputError && event.key === "Enter") {
//       handleLoadUrl();
//     }
//   };

//   const handleOptionChange = (e) => {
//     const value = e.target.value;
//     setSelectedOption(value);
//     findPlaceholder(value);
//   };

//   const handleLoadUrl = () => {
//     if (selectedOption && word) {
//       let encodedWord = "";
//       try {
//         encodedWord = decodeURIComponent(
//           word.toLowerCase().replace(/\?/g, "_"),
//         );
//       } catch {
//         encodedWord = "";
//       }
//       window.location.href = selectedOption + encodedWord;
//     }
//   };

//   function sanitizeInput(input) {
//     let regex = /^[a-zA-Z' \-?0-9]+$/;
//     if (input.length > 0) {
//       if (regex.test(input)) {
//         if (input.includes("?")) {
//           const questionMarks = (input.match(/\?/g) || []).length;
//           if (questionMarks <= 3) return input;
//           return null;
//         }
//         return input;
//       }
//       return null;
//     }
//   }

//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     const isInputGood = sanitizeInput(value);
//     if (isInputGood !== null) {
//       setWord(value);
//       setInputError(false);

//       // Only show suggestions if 2+ letters typed
//       if (value.length >= 2) {
//         const filtered = FINALCLEANWORDS.filter((w) =>
//           w.toLowerCase().startsWith(value.toLowerCase()),
//         ).slice(0, 8);
//         setSuggestions(filtered);
//       } else {
//         setSuggestions([]);
//       }
//     } else {
//       setInputError(true);
//       setSuggestions([]);
//     }
//   };

//   return (
//     <div className="relative w-full md:w-[60%] m-auto p-2">
//       <div className="grid md:grid-cols-6">
//         <select
//           value={selectedOption}
//           onChange={handleOptionChange}
//           className="p-2 md:mr-2 border-2 md:col-span-2 text-sm rounded-l-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring focus:ring-blue-300"
//           name="tool"
//         >
//           {urlOptions.map((option) => (
//             <option key={option.value} value={option.value}>
//               {option.label}
//             </option>
//           ))}
//         </select>

//         <div className="md:col-span-4 flex border-2 rounded-r-md items-center relative bg-white dark:bg-gray-800">
//           <input
//             className={`flex-grow text-sm px-2 py-2 focus:outline-none bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 ${
//               inputError ? "border-red-500" : ""
//             }`}
//             type="text"
//             placeholder={placeholder}
//             value={word}
//             onChange={handleInputChange}
//             onKeyPress={handleKeyPress}
//           />

//           <button
//             onClick={handleLoadUrl}
//             disabled={inputError}
//             className="flex items-center justify-center h-full px-3 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
//             aria-label="Search"
//           >
//             <FiSearch size={24} />
//           </button>

//           {/* Suggestions dropdown */}
//           {suggestions.length > 0 && (
//             <ul className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md z-10">
//               {suggestions.map((s, idx) => (
//                 <li
//                   key={idx}
//                   onClick={() => {
//                     setWord(s);
//                     setSuggestions([]);
//                     window.location.href = selectedOption + s.toLowerCase();
//                   }}
//                   className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
//                 >
//                   {s}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SearchBarNav;
