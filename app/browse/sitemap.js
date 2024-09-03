import { promises as fs } from "fs";
import FINALCLEANWORDS from "./FINALCLEANWORDS";
import { WORDMAP } from "../define/WORDMAP";
const BASE_URL = "https://words.englishbix.com";

/**
 * This file is used to generate multiple sitemaps
 */

//Opting out of Full Route Cache, or in other words, dynamically render components for every incoming request, by:
//Using the dynamic = 'force-dynamic' or revalidate = 0 route segment
export const revalidate = 0;

function countSpacesAndHyphens(word) {
  const regex = /[\s-]/g;
  const matches = word.match(regex);
  return matches ? matches.length : 0;
}

/* 
previous GetWords method with WORDMAP 
*/
// async function getWords(start, end) {
//   const regex = /^[a-zA-Z0-9 -]+$/; //to find words which contain characters or digits

//   return ALLCLEANWORDS.filter((word, index) => {
//     if (index >= start && index < end) {
//       word = word.trim();
//       if (regex.test(word) && word.length > 1) {
//         //checking if word is a word or compound words with maximum of two words.
//         if (countSpacesAndHyphens(word) <= 1) return true;
//         else return false;
//       }
//     }
//   });
// }

//new getwords method using WORDMAP
async function getWordsUsingWordMap(start, end) {
  const regex = /^[a-zA-Z]+$/; //to find words which contain characters but not digits

  // console.log("Total Words for Sitemap", FINALCLEANWORDS.length);

  let sitemapWords = FINALCLEANWORDS.filter((word, index) => {
    if (index >= start && index < end) {
      word = word.trim();
      if (regex.test(word) && word.length > 1) {
        //checking if word is a word or compound words with maximum of two words.
        // if (countSpacesAndHyphens(word) <= 0) return true;
        // else return false;
        return true;
      } else {
        return false;
      }
    }
  });

  // filter the words which are compound in nature foreg. [pullup] => [pull-up]
  return Array.from(
      new Set(
        sitemapWords.filter((word) => {
          let key = word.replace(/[ -]/g, "");
          let decodedWord = WORDMAP[key] ? WORDMAP[key] : word;
          if(decodedWord.includes('-')){
            return false;
          }else{
            return true;
          }
        })
      )
    );


  // keep only unique words
  // return Array.from(
  //   new Set(
  //     sitemapWords.map((word) => {
  //       let key = word.replace(/[ -]/g, "");
  //       let decodedWord = WORDMAP[key] ? WORDMAP[key] : word;

  //       return decodedWord;
  //     })
  //   )
  // );
}

export async function generateSitemaps() {
  const arrayOfObjects = [
    { id: 0 },
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
  ];

  return arrayOfObjects;
}

export default async function sitemap({ id }) {
  // Google's limit is 50,000 URLs per sitemap
  const start = id * 13000;
  const end = start + 13000;
  const Fetchedwords = await getWordsUsingWordMap(start, end);
  // console.log(id + "     " + Fetchedwords.length);

  //without WORDMAP
  // return Fetchedwords.map((word) => {
  //   word = word.replace(/ /g, "-");

  //   return {
  //     url: `${BASE_URL}/define/${word}`.trim(),
  //     lastModified: new Date(),
  //   };
  // });

  //using WORDMAP
  return Fetchedwords.map((word) => {
    return {
      url: `${BASE_URL}/define/${word}`.trim(),
      lastModified: new Date(),
    };
  });
}
