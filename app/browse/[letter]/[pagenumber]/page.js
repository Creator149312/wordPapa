import React from "react";
import LinkPagination from "@app/browse/LinkPagination";
import { promises as fs } from "fs";

let titleStr = "";
export async function generateMetadata({ params }, parent) {
  const L  = decodeURIComponent(params.letter);
  let pagenumber = params.pagenumber;
  // read route params
   titleStr = `Letter ${L} Dictionary: Page ${pagenumber}`;
  const descriptionStr = `Browse letter ${L} Dictionary at WordPapa - Page ${pagenumber}`;
  return {
    title: titleStr,
    description: descriptionStr ,
  }
}

function countSpacesAndHyphens(word) {
  const regex = /[\s-]/g;
  const matches = word.match(regex);
  return matches ? matches.length : 0;
}

async function getWords(l) {
  const filePath = process.cwd() + "/app/browse/cleanwords.txt"; // Replace with the actual path to your file.
  const regex = /^[a-zA-Z0-9 -]+$/; //to find words which contain characters or digits 
  try {
    const fileContent = await fs.readFile(filePath, "utf8");
    const linksArray = fileContent.split("\n");
    
    if (l === "0") {
      return linksArray.filter(
        (word) => {
          if (!/[a-zA-Z]/.test(word.charAt(0))) {
            if (regex.test(word) && word.length > 1) {
              //checking if word is a word or compound words with maximum of two words.
              if (countSpacesAndHyphens(word) <= 1) return true;
              else return false;
            }
          }
        }
      );
    } else {
      return linksArray.filter((word) => {
        if (word.charAt(0) === l) {
          if (regex.test(word) && word.length > 1) {
            //checking if word is a word or compound words with maximum of two words.
            if (countSpacesAndHyphens(word) <= 1) return true;
            else return false;
          }
        }
      });
    }
  } catch (error) {
    throw new Error(`Error reading the file: ${error.message}`);
  }
}

const Page = async ({ params }) => {
  let words = await getWords(params.letter);
  let pagenumber = params.pagenumber;

  return (
    <>
    <h1 className="mb-3 text-4xl font-bold">{titleStr}</h1>
    <LinkPagination
      links={words}
      linksPerPage={100}
      pagenumber={pagenumber}
      letter={params.letter}
    />
    </>
  );
};

export default Page;