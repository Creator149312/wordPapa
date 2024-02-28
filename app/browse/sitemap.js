import { promises as fs } from "fs";
const BASE_URL = "https://words.englishbix.com";

/**
 * This file is used to generate multiple sitemaps
 */

//Opting out of Full Route Cache, or in other words, dynamically render components for every incoming request, by:
//Using the dynamic = 'force-dynamic' or revalidate = 0 route segment
export const revalidate = 0;

async function getWords(start, end) {
  const filePath = process.cwd() + "/app/browse/cleanwords.txt"; // Replace with the actual path to your file.
  const regex = /^[a-zA-Z]+$/;
  // const pluralSuffixes = ["s", "es", "ies", "ves"]; // Plural suffixes

  try {
    const fileContent = await fs.readFile(filePath, "utf8");
    const linksArray = fileContent.split("\n");

    // we want only those words which have length > 1 and are not plurals or with spaces or other special characters
    return linksArray.filter((word, index) => {
      if (index >= start && index < end) {
        word = word.trim();
        if ((regex.test(word) || (!/[a-zA-Z]/.test(word.charAt(0)))) && word.length > 1 && !(word.includes("-") || word.includes(" "))) {
          return true;
        }
      }
    });

  } catch (error) {
    console.log(`Error reading the file: ${error.message}`);
  }
}

export async function generateSitemaps() {
  const arrayOfObjects = [
    { id: 0 },
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 }
  ]

  return arrayOfObjects;
}

export default async function sitemap({ id }) {

  // Google's limit is 50,000 URLs per sitemap
  const start = id * 25000;
  const end = start + 25000;
  const Fetchedwords = await getWords(start, end);

  return Fetchedwords.map((word) => ({
    url: `${BASE_URL}/define/${word}`.trim(),
    lastModified: new Date(),
  }));
}
