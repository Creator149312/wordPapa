import { promises as fs } from "fs";
const BASE_URL = "https://words.englishbix.com";

/**
 * This file is used to generate multiple sitemaps
 */
export const revalidate = 60;

async function getWords(l) {
    const filePath = process.cwd() + "/app/browse/cleanwords.txt"; // Replace with the actual path to your file.
    const regex = /^[a-zA-Z]+$/;
    // const pluralSuffixes = ["s", "es", "ies", "ves"]; // Plural suffixes

    try {
        const fileContent = await fs.readFile(filePath, "utf8");
        const linksArray = fileContent.split("\n");
        if (l === "{") {
            return linksArray.filter(
                (word) => {
                    if (!/[a-zA-Z]/.test(word.charAt(0)) && !(word.includes("-") || word.includes(" "))) return true;
                }
            );
        } else {
            // we want only those words which have length > 1 and are not plurals or with spaces or other special characters
            return linksArray.filter((word) => {
                word = word.trim();
                if (word.charAt(0) === l && regex.test(word) && word.length > 1 && !(word.includes("-") || word.includes(" "))) {
                    return true;
                }
            });
        }
    } catch (error) {
        console.log(`Error reading the file: ${error.message}`);
    }
}

export default async function sitemap(parent) {
    // console.log(parent);
    // const products = await getWords(params.letter);

    // console.log("Total Products found - ", products.length);

    // return products.map((product) => ({
    //     url: `${BASE_URL}/define/${product}`.trim(),
    //     lastModified: new Date(),
    // }));
}
