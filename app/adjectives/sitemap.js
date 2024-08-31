import ADJECTIVEWORDSLIST from "./adjectivewordslist";
const BASE_URL = "https://words.englishbix.com";

export const revalidate = 360;

export default async function sitemap({ id }) {
  return ADJECTIVEWORDSLIST.map((word) => ({
    url: `${BASE_URL}/adjectives/${word}`.trim(),
    lastModified: new Date(),
  }));
}
