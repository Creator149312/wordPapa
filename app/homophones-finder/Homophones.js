'use client'
import { useState } from "react";
import axios from "axios";
import { displayWords } from "@utils/HelperFunctions";
import AdvancedInputs from "@utils/AdvancedInputs";
import ErrorBox from "@utils/ErrorBox";

const HomophonesExtractor = () => {
  const [inputLetters, setInputLetters] = useState("");
  const [homophones, setHomophones] = useState([]);
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

  const extractHomophones = async () => {
    setError(null);
    setLoading(true);

    try {
      const response = await axios.get(
        `https://api.datamuse.com/words?rel_hom=${inputLetters}&max=12`
      );

      const extractedHomophones = response.data.map((item) => item.word);

      if (extractedHomophones.length > 0) {
        setHomophones(extractedHomophones);
      } else {
        throw new Error(`No Homophones found for '${inputLetters}'`);
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
        Homophones Generator - Find Homophones for English Words
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
          handleFindWords={extractHomophones}
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
        displayWords(homophones, startsWith, endsWith, contains, length)
      )}
    </div>
  );
};

export default HomophonesExtractor;
