'use client'
import { useState } from "react";
import axios from "axios";
import { displayWords } from "@utils/HelperFunctions";
import AdvancedInputs from "@utils/AdvancedInputs";
import ErrorBox from "@utils/ErrorBox";

const SimilarWords = () => {
  const [inputLetters, setInputLetters] = useState("");
  const [loading, setLoading] = useState(false);
  const [similarWords, setSimilarWords] = useState([]);
  const [startsWith, handleStartsWith] = useState("");
  const [endsWith, handleEndsWith] = useState("");
  const [contains, handleContains] = useState("");
  const [length, handleLength] = useState("");
  const [error, setError] = useState(null);

  // Function to handle errors
  const handleError = (errorMsg) => {
    setError(errorMsg);
  };

  const getSimilarWords = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.datamuse.com/words?ml=${inputLetters}&max=15`
      );
      const extractedWords = response.data.map((obj) => obj.word);
      if (extractedWords.length > 0) {
        setSimilarWords(extractedWords);
      } else {
        throw new Error(
          `No Synonyms Words or Phrases found for '${inputLetters}'`
        );
      }
    } catch (e) {
      handleError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-center">Synonyms Finder - Generate Similar Words</h1>
      <div className="input-container">
        <AdvancedInputs
          inputLetters={inputLetters}
          setInputLetters={setInputLetters}
          startsWith={startsWith}
          handleStartsWith={handleStartsWith}
          endsWith={endsWith}
          handleEndsWith={handleEndsWith}
          contains={contains}
          handleContains={handleContains}
          length={length}
          handleLength={handleLength}
          handleFindWords={getSimilarWords}
        />
      </div>
      <div>
        {loading ? (
          <div className="text-center">
            <div>
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <ErrorBox error={error} />
        ) : (
          displayWords(similarWords, startsWith, endsWith, contains, length)
        )}
      </div>
    </div>
  );
};

export default SimilarWords;
