'use client'
import { useState } from "react";
import axios from "axios";
import { displayWords } from "@utils/HelperFunctions";
import AdvancedInputs from "@utils/AdvancedInputs";
import ErrorBox from "@utils/ErrorBox";

const RhymingWords = () => {
  const [inputLetters, setInputLetters] = useState('');
  const [loading, setLoading] = useState(false);
  const [rhymingWords, setRhymingWords] = useState([]);
  const [startsWith, handleStartsWith] = useState("");
  const [endsWith, handleEndsWith] = useState("");
  const [contains, handleContains] = useState("");
  const [length, handleLength] = useState("");
  const [error, setError] = useState(null);

  // Function to handle errors
  const handleError = (errorMsg) => {
    setError(errorMsg);
  };

  const getRhymingWords = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await axios.get(`https://api.datamuse.com/words?rel_rhy=${inputLetters}&max=20`);
      
      const extractedWords = response.data.map((item) => item.word);
      if(extractedWords.length > 0){
        setRhymingWords(extractedWords);
      }else{
        throw new Error(`No Rhyming Words or Phrases found for '${inputLetters}'`);
      }
    } catch (e) {
      handleError(e.message);
    }finally{
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className='text-center'>Rhyming Words - Find Rhymes for Kids</h1>
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
            handleFindWords={getRhymingWords}
          />
        </div>
      <div>
      {loading ? (  <div className='text-center'><div>
        <span className='visually-hidden'>Loading...</span>
      </div></div>): (error ?   <ErrorBox error={error} />: 
          displayWords(rhymingWords, startsWith, endsWith, contains, length)
        )}
      </div>
    </div>
  );
};

export default RhymingWords;
