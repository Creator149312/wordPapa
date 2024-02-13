import { promises as fs } from "fs";
const BASE_URL = "https://words.englishbix.com";

/**
 * This file is used to generate multiple sitemaps
 */
export const revalidate = 13600;

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
  const arrayOfObjects = [];

  for (let i = 0; i <= 25; i++) {
    const obj = { id: i };
    arrayOfObjects.push(obj);
  }

  return arrayOfObjects;
}

export default async function sitemap({ id }) {
  // Google's limit is 50,000 URLs per sitemap
  const products = await getWords(String.fromCharCode(id + 97));

  return products.map((product) => ({
    url: `${BASE_URL}/define/${product}`.trim(),
    lastModified: new Date(),
  }));
}
