import React from "react";
import LinkPagination from "../LinkPagination";
import { promises as fs } from 'fs';

async function getWords(l) {
  const filePath = process.cwd() + '/app/browse/english-wordlist.txt' // Replace with the actual path to your file.

  try {
    const fileContent =  await fs.readFile(filePath, 'utf8');
    const linksArray = fileContent.split("\n");
    // console.log("Total Words = " + linksArray.length);
    return linksArray.filter((word) => word.charAt(1) === l);
  } catch (error) {
    throw new Error(`Error reading the file: ${error.message}`);
  }
}

const Page = async ({ params }) => {
  let words = await getWords(params.letter);

  return <LinkPagination links={words} linksPerPage={100} pagenumber={1} letter={params.letter}/>;
};

export default Page;
