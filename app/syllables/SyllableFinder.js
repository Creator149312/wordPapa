"use client";
import { useState } from "react";
import axios from "axios";

const SyllableFinder = () => {
  const [text, setText] = useState("");
  const [syllableCount, setSyllableCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function countWords(text) {
    // Remove leading and trailing white spaces
    text = text.trim();

    // Split the text into words using one or more spaces as the delimiter
    const words = text.split(/\s+/);

    // Return the number of words
    return words.length;
  }

  const countSyllables = async () => {
    try {
      setLoading(true);
      setError("");

      if ((await countWords(text)) > 100) {
        setError("Max: 100 words are allowed.");
        return;
      }

      // Make a GET request to the WordsAPI to count syllables
      const response = await axios.get(
        `https://api.datamuse.com/words?sp=${text}&qe=sp&md=sr&max=1&ipa=1`
      );

      setSyllableCount(response.data[0].numSyllables);
    } catch (error) {
      setError("Error calculating syllable count!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="input-container text-center m-2">
        <textarea
          rows="7"
          className="form-control"
          placeholder="Enter text to count syllables..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <button className="custom-button m-2" onClick={countSyllables}>
          Count Syllables
        </button>
      </div>
      <div>
        {loading && <p>Loading...</p>}
        {error && <p className="error"> {error}</p>}
        {(syllableCount !== null && !error)(
          <div className="card text-center">
            <p>Syllable Count: {syllableCount}</p>
            <p>Number of Words: {countWords(text)}</p>
            <p>Number of Characters: {text.length}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SyllableFinder;
