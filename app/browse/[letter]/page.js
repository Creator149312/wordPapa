import React from "react";
import LinkPagination from "../LinkPagination";
import { redirect } from "next/navigation";
import FINALCLEANWORDS from "../FINALCLEANWORDS";
import { promises as fs } from "fs";

let titleStr = "";

function countSpacesAndHyphens(word) {
  const regex = /[\s-]/g;
  const matches = word.match(regex);
  return matches ? matches.length : 0;
}

function checkLengthandLetter(l) {
  return (
    l.length === 1 &&
    (l === "0" || (l.charCodeAt(0) >= 97 && l.charCodeAt(0) <= 122))
  );
}

export async function generateMetadata({ params }, parent) {
  const L = decodeURIComponent(params.letter);

  if (checkLengthandLetter(L)) {
    // read route params
    titleStr = `Letter ${L.toUpperCase()} Dictionary`;
    const descriptionStr = `Browse letter ${L} Dictionary at WordPapa`;
    return {
      title: titleStr,
      description: descriptionStr,
    };
  }
}

async function getWords(l) {
  const filePath = process.cwd() + "/app/browse/cleanwords.txt"; // Replace with the actual path to your file.
  const regexZero = /^[a-zA-Z0-9 -]+$/; //to find words which contain characters or digits
  const regex = /^[a-zA-Z]+$/; //words without spaces, hyphens and digits
  try {
    // const fileContent = await fs.readFile(filePath, "utf8");
    // const linksArray = fileContent.split("\n");
    //console.log("Total Words = " + linksArray.length);
    if (l === "0") {
      return FINALCLEANWORDS.filter((word) => {
        if (!/[a-zA-Z]/.test(word.charAt(0))) {
          if (regexZero.test(word) && word.length > 1) {
            //checking if word is a word or compound words with maximum of two words.
            if (countSpacesAndHyphens(word) <= 0) return true;
            else return false;
          }
        }
      });
    } else {
      return FINALCLEANWORDS.filter((word) => {
        if (word.charAt(0) === l) {
          if (regex.test(word) && word.length > 1) {
            //checking if word is a word or compound words with maximum of two words.
            // if (countSpacesAndHyphens(word) <= 1) return true;
            // else return false;
            return true;
          } else {
            return false;
          }
        }
      });
    }
  } catch (error) {
    // here we'll not throw error instead we return empty array
    // throw new Error(`Error reading the file: ${error.message}`);

    return [];
  }
}

const Page = async ({ params }) => {
  if (checkLengthandLetter(params.letter)) {
    let words = await getWords(params.letter);

    let pagenumber = params.pagenumber;
    // read route params
    const L = decodeURIComponent(params.letter);
    let titleStr = `Letter ${L} Dictionary`;

    return (
      <>
        <h1 className="mb-3 text-5xl font-bold">{titleStr}</h1>
        <LinkPagination
          links={words}
          linksPerPage={300}
          pagenumber={1}
          letter={params.letter}
        />
      </>
    );
  } else {
    redirect("/browse");
  }
};

export default Page;
