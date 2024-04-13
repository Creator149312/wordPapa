const BASE_URL = "https://words.englishbix.com";

/**
 * This file is used to generate multiple sitemaps
 */

//Opting out of Full Route Cache, or in other words, dynamically render components for every incoming request, by:
//Using the dynamic = 'force-dynamic' or revalidate = 0 route segment
export const revalidate = 0;

const startPhrases = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const endPhrases = ["f", "o","s","y", "z", "fe", "ment", "ss", "ies", "sh", "ing", "us", "es", "ves"];

export default async function sitemap() {

    const allPhrasesMap = [];
    startPhrases.map((word) => {
        allPhrasesMap.push({
            url: `${BASE_URL}/browse/nouns/${word}`.trim(),
            lastModified: new Date(),
        })
    });

    endPhrases.map((word) => {
        allPhrasesMap.push({
            url: `${BASE_URL}/browse/nouns/end/${word}`.trim(),
            lastModified: new Date(),
        })
    });

    // console.log("count of all the links", allPhrasesMap.length);

    return allPhrasesMap;
}
