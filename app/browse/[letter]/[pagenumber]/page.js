import React from "react";
import LinkPagination from "@app/browse/LinkPagination";
import { promises as fs } from 'fs';

async function getWords(l) {
  const filePath = process.cwd() + '/app/browse/english-wordlist.txt' // Replace with the actual path to your file.

  try {
    const fileContent =  await fs.readFile(filePath, 'utf8');
    const linksArray = fileContent.split("\n");

    console.log("Number of Words = " + linksArray.length)
    return linksArray.filter((word) => word.charAt(1) === l);  //filter based on starting letter of word
  } catch (error) {
    throw new Error(`Error reading the file: ${error.message}`);
  }
}

const Page = async ({ params }) => {
  let words = await getWords(params.letter);
  let pagenumber = params.pagenumber;

  return <LinkPagination links={words} linksPerPage={100} pagenumber={pagenumber} letter={params.letter}/>;
};

export default Page;
