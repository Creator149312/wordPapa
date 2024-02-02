"use client";
import { useState } from "react";
import axios from "axios";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
// import ErrorBox from "@utils/ErrorBox";
import commonLinks from "@utils/commonLinks";

const Page = () => {
  const [selectedOption, setSelectedOption] = useState("adjectives");
  const [responseData, setResponseData] = useState([]);
  const [error, setError] = useState(null);
  const [inputLetters, setInputLetters] = useState("");
  const [loading, setLoading] = useState(false);
  const [startsWith, handleStartsWith] = useState("");
  const [endsWith, handleEndsWith] = useState("");
  const [contains, handleContains] = useState("");
  const [length, handleLength] = useState("");

  const handleChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const extractData = async () => {
    setError(null);
    setLoading(true);
    // Define your API endpoints based on the selected option
    let apiEndpoint = "";

    if (selectedOption === "adjectives") {
      apiEndpoint = `https://api.datamuse.com/words?rel_jjb=${inputLetters}&max=15`;
    } else if (selectedOption === "synonyms") {
      apiEndpoint = `https://api.datamuse.com/words?ml=${inputLetters}&max=15`;
    } else if (selectedOption === "homophones") {
      apiEndpoint = `https://api.datamuse.com/words?rel_hom=${inputLetters}&max=5`;
    } else if (selectedOption === "rhyming-words") {
      apiEndpoint = `https://api.datamuse.com/words?rel_rhy=${inputLetters}&max=15`;
    } else if (selectedOption === "consonants") {
      apiEndpoint = `https://api.datamuse.com/words?rel_cns=${inputLetters}&max=15`;
    }

    try {
      const response = await axios.get(apiEndpoint);
      const extractedData = response.data.map((item) => item.word);

      if (extractedData.length > 0) {
        setResponseData(extractedData);
      } else {
        throw new Error(`No Words found for '${inputLetters}'`);
      }
    } catch (error) {
      setResponseData(null);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="row">
        {/* Left side: 9-column scrollable content */}
        <div className="m-2 p-3">
          <div>
            <div>
              <div className="p-3 text-center mb-2">
                <h1 className="mb-3">
                  <strong>WordPapa</strong>
                  <sub className="p-1"> by</sub>
                  <sub className="p-1">EnglishBix</sub>
                </h1>
                <h3>The free, fun, and effective way to master a word!</h3>
                <p>
                  An enriching vocabulary hub, where language mastery begins.
                  Dive into a world of words and their nuances.
                </p>
                <p>
                  Our comprehensive dictionary is your key to unlocking the
                  depth of the English language. Explore meanings, discover
                  synonyms, unravel antonyms, and delve into the intricacies of
                  adjectives.
                </p>
              </div>
              <p className="text-center large-text">I am looking for....</p>
              <div className="row">
                <div className="card col-6 text-center" href={commonLinks.definition}>
                  <div className="m-2 p-2">
                <p>
                    A dictionary to find new words along with their definitions and examples
                    </p>
                  </div>
                  <button className="p-2 custom-button medium-text">
                 <a href={commonLinks.definition} className="medium-text font-white" > Word Dictionary <BsFillArrowRightCircleFill />
                 </a> </button>
                </div>
                <div className="card col-6 text-center" >
                  <div className="m-2 p-2">
                  <p>
                  Tool to find Adjective words to describe a Noun or Object  </p>
                  </div>
                  <button className="custom-button medium-text">
                     <a href={commonLinks.adjectives} className="medium-text font-white">Adjectives Finder <span className="react-icons"><BsFillArrowRightCircleFill /></span>
                     </a>  </button>
                  </div>
              </div>
              <div className="row">
              <div className="card col-6 text-center" >
                  <div className="m-2">
                  <p>
                    Synonyms and antonyms of a word that I know
                  </p>
                  </div>
                    <button className="custom-button p-2">
                      <a href={commonLinks.thesaurus}  className="medium-text font-white">Thesaurus <span className="react-icons"><BsFillArrowRightCircleFill /></span></a>
                    </button>
                </div>
                <div className="card col-6 text-center">
                  <div className="m-2">
                  <p>
                  rhyming words that rhyme with a word that I know</p>
                  </div>
                    <button className="custom-button p-2">
                      <a href={commonLinks.rhyming}  className="medium-text font-white"> Rhyming Dictionary <span className="react-icons"><BsFillArrowRightCircleFill /></span></a>
                    </button>
                </div>
              </div>
              <div className="row">
              <div className="card col-6 text-center">
                  <div className="m-2 p-2">
                  <p>
                    a tool to find number of syllables in a given word
                  </p>
                  </div>
                  <button className="custom-button p-2">
                    <a href={commonLinks.syllables} className="medium-text font-white">
                      Syllable Counter <span className="react-icons"><BsFillArrowRightCircleFill /></span>
                    </a>
                  </button>
                </div>
                <div className="card col-6 text-center">
                  <div className="m-2 p-2">
                  <p>
                  a tool to generate all possible words with given letters</p>
                  </div>
                  <button className="p-2 custom-button">
                    <a href="/word-finder" className="medium-text font-white">
                      Word Finder <span className="react-icons"><BsFillArrowRightCircleFill /></span>
                    </a>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
