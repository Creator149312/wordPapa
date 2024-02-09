import { promises as fs } from "fs";
const BASE_URL = "https://words.englishbix.com";

/**
 * This file is used to generate multiple sitemaps
 */

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

export async function generateSitemaps() {
  // calculate the number of sitemaps needed
  return [
    { id: "a-words" },
    { id: "b-words" },
    { id: "c-words" },
    { id: "d-words" },
    { id: "e-words" },
    { id: "f-words" },
    { id: "g-words" },
    { id: "h-words" },
    { id: "i-words" },
    { id: "j-words" },
    { id: "k-words" },
    { id: "l-words" },
    { id: "m-words" },
    { id: "n-words" },
    { id: "o-words" },
    { id: "p-words" },
    { id: "q-words" },
    { id: "r-words" },
    { id: "s-words" },
    { id: "t-words" },
    { id: "u-words" },
    { id: "v-words" },
    { id: "w-words" },
    { id: "x-words" },
    { id: "y-words" },
    { id: "z-words" },
  ];
}

export default async function sitemap({ id }) {
  // Google's limit is 50,000 URLs per sitemap
  const products = await getWords(id.split("-")[0]);

  return products.map((product) => ({
    url: `${BASE_URL}/define/${product}`.trim(),
    lastModified: new Date(),
  }));
}
