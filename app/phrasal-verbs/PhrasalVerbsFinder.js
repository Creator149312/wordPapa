"use client";
import { useState } from "react";
import axios from "axios";

const PhrasalVerbsFinder = async () => {
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

    try {
      setLoading(true);

      // Make a GET request to the WordsAPI to count syllables
      const response = await axios.get(
        `https://api.datamuse.com/words?sp=${text}&qe=sp&md=sr&max=1&ipa=1`
      );

      console.log(response.data);
     setText(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }


  return (
    <div>
      {console.log(text)}
    </div>
  );
};

export default PhrasalVerbsFinder;
