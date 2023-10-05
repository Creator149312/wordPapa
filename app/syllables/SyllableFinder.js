"use client";
import { useState } from "react";
import axios from "axios";

const SyllableFinder = () => {
  const [text, setText] = useState("");
  const [syllableCount, setSyllableCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle errors
  const handleError = (errorMsg) => {
    setError(errorMsg);
  };

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

      // Make a GET request to the WordsAPI to count syllables
      const response = await axios.get(
        `https://api.datamuse.com/words?sp=${text}&qe=sp&md=sr&max=1&ipa=1`
      );

      setSyllableCount(response.data[0].numSyllables);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-center">
        Syllable Counter - Count Number of Syllables in Word
      </h1>
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
        {syllableCount !== null && (
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
