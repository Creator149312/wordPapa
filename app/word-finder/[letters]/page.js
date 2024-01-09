import RelLinksonPageBottom from "@components/RelLinksonPageBottom";
import DataFilterDisplay from "@utils/DataFilterDisplay";
import axios from "axios";
import { promises as fs, link } from 'fs';

let titleStr = "";
let ltUp = "";
export async function generateMetadata({ params }, parent) {
  const letters  = decodeURIComponent(params.letters);
   ltUp = letters.toUpperCase();
  // read route params
  titleStr = "Unscramble " + ltUp + " | Find Words with letters in " + ltUp;
  const descriptionStr = "Explore list of words you can form using letters in " + ltUp;
  return {
    title: titleStr,
    description: descriptionStr ,
  }
}

let wordsWithLetters = [];

async function getWords(letters) {
  const filePath = process.cwd() + '/app/word-finder/english-wordlist.txt' // Replace with the actual path to your file.

  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const linksArray = fileContent.split("\n");
    let alphabetObject = {};
    for (let charCode = 97; charCode <= 122; charCode++) {
      const letter = String.fromCharCode(charCode);
      alphabetObject[letter] = 0;
    }

    for (let i = 0; i < letters.length; i++) {
      alphabetObject[letters[i]]++;
    }

    // console.log(alphabetObject);

    let matchingWords = [];
    for (let j = 0; j < linksArray.length; j++) {
      let word = linksArray[j];
      if (word.length > 1 && word.length <= letters.length) {
        let sequenceObject = { ...alphabetObject };
        let isScramble = true;
        //console.log(sequenceObject);
        //console.log(word + "    " + letters);
        for (let i = 0; i < word.length; i++) {
            if (sequenceObject[word[i]] > 0) {
              sequenceObject[word[i]]--;
            } else {
              isScramble = false;
              break;
            }
          }
        if (isScramble)
          matchingWords.push(word);
      }
    }
    
    return matchingWords;
  } catch (error) {
    throw new Error(`Error reading the file: ${error.message}`);
  }
}

export default async function Page({ params }) {
  const letters = params.letters;
  wordsWithLetters = await getWords(params.letters);

  return (
    <div>
      <h1>{titleStr}</h1>
      <p> Following is a list of {wordsWithLetters.length} words you can form using letters {ltUp}. </p>
      <DataFilterDisplay words={wordsWithLetters} />
      </div>
  );
}
