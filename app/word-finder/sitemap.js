import unScrambledWordsArray from "./unscrambled-words"
const BASE_URL = "https://words.englishbix.com";

export const revalidate = 0;

export default async function sitemap({ id }) {
  const AllWords = new Set();

  // const regex = /^\S+$/; // Matches any word that doesn't contain spaces
  const regex = /^[a-zA-Z0-9 -]+$/; //to find words which contain characters or digits 
  const simpleRegex = /^[a-zA-Z0-9]+$/; // to find words which only contain letters

  unScrambledWordsArray.forEach((word) => {
    if (simpleRegex.test(word)) {
        AllWords.add(word);
    }
  });

  const AllWordsArray = [...AllWords];

  return AllWordsArray.map((word) => ({
    url: `${BASE_URL}/word-finder/${word}`.trim(),
    lastModified: new Date(),
  }));
}
