import React from "react";
import LinkPagination from "@app/browse/LinkPagination";
import { promises as fs } from "fs";
import FINALCLEANWORDS from "@app/browse/FINALCLEANWORDS";

export async function generateMetadata({ params }, parent) {
  const L = decodeURIComponent(params.letter);
  let pagenumber = params.pagenumber;
  // read route params
  let titleStr = `Letter ${L} Dictionary: Page ${pagenumber}`;
  const descriptionStr = `Browse letter ${L} Dictionary at WordPapa - Page ${pagenumber}`;
  return {
    title: titleStr,
    description: descriptionStr,
    alternates: {
      canonical: `/browse/${L}`,
    },
  };
}

function countSpacesAndHyphens(word) {
  const regex = /[\s-]/g;
  const matches = word.match(regex);
  return matches ? matches.length : 0;
}

async function getWords(l) {
  // const filePath = process.cwd() + "/app/browse/cleanwords.txt"; // Replace with the actual path to your file.
  const regexZero = /^[a-zA-Z0-9 -]+$/;
  const regex = /^[a-zA-Z]+$/; //to find words which contain characters or digits
  try {
    // const fileContent = await fs.readFile(filePath, "utf8");
    // const linksArray = fileContent.split("\n");

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
  let words = await getWords(params.letter);
  let pagenumber = params.pagenumber;
  // read route params
  const L = decodeURIComponent(params.letter);
  let titleStr = `Letter ${L} Dictionary: Page ${pagenumber}`;

  return (
    <>
      <h1 className="mb-3 text-5xl font-bold">{titleStr}</h1>
      <LinkPagination
        links={words}
        linksPerPage={300}
        pagenumber={pagenumber}
        letter={params.letter}
      />
    </>
  );
};

export default Page;
