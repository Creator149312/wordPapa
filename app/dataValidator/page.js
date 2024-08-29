import { all } from "axios";
import WordChecker from "./WordChecker";

import ALLCLEANWORDS from "./cleanwords/ALLCLEANWORDS"
import { promises as fs } from "fs";

const chunkSize = 1;
const delay = 1200; // 1 minute in milliseconds
let count = 0;

let finalInValidWords = [];
let finalValidWords = [];
const compoundRegex = /\s|-/; //to check if word contains space or -

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

//definition check
const handleCheckValidity = async (checkWord) => {
  checkWord = checkWord.trim();
  let isValid = false;

  try {
    const frequencyresponse = await fetch(
      `https://api.datamuse.com/words?sp=${checkWord}&qe=sp&md=f&max=1&v=enwiki`
    );
    const data = await frequencyresponse.json();
    if (data[0].hasOwnProperty("tags")) {
      let freq = parseFloat(
        data[0].tags[data[0].tags.length - 1].split(":")[1]
      );
      if (freq < 0.5) {
        count++;
        console.log(`${checkWord} = ${freq}`);
        const response = await fetch(
          `https://api.datamuse.com/words?sp=${checkWord}&qe=sp&md=d&max=1&v=enwiki`
        );

        const apiKey = "e0d094e089e87c411680f08f6ab0e7be39143f84626e8c9e4"; // Replace with your Wordnik API key
        const endpoint = `https://api.wordnik.com/v4/word.json/${checkWord}/examples?api_key=${apiKey}`;

        const responseSentences = await fetch(endpoint);

        const data = await response.json();
        const dataSentences = await responseSentences.json();
        if (
          data[0].hasOwnProperty("defs") &&
          dataSentences.examples !== undefined &&
          dataSentences.examples !== null &&
          dataSentences.examples.length > 0
        ) {
          // console.log(data[0]);
          // console.log(dataSentences.examples);
          isValid = true;
        } else {
          // const url = `https://twinword-word-graph-dictionary.p.rapidapi.com/example/?entry=${checkWord}`;
          // const options = {
          //   method: "GET",
          //   headers: {
          //     "X-RapidAPI-Key":
          //       "338b7bbeaemsh4f79a8247d73aefp18217cjsn6cf2a83d6072",
          //     "X-RapidAPI-Host":
          //       "twinword-word-graph-dictionary.p.rapidapi.com",
          //   },
          // };

          // const twinwordresponse = await fetch(url, options);

          // const twinworddata = await twinwordresponse.json();
          // // console.log("Response Data from TwinWord - ", data);
          // if (
          //   twinworddata.example !== undefined &&
          //   twinworddata.example !== null &&
          //   twinworddata.example.length > 0
          // ) {
          //   isValid = true;
          // } else {
          //   isValid = false;
          // }
        isValid = false;
        }
      }else{
        isValid = true;
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
    let isWordValid = await handleCheckValidity(allWords[i]);
    if (isWordValid) validWords.push(allWords[i].trim());
    else invalidWords.push(allWords[i]);
  }

  return { validWords, invalidWords };
};

const Page = async () => {
  // let getXWords = await getWords("r");

  // console.log("Total Words", getXWords.length);

  // await iterateOverChunks(getXWords);
  
  // console.log("Total Words to Check ", count);

  // console.log("Invalid Words = ", finalInValidWords.length);
  // console.log("Valid Words", finalValidWords.length);

  return (
    <div>
       <p>All Valid Words</p>
      {/* {finalValidWords.map((word, index) => {
        return <li key={index}>{word}</li>;
      })}   */}
      <br />
      <p>All InValid Words</p>
       {/* {finalInValidWords.map((word, index) => {
        return <li key={index}>{word}</li>;
      })}  */}
    </div>
  );
};

export default Page;
