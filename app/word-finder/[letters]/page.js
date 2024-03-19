import englishUSWordsArray from "../english-wordlist";
import DataFilterDisplay from "@utils/DataFilterDisplay";
// import { promises as fs, link } from "fs";

let titleStr = "";
let ltUp = "";
export async function generateMetadata({ params }, parent) {
  const letters = decodeURIComponent(params.letters);
  ltUp = letters.toUpperCase();
  // read route params
  titleStr = "Unscramble " + ltUp + " | Find Words with letters in " + ltUp;
  const descriptionStr =
    "Explore list of words you can make using letters in " + ltUp + " after you unscramble";
  return {
    title: titleStr,
    description: descriptionStr,
  };
}

let wordsWithLetters = [];

async function getWords(letters) {
  // const filePath = process.cwd() + "/app/word-finder/english-wordlist.txt"; // Replace with the actual path to your file.

  try {
    // const fileContent = await fs.readFile(filePath, "utf8");
    // const linksArray = fileContent.split("\n");

    let alphabetObject = {};
    for (let charCode = 97; charCode <= 122; charCode++) {
      const letter = String.fromCharCode(charCode);
      alphabetObject[letter] = 0;
    }

    for (let i = 0; i < letters.length; i++) {
      alphabetObject[letters[i]]++;
    }

    const questionMarks = (letters.match(/\_/g) || []).length;

    let matchingWords = [];

    if (questionMarks > 0) {
      for (let j = 0; j < englishUSWordsArray.length; j++) {
        let word = englishUSWordsArray[j];

        if (word.length <= questionMarks) {
          matchingWords.push(word);
        } else {
          let matchedChars = 0;
          let e = letters.split("");
          for (let i = 0; i < word.length; i++) {
            for (let j = 0; j < e.length; j++) {
              if (e[j] === word[i]) {
                matchedChars++;
                e[j] = "0";
                // console.log("Word : ", word);
                // console.log("Expression : ", e);
              }
            }
          }
          // console.log("Total Matched Chars", matchedChars);
          // console.log("Final Expression", e);

          if (matchedChars + questionMarks >= word.length) {
            matchingWords.push(word);
            //console.log("Added Word: ", word);
          }
        }
      }
    } else {
      for (let j = 0; j < englishUSWordsArray.length; j++) {
        let word = englishUSWordsArray[j];

        let sequenceObject = { ...alphabetObject };
        let isScramble = true;
        for (let i = 0; i < word.length; i++) {
          if (sequenceObject[word[i]] > 0) {
            sequenceObject[word[i]]--;
          } else {
            isScramble = false;
            break;
          }
        }
        if (isScramble) matchingWords.push(word);
      }
    }

    return matchingWords.filter((str) => str.length > 1);
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

export default async function Page({ params }) {
  const letters = params.letters;
  wordsWithLetters = await getWords(params.letters);
  const letterinUppercase = letters.toUpperCase();
  // read route params
  const pageHeading = "Unscramble " + letterinUppercase + " | Find Words with letters in " + letterinUppercase;

  return (
    <div>
      <h1>{pageHeading}</h1>
      <p>
        Following is a list of {wordsWithLetters.length} English words you can
        form using letters {letterinUppercase} when unscrambled.
      </p>
      <DataFilterDisplay words={wordsWithLetters} />
    </div>
  );
}
