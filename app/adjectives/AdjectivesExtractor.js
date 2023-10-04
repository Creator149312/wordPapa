'use client'
import { useState } from "react";
import axios from "axios";
import { displayWords } from "@utils/HelperFunctions";
import AdvancedInputs from "@utils/AdvancedInputs";
import ErrorBox from "@utils/ErrorBox";

const AdjectivesExtractor = () => {
  const [inputLetters, setInputLetters] = useState("");
  const [adjectives, setAdjectives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startsWith, handleStartsWith] = useState("");
  const [endsWith, handleEndsWith] = useState("");
  const [contains, handleContains] = useState("");
  const [length, handleLength] = useState("");
  const [error, setError] = useState(null);

  // Function to handle errors
  const handleError = (errorMsg) => {
    setError(errorMsg);
  };

  const extractAdjectives = async () => {
    setError(null);
    setLoading(true);

    try {
      const response = await axios.get(
        `https://api.datamuse.com/words?rel_jjb=${inputLetters}&max=15`
      );

      const extractedAdjectives = response.data.map((item) => item.word);

      if (extractedAdjectives.length > 0) {
        setAdjectives(extractedAdjectives);
      } else {
        throw new Error(`No Describing Words found for '${inputLetters}'`);
      }
    } catch (e) {
      handleError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-center">
      Adjectives Finder - Get Describing Words for Nouns
      </h1>
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
          handleFindWords={extractAdjectives}
        />
      </div>

      {loading ? (
        <div className="text-center">
          <div role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <ErrorBox error={error} />
      ) : (
        displayWords(adjectives, startsWith, endsWith, contains, length)
      )}
    </div>
  );
};

export default AdjectivesExtractor;
