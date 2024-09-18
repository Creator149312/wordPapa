import { all } from "axios";
import WordChecker from "./WordChecker";

import ALLCLEANWORDS from "./cleanwords/ALLCLEANWORDS";
import { promises as fs } from "fs";
import ALTERNATIVEWORDS from "./AlternativeWords";

const chunkSize = 2;
const delay = 500; // 1 minute in 54321` milliseconds
let finalInValidWords = [];
let finalValidWords = [];
const compoundRegex = /\s|-/; //to check if word contains space or -
let altWords = [];

async function getWords(l) {
  // const filePath = process.cwd() + "/app/browse/cleanwords.txt"; // Replace with the actual path to your file.
  const regex = /^[a-zA-Z]+$/;
  const pluralSuffixes = ["s", "es", "ies", "ves"]; // Plural suffixes

  console.log("Finding Words starting with : ", l);
  try {
    // const fileContent = await fs.readFile(filePath, "utf8");
    // const linksArray = fileContent.split("\n");

    console.log("Total Words Read", ALLCLEANWORDS.length);
    if (l === "0") {
      return ALLCLEANWORDS.filter(
        (word) => !/[a-zA-Z]/.test(word.charAt(0)) === true
      );
    } else {
      // we want only those words which have length > 1
      return ALLCLEANWORDS.filter((word) => {
        word = word.trim();
        if (
          !compoundRegex.test(word) &&
          word.charAt(0) === l &&
          word.length > 1
        )
          return true;
      });
    }
  } catch (error) {
    console.log(`Error reading the file: ${error.message}`);
  }
}

const handleCheckAdjectives = async (checkWord) => {
  let isValid = false;
  try {
    const timeout = 5000; // Set timeout to 5 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    const endpoint = `https://api.datamuse.com/words?rel_jjb=${checkWord}&max=15`;
    const res = await fetch(endpoint, { signal: controller.signal });

    clearTimeout(timeoutId); // Clear the timeout since the request completed

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const data = await res.json();

    // console.log("Raw Data", data);

    let adjectiveWords = data.map((item) => item.word);
    if (adjectiveWords.length > 3) {
      isValid = true;
    } else {
      isValid = false;
    }
  } catch (error) {
    isValid = false;
  }

  return isValid;
};

//definition check
const handleCheckValidity = async (checkWord) => {
  checkWord = checkWord.trim();
  let isValid = false;
  console.log(checkWord);

  try {
    const frequencyresponse = await fetch(
      `https://api.datamuse.com/words?sp=${checkWord}&qe=sp&md=d&max=1&v=enwiki`
    );
    const data = await frequencyresponse.json();
    if (data[0].hasOwnProperty("defs")) {
      let alternativeCount = 0;
      data[0].defs.map((def) => {
        if (def.includes("Alternative")) {
          alternativeCount++;
        }
      });
      // console.log(checkWord);

      if (alternativeCount > 0) {
        if (data[0].defs.length > 2) {
          // console.log(checkWord);
          altWords.push({ word: checkWord, value: data[0].defs });
          isValid = true;
        }
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    isValid = false; // Assume word is not valid if there's an error
  }

  return isValid;
};

//word frequency check
const handleCheckFreqOfWord = async (checkWord) => {
  checkWord = checkWord.trim();

  let isValid = false;
  try {
    const response = await fetch(
      `https://api.datamuse.com/words?sp=${checkWord}&qe=sp&md=f&max=1&v=enwiki`
    );
    const data = await response.json();
    if (data[0].hasOwnProperty("tags")) {
      let freq = parseFloat(
        data[0].tags[data[0].tags.length - 1].split(":")[1]
      );
      if (freq > 0.01) {
        isValid = true;
      } else {
      }
      console.log(`${checkWord} = ${freq}`);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    isValid = false; // Assume word is not valid if there's an error
  }

  return isValid;
};

// Function to process a chunk of words with delay
const processChunkWithDelay = async (chunk, delay) => {
  // console.log("Processing chunk");
  // Your processing logic goes here
  const { validWords, invalidWords } = await findInvalidandValidWords(chunk);

  // console.log("Valid Words = ", validWords.length);
  // console.log("Invalid Words", invalidWords.length);

  validWords.forEach((item) => {
    finalValidWords.push(item);
  });

  invalidWords.forEach((item) => {
    finalInValidWords.push(item);
  });

  // Simulating delay
  await new Promise((resolve) => setTimeout(resolve, delay));
};

// Function to iterate over words in chunks
const iterateOverChunks = async (words) => {
  const totalChunks = Math.ceil(words.length / chunkSize);
  for (let i = 0; i < totalChunks; i++) {
    // console.log("processing chunk = ", i + 1);
    const startIndex = i * chunkSize;
    const endIndex = Math.min((i + 1) * chunkSize, words.length);
    const chunk = words.slice(startIndex, endIndex);

    await processChunkWithDelay(chunk, delay);
  }
};

const findInvalidandValidWords = async (allWords) => {
  let validWords = [];
  let invalidWords = [];
  for (let i = 0; i < allWords.length; i++) {
    let isWordValid = await handleCheckAdjectives(allWords[i]);
    if (isWordValid) validWords.push(allWords[i].trim());
    else invalidWords.push(allWords[i]);
  }

  return { validWords, invalidWords };
};

const Page = async () => {
  // let getXWords = await getWords("m");

  // console.log("Total Words", getXWords.length);

  // await iterateOverChunks(ALTERNATIVEWORDS);

  // console.log("Total Words to Check ", count);

  // console.log("Invalid Words = ", finalInValidWords.length);
  // console.log("Valid Words", finalValidWords.length);

  return (
    <div>
      <p>All Valid Words</p>
      {/* {finalValidWords.map((word, index) => {
        return <li key={index}>{word}</li>;
      })} */}
      <br />
      <p>All InValid Words</p>
      {/* {finalInValidWords.map((word, index) => {
        return <li key={index}>{word}</li>;
      })}   */}
    </div>
  );
};

export default Page;
