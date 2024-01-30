'use client'
import { useState } from 'react';

// Sample array of words
const wordArray = [
  'apple', 'banana', 'cherry', 'date', 'grape',
  'kiwi', 'lemon', 'mango', 'orange', 'pear', 'lango', 'tango', 'mongo', 'jango',
];

// Function to generate all possible permutations of a word
const generatePermutations = (word) => {
  if (word.length === 1) {
    return [word];
  }

  const permutations = [];

  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    const remainingChars = word.substring(0, i) + word.substring(i + 1);
    const innerPermutations = generatePermutations(remainingChars);

    for (const innerPermutation of innerPermutations) {
      permutations.push(char + innerPermutation);
    }
  }

  return permutations;
};

export default function AnagramSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Function to handle search
  const handleSearch = (e) => {
    e.preventDefault();

    let anagrams = [];

    if (searchTerm.includes('?')) {
      // If search term contains wildcard
      const wildcardIndex = searchTerm.indexOf('?');
      const prefix = searchTerm.substring(0, wildcardIndex);
      const suffix = searchTerm.substring(wildcardIndex + 1);
      
      // Generate permutations for the wildcard
      const wildcardPermutations = generatePermutations('abcdefghijklmnopqrstuvwxyz');

      // Generate anagrams by inserting wildcard permutations into the search term
      anagrams = wildcardPermutations
        .map(permutation => prefix + permutation + suffix)
        .filter(word => wordArray.includes(word));
    } else {
      // If search term does not contain wildcard
      anagrams = wordArray.filter(word => {
        const sortedSearchTerm = searchTerm.split('').sort().join('');
        const sortedWord = word.split('').sort().join('');
        return sortedSearchTerm === sortedWord && word !== searchTerm;
      });
    }

    // Update the search results state
    setSearchResults(anagrams);
  };

  return (
    <div>
      <h1>Anagram Search</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter word with wildcards"
        />
        <button type="submit">Search</button>
      </form>
      {searchResults.length > 0 && (
        <div>
          <h2>Search Results:</h2>
          <ul>
            {searchResults.map((word, index) => (
              <li key={index}>{word}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
