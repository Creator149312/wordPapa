import { promises as fs } from "fs";
import FINALCLEANWORDSVALIDATOR from "./FINALCLEANWORDS";
import FINALCLEANWORDS from "@/app/browse/FINALCLEANWORDS";
import ALLCLEANWORDSVALIDATOR from "./ALLCLEANWORDS";
import WORDSWITHZEROFREQUENCY from "./WORDSWITHZEROFREQUENCY";

const specialCharsRegex = /[`!@#$%^&*()_+\[\]{};':"\\|,.<>\/?~]/;
const compoundRegex = /\s|-/;

function containsSpecialChars(str) {
  // const trimmedStr = str.replace(/\s|-/g, '');
  return compoundRegex.test(str);
}

export default function page() {
  // console.log("Words in USE ", FINALCLEANWORDS.length);
  // console.log("Words DataValidator = ", FINALCLEANWORDSVALIDATOR.length);
  // console.log("Words in DAtabalidator ", ALLCLEANWORDSVALIDATOR.length);

  //  addValidWordstoExistingFile();
  
  // removeInvalidWordsFromCleanWords();

  // let Words = [];
  // let count = 0;
  // // for (let i = 0; i < ALLCLEANWORDS.length; i++) {
  // //   if (!containsSpecialChars(ALLCLEANWORDS[i])) {
  // //     count = count + 1;
  // //     Words.push(ALLCLEANWORDS[i]);
  // //   }
  // // }

  // console.log("Total number of compound Words - ", count);

  //using WORDMAP
  return (
    <>
      <div>Checking if Word Contains Special Chars</div>
      <p>All Valid Words</p>
      {/* {Words.map((word, index) => {
        return <li key={index}>{word}</li>;
      })}  */}
    </>
  );
}

function addValidWordstoExistingFile() {
  const joinedArray = ALLCLEANWORDSVALIDATOR.concat(WORDSWITHZEROFREQUENCY);
  const finalJoinedArray = Array.from(new Set(joinedArray));
  finalJoinedArray.sort(); //to order words in alphabetical order
  console.log("Final length of Created Array = ", finalJoinedArray.length);

    const jsonString = JSON.stringify(finalJoinedArray);
    // // Create a new file and write the extracted words to it
     const finalcreationPath = process.cwd() + "/app/dataValidator/cleanwords/FINALCLEANWORDS.js"; // Replace with the actual path to your file.
  
     const creationPath = process.cwd() + "/app/dataValidator/cleanwords/ALLCLEANWORDS.js"; // Replace with the actual path to your file.
  
    fs.writeFile(
      finalcreationPath,
      `const FINALCLEANWORDSVALIDATOR = ${jsonString}; module.exports = FINALCLEANWORDSVALIDATOR;`,
      "utf8"
    );

    fs.writeFile(
      creationPath,
      `const ALLCLEANWORDSVALIDATOR = ${jsonString}; module.exports = ALLCLEANWORDSVALIDATOR;`,
      "utf8"
    );
}

function removeInvalidWordsFromCleanWords() {
  console.log("Length of Clean Words Before = ", ALLCLEANWORDSVALIDATOR.length);
  console.log(
    "Length of WORDSWITHZEROFREQUENCY = ",
    WORDSWITHZEROFREQUENCY.length
  );
  // Filter out the elements that are in toRemove
  const filteredArray = ALLCLEANWORDSVALIDATOR.filter(function (x) {
    return WORDSWITHZEROFREQUENCY.indexOf(x) < 0;
  });

  console.log("Final Length of File Created ", filteredArray.length);

  // console.log(id + "     " + Fetchedwords.length);
  const jsonString = JSON.stringify(filteredArray);
  // // Create a new file and write the extracted words to it
  const finalcreationPath = process.cwd() + "/app/dataValidator/cleanwords/FINALCLEANWORDS.js"; // Replace with the actual path to your file.

  const creationPath = process.cwd() + "/app/dataValidator/cleanwords/ALLCLEANWORDS.js"; // Replace with the actual path to your file.

  fs.writeFile(
    finalcreationPath,
    `const FINALCLEANWORDSVALIDATOR = ${jsonString}; module.exports = FINALCLEANWORDSVALIDATOR;`,
    "utf8"
  );

  fs.writeFile(
    creationPath,
    `const ALLCLEANWORDSVALIDATOR = ${jsonString}; module.exports = ALLCLEANWORDSVALIDATOR;`,
    "utf8"
  );
}

