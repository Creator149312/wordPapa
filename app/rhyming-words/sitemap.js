import rhymingWordsArray from "./rhyming-words";
const BASE_URL = "https://words.englishbix.com";

export const revalidate = 36000;

export default async function sitemap({ id }) {
  return rhymingWordsArray.map((word) => ({
    url: `${BASE_URL}/rhyming-words/${word}`.trim(),
    lastModified: new Date(),
  }));
}
