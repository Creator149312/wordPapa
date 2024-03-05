import React from "react";
import LinkPagination from "../LinkPagination";
import { redirect } from "next/navigation";
import { promises as fs } from "fs";

let titleStr = "";

function checkLengthandLetter(l) {
  return (l.length === 1 && (l.charCodeAt(0) >= 97 && l.charCodeAt(0) <= 122));
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
    }
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
  if (checkLengthandLetter(params.letter)) {
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
    )
  } else {
    redirect("/browse");
  };
};

export default Page;
