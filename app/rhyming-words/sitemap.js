import rhymingWordsArray from "./rhyming-words";
const BASE_URL = "https://words.englishbix.com";

export const revalidate = 360;

export default async function sitemap({ id }) {

  const AllWords = new Set();

  // const regex = /^\S+$/; // Matches any word that doesn't contain spaces
  const regex = /^[a-zA-Z0-9 -]+$/; //to find words which contain characters or digits 
  const simpleRegex = /^[a-zA-Z0-9]+$/; // to find words which only contain letters

  rhymingWordsArray.forEach((word) => {
    if (simpleRegex.test(word)) {
      AllWords.add(word);
    }
  });

  const AllWordsArray = [...AllWords];

  return AllWordsArray.map((word) => ({
    url: `${BASE_URL}/rhyming-words/${word}`.trim(),
    lastModified: new Date(),
  }));
}
