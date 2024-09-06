import { promises as fs } from "fs";
import ALLCLEANWORDS from "./ALLCLEANWORDS";
import WORDSWITHZEROFREQUENCY from "./WORDSWITHZEROFREQUENCY";

const specialCharsRegex = /[`!@#$%^&*()_+\[\]{};':"\\|,.<>\/?~]/;
const compoundRegex = /\s|-/;

function containsSpecialChars(str) {
  // const trimmedStr = str.replace(/\s|-/g, '');
  return compoundRegex.test(str);
}

export default function page() {
  // console.log("Length of Clean Words Before = ", ALLCLEANWORDS.length);
  // console.log(
  //   "Length of WORDSWITHZEROFREQUENCY = ",
  //   WORDSWITHZEROFREQUENCY.length
  // );
  // // Filter out the elements that are in toRemove
  // const filteredArray = ALLCLEANWORDS.filter(function (x) {
  //   return WORDSWITHZEROFREQUENCY.indexOf(x) < 0;
  // });

  // console.log("Final Length of File Created ", filteredArray.length);

  // // console.log(id + "     " + Fetchedwords.length);
  // const jsonString = JSON.stringify(filteredArray);
  // // // Create a new file and write the extracted words to it

  // const finalcreationPath =
  //   process.cwd() + "/app/dataValidator/cleanwords/FINALCLEANWORDS.js"; // Replace with the actual path to your file.

  // const creationPath =
  //   process.cwd() + "/app/dataValidator/cleanwords/ALLCLEANWORDS.js"; // Replace with the actual path to your file.

  // fs.writeFile(
  //   finalcreationPath,
  //   `const FINALCLEANWORDS = ${jsonString}; module.exports = FINALCLEANWORDS;`,
  //   "utf8"
  // );

  // fs.writeFile(
  //   creationPath,
  //   `const ALLCLEANWORDS = ${jsonString}; module.exports = ALLCLEANWORDS;`,
  //   "utf8"
  // );

  
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
      {Words.map((word, index) => {
        return <li key={index}>{word}</li>;
      })} 
    </>
  );
}
