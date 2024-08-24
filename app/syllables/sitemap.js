import syllableWordsArray from "./syllable-words";
const BASE_URL = "https://words.englishbix.com";

export const revalidate = 0;

export default async function sitemap({ id }) {
  return syllableWordsArray.map((word) => ({
    url: `${BASE_URL}/syllables/${word}`.trim(),
    lastModified: new Date(),
  }));
}
