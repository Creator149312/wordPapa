const BASE_URL = "https://words.englishbix.com";

/**
 * This file is used to generate multiple sitemaps
 */

//Opting out of Full Route Cache, or in other words, dynamically render components for every incoming request, by:
//Using the dynamic = 'force-dynamic' or revalidate = 0 route segment
export const revalidate = 0;

const startPhrases = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "re"];
const endPhrases = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "ing", "ed", "ch", "sh", "ee", "en", "es", "ie", "ss", "ir"];

export default async function sitemap() {

    const allPhrasesMap = [];
    startPhrases.map((word) => {
        allPhrasesMap.push({
            url: `${BASE_URL}/browse/verbs/${word}`.trim(),
            lastModified: new Date(),
        })
    });

    endPhrases.map((word) => {
        allPhrasesMap.push({
            url: `${BASE_URL}/browse/verbs/end/${word}`.trim(),
            lastModified: new Date(),
        })
    });

    // console.log("count of all the links", allPhrasesMap.length);

    return allPhrasesMap;
}
