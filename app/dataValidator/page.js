import { all } from "axios";
import WordChecker from "./WordChecker";
import { promises as fs } from "fs";

const chunkSize = 200;
const delay = 100; // 1 minute in milliseconds

let finalInValidWords = [];
let finalValidWords = [];

async function getWords(l) {
  const filePath = process.cwd() + "/app/browse/cleanwords.txt"; // Replace with the actual path to your file.
  const regex = /^[a-zA-Z]+$/;
  const pluralSuffixes = ["s", "es", "ies", "ves"]; // Plural suffixes

  console.log("Finding Words starting with : ", l);
  try {
    const fileContent = await fs.readFile(filePath, "utf8");
    const linksArray = fileContent.split("\n");

    console.log("Total Words Read", linksArray.length);
    if (l === "0") {
      return linksArray.filter(
        (word) => !/[a-zA-Z]/.test(word.charAt(0)) === true
      );
    } else {
      // we want only those words which have length > 1
      return linksArray.filter((word) => {
        word = word.trim();
        if (word.charAt(0) === l && word.length > 1) return true;
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
    const response = await fetch(
      `https://api.datamuse.com/words?sp=${checkWord}&qe=sp&md=d&max=1&v=enwiki`
    );
    const data = await response.json();
    if (data[0].hasOwnProperty("defs")) {
      if (data[0].hasOwnProperty("defHeadword")) {
        const hw = data[0].defHeadword.toLowerCase();
        if (hw !== checkWord.trim()) {
          console.log(data[0]);
          isValid = false;
        } else {
          isValid = true;
        }
      } else {
        isValid = data[0].defs.length > 0;
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
      let freq = parseFloat(data[0].tags[data[0].tags.length - 1].split(':')[1]);
      if (freq > 0.0001) {
          isValid = true;
       }
      //  else{
      //    console.log(`${checkWord} = ${freq}`);
      //  }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    isValid = false; // Assume word is not valid if there's an error
  }

  return isValid;
};

// Function to process a chunk of words with delay
const processChunkWithDelay = async (chunk, delay) => {
  console.log("Processing chunk");
  // Your processing logic goes here
  const {validWords, invalidWords} = await findInvalidandValidWords(chunk);

  console.log("Valid Words = ", validWords.length);
  console.log("Invalid Words", invalidWords.length);

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
    console.log("processing chunk = ", (i+1));
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
    let isWordValid = await handleCheckFreqOfWord(allWords[i]);
    if (isWordValid) validWords.push(allWords[i].trim());
    else invalidWords.push(allWords[i]);
  }

  return { validWords, invalidWords };
};

const Page = async () => {
  // let getXWords = await getWords("a");

  // console.log("Total Words", getXWords.length);

  // await iterateOverChunks(getXWords);

  // console.log("Invalid Words = ", finalInValidWords.length);
  // console.log("Valid Words", finalValidWords.length);

  return (
    <div>
      <p>All Valid Words</p>
      {/* {finalValidWords.map((word, index) => {
        return <li key={index}>{word}</li>;
      })}  */}
      <br />
      <p>All InValid Words</p>
      {/* {finalInValidWords.map((word, index) => {
        return <li key={index}>{word}</li>;
      })} */}
    </div>
  );
 
};

export default Page;
