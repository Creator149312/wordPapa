import { promises as fs } from "fs";

let finalWords = [];
async function getWords() {
  const filePath = process.cwd() + "/app/dataValidator/wordnetwords.txt"; // Replace with the actual path to your file.

  try {
    const fileContent = await fs.readFile(filePath, "utf8");
    const wordsArray = fileContent.split("\n");

    console.log("Total Words Read", wordsArray.length);

    // Extract words from each line
    const extractedWords = wordsArray.map((line) => {
      const [word] = line.split("\t"); // Assuming words are separated by a tab character
      return word.trim(); // Remove leading/trailing whitespace
    });

    finalWords = [...extractedWords];

    // // Create a new file and write the extracted words to it
    // const creationPath =
    //   process.cwd() + "/app/dataValidator/allwordnetwords.txt"; // Replace with the actual path to your file.
    // fs.writeFile(creationPath, extractedWords.join("\n"), "utf8");
  } catch (error) {
    console.log(`Error reading the file: ${error.message}`);
  }
}

// const handleCheckValidity = async (checkWord) => {
//   checkWord = checkWord.trim();
//   let isValid = false;
//   try {
//     const response = await fetch(
//       `https://api.datamuse.com/words?sp=${checkWord}&qe=sp&md=d&max=1&v=enwiki`
//     );
//     const data = await response.json();
//     if (data[0].hasOwnProperty("defs")) {
//       if (data[0].hasOwnProperty("defHeadword")) {
//         const hw = data[0].defHeadword.toLowerCase();
//         console.log("Our Check Word... ", checkWord);
//         if (hw !== checkWord.trim()) {
//           console.log(data[0]);
//           isValid = false;
//         } else {
//           isValid = true;
//         }
//       } else {
//         isValid = data[0].defs.length > 0;
//       }
//     }
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     isValid = false; // Assume word is not valid if there's an error
//   }

//   return isValid;
// };

// const findInvalidandValidWords = async (allWords) => {
//   let validWords = [];
//   let invalidWords = [];
//   for (let i = 0; i < allWords.length; i++) {
//     let isWordValid = await handleCheckValidity(allWords[i]);
//     if (isWordValid) validWords.push(allWords[i]);
//     else invalidWords.push(allWords[i]);
//   }

//   return { valid: validWords, invalid: invalidWords };
// };

function groupWordsByAlphabet(words) {
  const groupedWords = {};

  // Iterate over each word in the array
  words.forEach((word) => {
    // Extract the first letter of the word and convert it to lowercase
    const firstLetter = word.charAt(0).toLowerCase();

    // If the key for the first letter doesn't exist in the object, create it with an empty array
    if (!groupedWords[firstLetter]) {
      groupedWords[firstLetter] = [];
    }

    // Push the word to the array corresponding to its starting alphabet
    groupedWords[firstLetter].push(word);
  });

  return groupedWords;
}

// Function to print words based on starting character
function printWordsByAlphabetByLength(groupedWords) {
  // Iterate over the keys of the grouped object
  Object.keys(groupedWords).forEach((letter) => {
    // Print the letter
     console.log(`${letter}: ${groupedWords[letter].length}`);
  });
}

const Page = async () => {
 await getWords();

  let groupedWords = groupWordsByAlphabet(finalWords);

  console.log("Total Words", finalWords.length);

  return (
    <div>
        { printWordsByAlphabetByLength(groupedWords)}
    </div>
  );
};

export default Page;
