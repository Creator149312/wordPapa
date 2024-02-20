import React from "react";
import LinkPagination from "../LinkPagination";
import { promises as fs } from "fs";

let titleStr = "";
export async function generateMetadata({ params }, parent) {
  const L  = decodeURIComponent(params.letter);
  // read route params
  titleStr = `Dictionary of Letter ${L.toUpperCase()} Words in English`;
  const descriptionStr = `Browse definitions and meanings of words that begin with the letter ${L} at WordPapa`;
  return {
    title: titleStr,
    description: descriptionStr ,
  }
}

async function getWords(l) {
  const filePath = process.cwd() + "/app/browse/cleanwords.txt"; // Replace with the actual path to your file.

  try {
    const fileContent = await fs.readFile(filePath, "utf8");
    const linksArray = fileContent.split("\n");
    // console.log("Total Words = " + linksArray.length);
    if (l === "0") {
      return linksArray.filter(
        (word) => !/[a-zA-Z]/.test(word.charAt(0)) === true
      );
    } else {
      return linksArray.filter((word) => {
        if (word.charAt(0) === l) {
          if (word.includes("-") || word.includes(" ")) return false; //exclude the compound words and words with hyphes or spaces
          else return true;
        }
      });
    }
  } catch (error) {
    throw new Error(`Error reading the file: ${error.message}`);
  }
}

const Page = async ({ params }) => {
  let words = await getWords(params.letter);

  return (
    <div>
    <h1>{titleStr}</h1>
    <LinkPagination
      links={words}
      linksPerPage={100}
      pagenumber={1}
      letter={params.letter}
    />
    </div>
  );
};

export default Page;
