import { promises as fs } from "fs";

let wordsToCheck = [];

async function getWords(l) {
  const filePath = process.cwd() + "/app/browse/actualWords.txt"; // Replace with the actual path to your file.
  const regex = /^[a-zA-Z]+$/;
  const pluralSuffixes = ["s", "es", "ies", "ves"]; // Plural suffixes

  try {
    const fileContent = await fs.readFile(filePath, "utf8");
    const linksArray = fileContent.split("\n");
    if (l === "0") {
      return linksArray.filter(
        (word) => !/[a-zA-Z]/.test(word.charAt(0)) === true
      );
    } else {
      // we want only those words which have length > 1 and are not plurals or with spaces or other special characters
      return linksArray.filter((word) => {
        word = word.trim();
        if (word.charAt(0) === l && regex.test(word) && word.length > 1) {
          return !pluralSuffixes.some((suffix) => word.endsWith(suffix));
        }
      });
    }
  } catch (error) {
    console.log(`Error reading the file: ${error.message}`);
  }
}

async function CheckWords() {
  let nonWords = [];
  wordsToCheck = await getWords("x");
  await processWords(wordsToCheck.slice(1, 300));
  console.log("Non Words = ", nonWords.length);

  console.log("Total Words", wordsToCheck.length);

  async function checkDefinition(word) {
    const response = await fetch(
      `https://api.datamuse.com/words?sp=${word}&md=d`
    );
    const data = await response.json();

    if (data.length === 0 || !data[0].defs) {
      return true; // Definition does not exist
    }

    return false; // Definition exists
  }

  async function processWords(words) {
    const nonWordsArray = [];

    for (const word of words) {
      const hasDefinition = await checkDefinition(word);
      if (hasDefinition) {
        nonWordsArray.push(word);
      }
    }

    nonWords = nonWordsArray;
    console.log("Words without Definition", nonWords.length)
  }

  return (
    <div>
      <ul>
        {nonWords.map((word, index) => (
          <li key={index}>{word}</li>
        ))}
      </ul>
    </div>
  );
}

export default CheckWords;
