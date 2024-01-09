import { promises as fs } from 'fs';

async function getWords() {
  const filePath = process.cwd() + '/app/browse/actualWords.txt' // Replace with the actual path to your file.

  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const linksArray = fileContent.split("\n");
    const finalArray = linksArray.filter((la) => !(la.includes("-") || la.includes(" ")) && true );

    return finalArray;
  } catch (error) {
    throw new Error(`Error reading the file: ${error.message}`);
  }
}

const Page = async () => {
  let words = await getWords();

  console.log("Total Single Words = " + words.length);
  let someWords = [];
  // for(let i = 0; i < 100; i++){
  //   someWords.push(words[i]);
  // }

  // console.log(someWords);
};

export default Page;