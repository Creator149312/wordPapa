import syllableWordsArray from "./syllable-words";
const BASE_URL = "https://words.englishbix.com";

export const revalidate = 0;

export default async function sitemap({ id }) {
  const simpleRegex = /^[a-zA-Z0-9]+$/; // to find words which only contain letters
  const AllWords = new Set();
  syllableWordsArray.forEach((word) => {
    if (simpleRegex.test(word)) {
      AllWords.add(word);
    }
  });
  
  const AllWordsArray = [...AllWords];

  // console.log("Total Words = ", AllWordsArray.length);

  return AllWordsArray.map((word) => ({
    url: `${BASE_URL}/syllables/${word}`.trim(),
    lastModified: new Date(),
  }));
}
