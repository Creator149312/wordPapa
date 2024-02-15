import unScrambledWordsArray from "./unscrambled-words"
const BASE_URL = "https://words.englishbix.com";

export const revalidate = 0;

export default async function sitemap({ id }) {
  const wordsWithoutSpaces = new Set();

  const regex = /^\S+$/; // Matches any word that doesn't contain spaces

  unScrambledWordsArray.forEach((word) => {
    if (regex.test(word)) {
        wordsWithoutSpaces.add(word);
    }
  });

  const wordsWithoutSpacesArray = [...wordsWithoutSpaces];

  return wordsWithoutSpacesArray.map((word) => ({
    url: `${BASE_URL}/word-finder/${word}`.trim(),
    lastModified: new Date(),
  }));
}
