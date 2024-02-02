"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import apiConfig from "@utils/apiUrlConfig";
import WordChecker from "@app/dataValidator/WordChecker";

// Define the array of stop words
const stopWordsAll = [
  "a",
  "about",
  "above",
  "after",
  "again",
  "against",
  "all",
  "am",
  "an",
  "and",
  "any",
  "are",
  "aren't",
  "as",
  "at",
  "be",
  "because",
  "been",
  "before",
  "being",
  "below",
  "between",
  "both",
  "but",
  "by",
  "can't",
  "cannot",
  "could",
  "couldn't",
  "did",
  "didn't",
  "do",
  "does",
  "doesn't",
  "doing",
  "don't",
  "down",
  "during",
  "each",
  "few",
  "for",
  "from",
  "further",
  "had",
  "hadn't",
  "has",
  "hasn't",
  "have",
  "haven't",
  "having",
  "he",
  "he'd",
  "he'll",
  "he's",
  "her",
  "here",
  "here's",
  "hers",
  "herself",
  "him",
  "himself",
  "his",
  "how",
  "how's",
  "i",
  "i'd",
  "i'll",
  "i'm",
  "i've",
  "if",
  "in",
  "into",
  "is",
  "isn't",
  "it",
  "it's",
  "its",
  "itself",
  "let's",
  "me",
  "more",
  "most",
  "mustn't",
  "my",
  "myself",
  "no",
  "nor",
  "not",
  "of",
  "off",
  "on",
  "once",
  "only",
  "or",
  "other",
  "ought",
  "our",
  "ours",
  "ourselves",
  "out",
  "over",
  "own",
  "same",
  "shan't",
  "she",
  "she'd",
  "she'll",
  "she's",
  "should",
  "shouldn't",
  "so",
  "some",
  "such",
  "than",
  "that",
  "that's",
  "the",
  "their",
  "theirs",
  "them",
  "themselves",
  "then",
  "there",
  "there's",
  "these",
  "they",
  "they'd",
  "they'll",
  "they're",
  "they've",
  "this",
  "those",
  "through",
  "to",
  "too",
  "under",
  "until",
  "up",
  "very",
  "was",
  "wasn't",
  "we",
  "we'd",
  "we'll",
  "we're",
  "we've",
  "were",
  "weren't",
  "what",
  "what's",
  "when",
  "when's",
  "where",
  "where's",
  "which",
  "while",
  "who",
  "who's",
  "whom",
  "why",
  "why's",
  "with",
  "won't",
  "would",
  "wouldn't",
  "you",
  "you'd",
  "you'll",
  "you're",
  "you've",
  "your",
  "yours",
  "yourself",
  "yourselves",
];

export default function AddList() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [words, setWords] = useState([]);
  const createdBy = useSession().data?.user?.email;

  const [isLoading, setIsLoading] = useState(false);
  const [wordsToCheck, setWordsToCheck] = useState([]);
  const [omittedWords, setOmittedWords] = useState([]);
  const [invalidWords, setInvalidWords] = useState([]);
  const [error, setError] = useState(null);

  const router = useRouter();
  const [finalWords, setFinalWords] = useState([]);

  let wordDataObject = [];
  let omittedWordsArray = [];
  let invalidWordsArray = [];
  let countOfWords = 0;

  // Render the array elements using map
  const renderArray = (myArray, message) => {
    return (
      <>
        <p>{message}</p>
        {myArray.map((item, index) => (
          <span key={index}>
            <strong>{item}</strong>{" "}
          </span>
        ))}
      </>
    );
  };

  useEffect(() => {
    getValidWords().then((validWords) => {
      setFinalWords(validWords);
      setWords(wordDataObject);
      setInvalidWords(invalidWordsArray);
      setOmittedWords(omittedWordsArray);
    });
  }, [wordsToCheck]); // Run the validity check whenever the input word changes

  //start of code to check valid words
  async function isWordValid(word) {
    // Trim input word and convert to lowercase before checking
    const trimmedWord = word.trim().toLowerCase();
    if (trimmedWord === "") {
      return false; // Empty string is not considered valid
    }

    try {
      const response = await fetch(
        `https://api.datamuse.com/words?sp=${trimmedWord}&qe=sp&md=d&max=1&v=enwiki`
      );
      const data = await response.json();
      //check if word has property "defs" and is not a stopWord
      if (
        data[0].hasOwnProperty("defs") &&
        !stopWordsAll.includes(word.toLowerCase())
      ) {
        wordDataObject[countOfWords++] = {
          word: trimmedWord,
          wordData: data[0].defs[0],
        };
        return true;
      } else {
        if (stopWordsAll.includes(word.toLowerCase())) {
          omittedWordsArray.push(word);
        }

        if (!data[0].hasOwnProperty("defs")) {
          invalidWordsArray.push(word);
        }
        return false;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return false; // Assume word is not valid if there's an error
    }
  }

  async function filterValidWords(words) {
    const validWords = await Promise.all(
      words.map(async (word) => {
        const isValid = await isWordValid(word);
        return isValid ? word : null;
      })
    );
    return validWords.filter(Boolean);
  }

  async function getValidWords() {
    return filterValidWords(wordsToCheck)
      .then((validWords) => {
        console.log("Valid words:", validWords);
        return validWords;
      })
      .catch((error) => {
        console.error("Error:", error);
        return [];
      });
  }
  //end of code to check Valid Words

  //creating a unique set of Words when words data is updated
  const handleWordsChange = (e) => {
    const textareaValue = removeSpecialCharacters(e.target.value.toLowerCase());
    console.log(textareaValue);
    const lines = textareaValue.split(/\s+/).filter(Boolean);
    let uniqueSet = new Set(lines);
    setWords(Array.from(uniqueSet));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!title || !description || !words) {
      alert("Title and description are required.");
      return;
    }

    try {
      const res = await fetch(`${apiConfig.apiUrl}/list`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ title, description, words, createdBy }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        throw new Error("Failed to create a List");
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  function removeSpecialCharacters(text) {
    // Define the regular expression to match special characters
    const regex = /[^a-zA-Z0-9\s-]/g;
    // Remove special characters except '-', and spaces
    return text.replace(regex, '');
  }

  const verifyWords = (e) => {
    e.preventDefault();

    setWordsToCheck(words);
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <input
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className="form-control m-2"
        type="text"
        placeholder="Topic Title"
      />

      <input
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        className="form-control m-2"
        type="text"
        placeholder="Topic Description"
      />
      <textarea
        onChange={handleWordsChange}
        className="form-control m-2"
        rows="5"
        placeholder="Enter Words in each line"
      />
      <button onClick={verifyWords} className="custom-button">
        Check Words
      </button>
      {finalWords.length > 0 && (
        <button type="submit" className="custom-button">
          Create List
        </button>
      )}
      {finalWords.length > 0 && console.log(finalWords)}
      {omittedWords.length > 0 && renderArray(omittedWords, "Omitted Words")}
      {invalidWords.length > 0 && renderArray(invalidWords, "Invalid Words")}
      {isLoading && <p>Adding Your List ...</p>}
      {error && <p>Error: {error.message}</p>}
    </form>
  );
}
