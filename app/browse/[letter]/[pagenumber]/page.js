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

async function getWords(l) {
  const filePath = process.cwd() + "/app/browse/cleanwords.txt"; // Replace with the actual path to your file.

  try {
    const fileContent = await fs.readFile(filePath, "utf8");
    const linksArray = fileContent.split("\n");

    if (l === "0") {
      return linksArray.filter(
        (word) => !/[a-zA-Z]/.test(word.charAt(0)) === true
      );
    } else {
      return linksArray.filter((word) => {
        if (word.charAt(0) === l) { return true; }
        //   if (word.includes("-") || word.includes(" ")) return false; //exclude the compound words and words with hyphes or spaces
        //   else return true;
        // }
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
    <div>
    <h1>{titleStr}</h1>
    <LinkPagination
      links={words}
      linksPerPage={100}
      pagenumber={pagenumber}
      letter={params.letter}
    />
    </div>
  );
};

export default Page;