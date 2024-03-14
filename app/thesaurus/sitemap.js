import synonymWordsArray from "./synonym-words";
import synonymsToAvoid from "./synonym-to-avoid";
const BASE_URL = "https://words.englishbix.com";
export const revalidate = 0;

export default async function sitemap({ id }) {
  const AllWords = new Set();

  // const regex = /^\S+$/; // Matches any word that doesn't contain spaces
  const regex = /^[a-zA-Z0-9 -]+$/; //to find words which contain characters or digits 

  synonymWordsArray.forEach((word) => {
    if (regex.test(word) && !synonymsToAvoid.includes(word)) {
      AllWords.add(word);
    }
  });

  const AllWordsArray = [...AllWords];

  //console.log(AllWordsArray.length);

  return AllWordsArray.map((word) => {
    word = word.replace(/ /g, "-");

    return {
      url: `${BASE_URL}/thesaurus/${word}`.trim(),
      lastModified: new Date(),
    };
  });
}
