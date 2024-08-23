import { promises as fs } from "fs";
import ALLCLEANWORDS from "./ALLCLEANWORDS";
import WORDSWITHZEROFREQUENCY from "./WORDSWITHZEROFREQUENCY";

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

 
  //using WORDMAP
  return <div>Trying to create a Final Words Array</div>;
}
