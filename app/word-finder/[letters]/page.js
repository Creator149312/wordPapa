import allUSWords from "../allUsWords";
import DataFilterDisplay from "@utils/DataFilterDisplay";
// import { promises as fs, link } from "fs";
import { CardContent, CardHeader } from "@components/ui/card";

let titleStr = "";
let ltUp = "";
export async function generateMetadata({ params }, parent) {
  const letters = decodeURIComponent(params.letters);
  ltUp = letters.toUpperCase();
  // read route params
  titleStr = "Unscramble " + ltUp + " | Find Words with letters in " + ltUp;
  const descriptionStr =
    "Explore list of words you can make using letters in " +
    ltUp +
    " when you unscramble";
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
      for (let j = 0; j < allUSWords.length; j++) {
        let word = allUSWords[j];
        if (word.length <= (questionMarks + word.length)) {
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
        } else {
          break;
        }
      }
    } else {
      for (let j = 0; j < allUSWords.length; j++) {
        let word = allUSWords[j];
        if (word.length <= letters.length) {
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
        } else {
          break;
        }
      }
    }

    return matchingWords.filter((str) => str.length > 1);
  } catch (error) {
    return [];
  }
}

export default async function Page({ params }) {
  const letters = params.letters;
  wordsWithLetters = await getWords(params.letters);
  const letterinUppercase = letters.toUpperCase();
  // read route params
  const pageHeading =
    "Unscramble " +
    letterinUppercase +
    " | Find Words with letters in " +
    letterinUppercase;

  return (
    <>
    <CardHeader>
      <h1 className="text-4xl font-extrabold">{pageHeading}</h1>
      </CardHeader>
      <CardContent>
      <p className="mb-6 text-lg font-normal">
        Following is a list of {wordsWithLetters.length} English words you can
        form using letters in {letterinUppercase} when unscrambled.
      </p>
      <DataFilterDisplay words={wordsWithLetters} />
      </CardContent>
    </>
  );
}
