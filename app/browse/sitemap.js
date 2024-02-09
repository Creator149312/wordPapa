import { promises as fs } from "fs";
const BASE_URL = "https://words.englishbix.com";

/**
 * This file is used to generate multiple sitemaps
 */
function printAsciiCharacters(str) {
  for (let i = 0; i < str.length; i++) {
    const char = str.charAt(i);
    const ascii = char.charCodeAt(0);
    console.log(`Character: ${char}, ASCII: ${ascii}`);
  }
}

async function getWords(l) {
  const filePath = process.cwd() + "/app/browse/actualWords.txt"; // Replace with the actual path to your file.
  const regex = /^[a-zA-Z]+$/;
  try {
    const fileContent = await fs.readFile(filePath, "utf8");
    const linksArray = fileContent.split("\n");
    // console.log("Total Words = " + linksArray.length);
    if (l === "0") {
      return linksArray.filter(
        (word) => !/[a-zA-Z]/.test(word.charAt(0)) === true
      );
    } else {
      return linksArray.filter((word) => {
        word = word.trim();
        if (word.charAt(0) === l && regex.test(word)) return true;
      });
    }
  } catch (error) {
    throw new Error(`Error reading the file: ${error.message}`);
  }
}

export async function generateSitemaps() {
  // calculate the number of sitemaps needed
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];
}

export default async function sitemap({ id }) {
  // Google's limit is 50,000 URLs per sitemap
  const products = await getWords(String.fromCharCode(97 + id));
  console.log(products.length); 
  return products.map((product) => ({
    url: `${BASE_URL}/define/${product}`.trim(),
    lastModified: new Date(),
  }));
}
