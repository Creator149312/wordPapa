'use client';
import {useState } from "react";
import AdvancedInputs from "@utils/AdvancedInputs";
import { displayWords } from "@utils/HelperFunctions";
import axios from "axios";
import SideBar from "@components/SideBar";
import ErrorBox from "@utils/ErrorBox";

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
    }else if (selectedOption === "consonants") {
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
                <strong>WordPapa</strong><sub className="p-1"> by</sub>
                  <sub className="p-1">
                    EnglishBix
                  </sub>
                </h1>
                <label>What type of words you want to generate? </label>
                <select value={selectedOption} onChange={handleChange}>
                  <option value="adjectives">Adjectives </option>
                  <option value="synonyms">Synonyms</option>
                  <option value="rhyming-words">Rhyming Words</option>
                  <option value="consonants">Match Consonants</option>
                  <option value="homophones">Homophones</option>
                  {/* Add more options as needed */}
                </select>
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
                  handleFindWords={extractData}
                />
                {loading ? (
                  <div className="text-center">
                    <div role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : error ? (
                  <ErrorBox error={error} />
                ) : (
                  displayWords(
                    responseData,
                    startsWith,
                    endsWith,
                    contains,
                    length
                  )
                )}
              </div>
              <div>
                <p>
                  An enriching vocabulary hub, where language mastery begins.
                  Dive into a world of words and their nuances.
                </p>
                <p>
                  Our comprehensive dictionary is your key to unlocking the
                  depth of the English language. Explore meanings, discover
                  synonyms, unravel antonyms, and delve into the intricacies of
                  adjectives.{" "}
                </p>
              </div>
              <h2>Explore Our Word Tools Crafted For You</h2>
              <div>
              <p>
                <strong>
                  1. <a href="/word-cloud">Word Cloud Generator</a>:
                </strong>
                It is a visual representation tool that transforms a set of text
                data into an artistic display of words, with their size
                indicating their frequency in the input text. It is commonly
                used for data analysis, presentations, and content
                visualization, or identifying prominent themes within a text
                corpus.
              </p>
              <p>
                <strong>
                  2. <a href="/synonym-words">Synonyms Generator</a>:
                </strong>
                It is a linguistic tool designed to provide alternative words or
                phrases with similar meanings to a given word. It helps writers,
                content creators, and language enthusiasts to choose from
                diverse vocabulary, and finally enhancing the clarity and
                richness of their writing.{" "}
              </p>
              <p>
                <strong>
                  3. <a href="/rhyming-words">Rhyming Words Generator</a>:
                </strong>
                A Rhyming Words Generator is a utility for teachers, poets,
                lyricists, and anyone looking to create rhyming verses or
                content. It generates words that rhyme with a given input word,
                assisting in crafting poetry, song lyrics, or creative writing
                with consistent rhyme schemes.{" "}
              </p>
              <p>
                <strong>
                  4. <a href="/describing-words">Describing Words Generator</a>:
                </strong>
                A Describing Words Generator, also known as an adjective
                generator, assists writers and content creators in finding
                adjectives or describing words to enhance the details and
                imagery in their writing.{" "}
              </p>
              </div>
            </div>
          </div>
        </div>
        <SideBar />
      </div>
    </div>
  );
};

export default Page;
