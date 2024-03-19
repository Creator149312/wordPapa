import ALLCLEANWORDS from '@app/browse/ALLCLEANWORDS';
import { promises as fs } from "fs";

//with words containing spaces and -
const findWordsWithSameLetters = (words) => {
    const wordMap = {};
    words.forEach((word) => {
        const key = word.replace(/[ \-]/g, '').toLowerCase(); // Remove spaces and dashes, convert to lowercase
        wordMap[key] = "";
    });

    words.forEach((word) => {
        const key = word.replace(/[ \-]/g, '').toLowerCase(); // Remove spaces and dashes, convert to lowercase

        if (wordMap[key].length == 0)
            wordMap[key] = word.replace(/ /g, '-');
        else {
            if (!wordMap[key].includes('-')) {
                wordMap[key] = word.replace(/ /g, '-');
            }
            //   console.log(word + "     " + key + "    " + wordMap[key][0]);
        }
    }
    );

    try {
        // Convert the JSON object to a JSON string
        const jsonString = JSON.stringify(wordMap, null, 2);
        // // Create a new file and write the extracted words to it
        const creationPath =
            process.cwd() + "/app/dataValidator/wordMap/WORDMAP.js"; // Replace with the actual path to your file.
        fs.writeFile(creationPath, `export const WORDMAP = ${jsonString};`, "utf8");

    } catch (e) {
        console.log("Error occured while creating the file");
    }

    //  const result = Object.values(wordMap).filter((group) => group.length > 1);
    return wordMap;
};

const IndexPage = () => {
    //const wordsWithSameLetters = findWordsWithSameLetters(ALLCLEANWORDS);

    return (<></>
        // <div>
        //     <h1>Words exactly same without space or '-' : {wordsWithSameLetters.length}</h1>
        //     <ul>
        //         {wordsWithSameLetters.map((word, index) => (
        //             <li key={index}>{word}</li>
        //         ))}
        //     </ul>
        // </div>
    );
};

export default IndexPage;
