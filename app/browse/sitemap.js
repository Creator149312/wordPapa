import { promises as fs } from "fs";
const BASE_URL = "https://words.englishbix.com";

/**
 * This file is used to generate multiple sitemaps
 */

//Opting out of Full Route Cache, or in other words, dynamically render components for every incoming request, by:
//Using the dynamic = 'force-dynamic' or revalidate = 0 route segment
export const revalidate = 0; 

async function getWords(l) {
  const filePath = process.cwd() + "/app/browse/cleanwords.txt"; // Replace with the actual path to your file.
  const regex = /^[a-zA-Z]+$/;
  // const pluralSuffixes = ["s", "es", "ies", "ves"]; // Plural suffixes

  try {
    const fileContent = await fs.readFile(filePath, "utf8");
    const linksArray = fileContent.split("\n");
    if (l === "{") {
      return linksArray.filter(
        (word) => {
          if (!/[a-zA-Z]/.test(word.charAt(0)) && !(word.includes("-") || word.includes(" "))) return true;
        }
      );
    } else {
      // we want only those words which have length > 1 and are not plurals or with spaces or other special characters
      return linksArray.filter((word) => {
        word = word.trim();
        if (word.charAt(0) === l && regex.test(word) && word.length > 1 && !(word.includes("-") || word.includes(" "))) {
          return true;
        }
      });
    }
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
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
    { id: 9 },
    { id: 10 },
    { id: 11 },
    { id: 12 },
    { id: 13 },
    { id: 14 },
    { id: 15 },
    { id: 16 },
    { id: 17 },
    { id: 18 },
    { id: 19 },
    { id: 20 },
    { id: 21 },
    { id: 22 },
    { id: 23 },
    { id: 24 },
    { id: 25 },
    { id: 26 }
  ]

  return arrayOfObjects;
}

export default async function sitemap({ id }) {
  const Fetchedwords = await getWords(String.fromCharCode(id + 97));

  return Fetchedwords.map((word) => ({
    url: `${BASE_URL}/define/${word}`.trim(),
    lastModified: new Date(),
  }));
}
